using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Pacientes.AgregarPaciente;
using Softlithe.ERP.Abstracciones.BW.Pacientes.BuscarPacientePorNombreOIdentificacion;
using Softlithe.ERP.Abstracciones.BW.Pacientes.ObtenerListaDePacientes;
using Softlithe.ERP.Abstracciones.BW.Pacientes.ActualizarPaciente;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;

namespace Softlithe.ERP.Api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class PacientesController : ControllerBase
	{

		private readonly IObtenerListaDePacientesBW _obtenerListaDePacientes;
		private readonly IBuscarPacientePorNombreOIdentificacionBW _buscarPacientePorNombreOIdentificacionBW;
		private readonly IAgregarPacienteBW _agregarPacienteBW;
		private readonly IActualizarPacienteBW _actualizarPacienteBW;
		public PacientesController(IObtenerListaDePacientesBW obtenerListaDePacientes,
			IBuscarPacientePorNombreOIdentificacionBW buscarPacientePorNombreOIdentificacionBW,
			IAgregarPacienteBW agregarPacienteBW,
			IActualizarPacienteBW actualizarPacienteBW) 
		{
			_obtenerListaDePacientes = obtenerListaDePacientes;
			_buscarPacientePorNombreOIdentificacionBW = buscarPacientePorNombreOIdentificacionBW;
			_agregarPacienteBW = agregarPacienteBW;
			_actualizarPacienteBW = actualizarPacienteBW;
		}
		// GET /Pacientes
		[HttpGet]
		public async Task<IActionResult> GetPacientes()
		{
			var pacientes = await _obtenerListaDePacientes.Obtener();
			return Ok(pacientes);
		}
		// GET /Pacientes/BuscarPacientePorNombreOIdentificacion?parametroDeBusqueda={value}
		[HttpGet("BuscarPacientePorNombreOIdentificacion")]
		public async Task<IActionResult> BuscarPacientePorNombreOIdentificacion([FromQuery] string parametroDeBusqueda = "")
		{
			var laListaDePacientes = await _buscarPacientePorNombreOIdentificacionBW.Obtener(parametroDeBusqueda);
			return Ok(laListaDePacientes);
		}

		// POST /Pacientes/AgregarPaciente
		[HttpPost("AgregarPaciente")]
		public async Task<IActionResult> AgregarPaciente([FromBody] PacienteDto elPaciente)
		{
			var resultado = await _agregarPacienteBW.Agregar(elPaciente);
			return Ok(new { EsCorrecto = true, Mensaje = "Paciente creado correctamente.", Data = new { numeroDePaciente = resultado } });
		}

		// PUT /Pacientes/{numeroDePaciente}
		[HttpPut("{numeroDePaciente}")]
		public async Task<IActionResult> ActualizarPaciente(int numeroDePaciente, [FromBody] PacienteDto elPaciente)
		{
			var resultado = await _actualizarPacienteBW.Actualizar(numeroDePaciente, elPaciente);
			return Ok(new { EsCorrecto = resultado.EsCorrecto, Mensaje = resultado.Mensaje });
		}

		// GET /Pacientes/Cuentas?pacienteId={id}
		[HttpGet("Cuentas")]
		public IActionResult ObtenerCuentasDePaciente([FromQuery] int pacienteId)
		{
			// TODO: Implementar lógica real para obtener cuentas
			return Ok(new object[0]);
		}

	}
}

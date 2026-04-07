using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Pacientes.AgregarPaciente;
using Softlithe.ERP.Abstracciones.BW.Pacientes.BuscarPacientePorNombreOIdentificacion;
using Softlithe.ERP.Abstracciones.BW.Pacientes.ObtenerListaDePacientes;
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
		public PacientesController(IObtenerListaDePacientesBW obtenerListaDePacientes,
			IBuscarPacientePorNombreOIdentificacionBW buscarPacientePorNombreOIdentificacionBW,
			IAgregarPacienteBW agregarPacienteBW) 
		{
			_obtenerListaDePacientes = obtenerListaDePacientes;
			_buscarPacientePorNombreOIdentificacionBW = buscarPacientePorNombreOIdentificacionBW;
			_agregarPacienteBW = agregarPacienteBW;
		}	
		// GET /Pacientes
		[HttpGet]
		public async Task<IActionResult> GetPacientes()
		{
			// TODO: Implementar lógica real
			// var pacientes = await _obtenerListaDePacientes.Obtener();
			return Ok(new List<PacienteDto>()); // Envelope no requerido para listados
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
			// TODO: Implementar lógica real
			// var resultado = await _agregarPacienteBW.Agregar(elPaciente);
			return Ok(new { EsCorrecto = true, Mensaje = "Paciente creado correctamente.", Data = new { numeroDePaciente = 0 } });
		}

		// PUT /Pacientes/{numeroDePaciente}
		[HttpPut("{numeroDePaciente}")]
		public async Task<IActionResult> ActualizarPaciente(int numeroDePaciente, [FromBody] PacienteDto elPaciente)
		{
			// TODO: Implementar lógica real para actualizar paciente
			return Ok(new { EsCorrecto = true, Mensaje = "Paciente actualizado." });
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

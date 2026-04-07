using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.AgregarEnfermedad;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.CambiarEstado;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerEnfermedadPorIdentificador;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerTodasLasEnfermedades;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;

namespace Softlithe.ERP.Api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class EnfermedadesController : ControllerBase
	{
		private readonly IObtenerTodasLasEnfermedadesBW _obtenerTodasLasEnfermedades;
		private readonly IObtenerEnfermedadPorIdentificadorBW _obtenerEnfermedadPorIdentificadorBW;
		private readonly IAgregarEnfermedadBW _agregarEnfermedadBW;
		private readonly ICambiarEstadoEnfermedadBW _cambiarEstadoEnfermedadBW;

		public EnfermedadesController(IObtenerTodasLasEnfermedadesBW obtenerTodasLasEnfermedades, IObtenerEnfermedadPorIdentificadorBW obtenerEnfermedadPorIdentificadorBW, IAgregarEnfermedadBW agregarEnfermedadBW, ICambiarEstadoEnfermedadBW cambiarEstadoEnfermedadBW)
		{
			_obtenerTodasLasEnfermedades = obtenerTodasLasEnfermedades;
			_obtenerEnfermedadPorIdentificadorBW = obtenerEnfermedadPorIdentificadorBW;
			_agregarEnfermedadBW = agregarEnfermedadBW;
			_cambiarEstadoEnfermedadBW = cambiarEstadoEnfermedadBW;
		}

		// GET: api/Enfermedades
		/// <summary>
		/// Obtiene todas las enfermedades disponibles en el sistema o filtradas por identificador (código de sucursal).
		/// </summary>
		/// <remarks>
		/// Si se proporciona el parámetro 'identificador', devuelve las enfermedades de esa sucursal.
		/// Si no se proporciona, devuelve todas las enfermedades del sistema.
		/// Devuelve una lista de enfermedades junto con el modelo de validación.
		/// </remarks>
		/// <param name="identificador">Opcional. El código único de la sucursal para filtrar las enfermedades.</param>
		/// <returns>Un objeto <see cref="EnfermedadConModeloDeValidacionResponse"/> que contiene la lista de enfermedades y el estado de la validación.</returns>
		/// <response code="200">Operación exitosa. Retorna la lista de enfermedades.</response>
		/// <response code="500">Error interno del servidor.</response>
		[HttpGet]
		public async Task<EnfermedadConModeloDeValidacionResponse> ListarEnfermedades([FromQuery] int? identificador = null)
		{
			if (identificador.HasValue)
			{
				return await _obtenerEnfermedadPorIdentificadorBW.ObtenerEnfermedadPorIdentificador(identificador.Value);
			}

			return await _obtenerTodasLasEnfermedades.ObtenerTodasLasEnfermedades();
		}

		// GET: api/Enfermedades/ObtenerEnfermedadPorIdentificador?identificador=2
		/// <summary>
		/// Obtiene las enfermedades filtradas por el identificador (código de sucursal).
		/// </summary>
		/// <remarks>
		/// El identificador es el código único de la sucursal obtenido al seleccionar la sucursal en el login.
		/// Devuelve una lista de enfermedades junto con el modelo de validación.
		/// </remarks>
		/// <param name="identificador">El código único de la sucursal.</param>
		/// <returns>Un objeto <see cref="EnfermedadConModeloDeValidacionResponse"/> que contiene la lista de enfermedades filtradas y el estado de la validación.</returns>
		/// <response code="200">Operación exitosa. Retorna la lista de enfermedades.</response>
		/// <response code="400">Identificador inválido.</response>
		/// <response code="500">Error interno del servidor.</response>
		[HttpGet("ObtenerEnfermedadPorIdentificador")]
		public async Task<EnfermedadConModeloDeValidacionResponse> ObtenerEnfermedadPorIdentificador([FromQuery] int identificador)
		{
			EnfermedadConModeloDeValidacionResponse laListaDeEnfermedades = await _obtenerEnfermedadPorIdentificadorBW.ObtenerEnfermedadPorIdentificador(identificador);
			return laListaDeEnfermedades;
		}

		// POST: api/Enfermedades
		/// <summary>
		/// Inserta una enfermedad en una sucursal en la base de datos.
		/// </summary>
		/// <remarks>
		/// Devuelve un modelo de validación para establecer si guardó la enfermedad o no.
		/// La enfermedad debe existir en el catálogo de enfermedades.
		/// </remarks>
		/// <param name="parametroEnfermedad">Objeto que contiene el ID del catálogo de enfermedad, identificador y usuario.</param>
		/// <returns>Un objeto <see cref="ModeloValidacion"/> que contiene el estado de la validación.</returns>
		/// <response code="200">Operación exitosa. Retorna un modelo de validación.</response>
		/// <response code="500">Error interno del servidor.</response>
		[HttpPost]
		public async Task<ModeloValidacion> CrearEnfermedad([FromBody] EnfermedadDto parametroEnfermedad)
		{
			ModeloValidacion resultadoModeloValidacion = await _agregarEnfermedadBW.AgregarEnfermedad(parametroEnfermedad);
			return resultadoModeloValidacion;
		}

		// POST: api/Enfermedades/{numeroEnfermedad}/estado
		/// <summary>
		/// Cambia el estado (activo/inactivo) de una enfermedad en una sucursal.
		/// </summary>
		/// <remarks>
		/// Devuelve un modelo de validación para establecer si cambió el estado correctamente.
		/// </remarks>
		/// <param name="numeroEnfermedad">El identificador único de la enfermedad en la sucursal.</param>
		/// <param name="cambiarEstadoEnfermedadDto">Objeto que contiene el nuevo estado y el usuario que realiza el cambio.</param>
		/// <returns>Un objeto <see cref="ModeloValidacion"/> que contiene el estado de la validación.</returns>
		/// <response code="200">Operación exitosa. Retorna un modelo de validación.</response>
		/// <response code="400">Parámetros inválidos.</response>
		/// <response code="500">Error interno del servidor.</response>
		[HttpPost("{numeroEnfermedad}/estado")]
		public async Task<ModeloValidacion> CambiarEstado(int numeroEnfermedad, [FromBody] CambiarEstadoEnfermedadDto cambiarEstadoEnfermedadDto)
		{
			ModeloValidacion resultadoModeloValidacion = await _cambiarEstadoEnfermedadBW.CambiarEstado(numeroEnfermedad, cambiarEstadoEnfermedadDto);
			return resultadoModeloValidacion;
		}
	}
}

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.AgregarEnfermedad;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.AgregarEnfermedadCatalogo;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.AgregarEnfermedadConCatalogo;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.CambiarEstado;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerEnfermedadCatalogo;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerEnfermedadPorIdentificador;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerEnfermedadTipo;
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
		private readonly IObtenerEnfermedadCatalogoBW _obtenerEnfermedadCatalogoBW;
		private readonly IAgregarEnfermedadCatalogoBW _agregarEnfermedadCatalogoBW;
		private readonly IAgregarEnfermedadConCatalogoBW _agregarEnfermedadConCatalogoBW;
		private readonly IObtenerEnfermedadTipoBW _obtenerEnfermedadTipoBW;

		public EnfermedadesController(
			IObtenerTodasLasEnfermedadesBW obtenerTodasLasEnfermedades, 
			IObtenerEnfermedadPorIdentificadorBW obtenerEnfermedadPorIdentificadorBW, 
			IAgregarEnfermedadBW agregarEnfermedadBW, 
			ICambiarEstadoEnfermedadBW cambiarEstadoEnfermedadBW,
			IObtenerEnfermedadCatalogoBW obtenerEnfermedadCatalogoBW,
			IAgregarEnfermedadCatalogoBW agregarEnfermedadCatalogoBW,
			IAgregarEnfermedadConCatalogoBW agregarEnfermedadConCatalogoBW,
			IObtenerEnfermedadTipoBW obtenerEnfermedadTipoBW)
		{
			_obtenerTodasLasEnfermedades = obtenerTodasLasEnfermedades;
			_obtenerEnfermedadPorIdentificadorBW = obtenerEnfermedadPorIdentificadorBW;
			_agregarEnfermedadBW = agregarEnfermedadBW;
			_cambiarEstadoEnfermedadBW = cambiarEstadoEnfermedadBW;
			_obtenerEnfermedadCatalogoBW = obtenerEnfermedadCatalogoBW;
			_agregarEnfermedadCatalogoBW = agregarEnfermedadCatalogoBW;
			_agregarEnfermedadConCatalogoBW = agregarEnfermedadConCatalogoBW;
			_obtenerEnfermedadTipoBW = obtenerEnfermedadTipoBW;
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

		// GET: api/Enfermedades/Catalogo
		/// <summary>
		/// Obtiene el catálogo completo de enfermedades disponibles en el sistema.
		/// </summary>
		/// <remarks>
		/// Retorna todas las enfermedades registradas en el catálogo junto con su tipo.
		/// Útil para poblar dropdowns o selects en la interfaz.
		/// </remarks>
		/// <returns>Una lista de <see cref="EnfermedadCatalogoResponseDto"/> con todas las enfermedades del catálogo.</returns>
		/// <response code="200">Operación exitosa. Retorna el catálogo de enfermedades.</response>
		/// <response code="500">Error interno del servidor.</response>
		[HttpGet("Catalogo")]
		public async Task<List<EnfermedadCatalogoResponseDto>> ObtenerCatalogo()
		{
			return await _obtenerEnfermedadCatalogoBW.ObtenerCatalogo();
		}

		// POST: api/Enfermedades/Catalogo
		/// <summary>
		/// Crea una nueva enfermedad en el catálogo del sistema.
		/// </summary>
		/// <remarks>
		/// Esta operación permite agregar una nueva enfermedad al catálogo central.
		/// Solo se crea en el catálogo, no se asigna aún a ninguna sucursal.
		/// Use el endpoint de AgregarEnfermedadConCatalogo para asignarla a una sucursal.
		/// </remarks>
		/// <param name="enfermedadCatalogoDto">Objeto con descripción, tipo de enfermedad y usuario.</param>
		/// <returns>Un objeto <see cref="ModeloValidacion"/> con el resultado de la operación.</returns>
		/// <response code="200">Operación exitosa. La enfermedad ha sido agregada al catálogo.</response>
		/// <response code="500">Error interno del servidor.</response>
		[HttpPost("Catalogo")]
		public async Task<ModeloValidacion> AgregarEnfermedadCatalogo([FromBody] AgregarEnfermedadCatalogoDto enfermedadCatalogoDto)
		{
			return await _agregarEnfermedadCatalogoBW.AgregarEnfermedadCatalogo(enfermedadCatalogoDto);
		}

		// POST: api/Enfermedades/AgregarConCatalogo
		/// <summary>
		/// Agrega una enfermedad a una sucursal. Si la enfermedad no existe en el catálogo, la crea primero.
		/// </summary>
		/// <remarks>
		/// Este endpoint permite que una sucursal agregue una enfermedad de dos formas:
		/// 1. Proporcionando un idEnfermedad existente (asignación simple).
		/// 2. Proporcionando descripcion y noTipo (crea la enfermedad en el catálogo y la asigna).
		/// 
		/// Si ya existe una enfermedad con la misma descripción, se reutiliza.
		/// </remarks>
		/// <param name="enfermedadConCatalogoDto">Objeto con idEnfermedad (opcional), descripcion, noTipo, identificador y usuario.</param>
		/// <returns>Un objeto <see cref="ModeloValidacion"/> con el resultado de la operación.</returns>
		/// <response code="200">Operación exitosa. La enfermedad ha sido asignada a la sucursal.</response>
		/// <response code="500">Error interno del servidor.</response>
		[HttpPost("AgregarConCatalogo")]
		public async Task<ModeloValidacion> AgregarEnfermedadConCatalogo([FromBody] AgregarEnfermedadConCatalogoDto enfermedadConCatalogoDto)
		{
			return await _agregarEnfermedadConCatalogoBW.AgregarEnfermedadConCatalogo(enfermedadConCatalogoDto);
		}

		// GET: api/Enfermedades/Tipos
		/// <summary>
		/// Obtiene todos los tipos de enfermedad disponibles en el sistema.
		/// </summary>
		/// <remarks>
		/// Útil para poblar dropdowns al registrar una enfermedad en el catálogo.
		/// </remarks>
		/// <returns>Una lista de <see cref="EnfermedadTipoDto"/> con todos los tipos de enfermedad.</returns>
		/// <response code="200">Operación exitosa. Retorna los tipos de enfermedad.</response>
		/// <response code="500">Error interno del servidor.</response>
		[HttpGet("Tipos")]
		public async Task<List<EnfermedadTipoDto>> ObtenerTipos()
		{
			return await _obtenerEnfermedadTipoBW.ObtenerTipos();
		}
	}
}

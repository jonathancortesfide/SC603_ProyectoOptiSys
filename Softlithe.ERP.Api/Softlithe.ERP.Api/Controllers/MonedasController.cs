using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Monedas.AgregarMoneda;
using Softlithe.ERP.Abstracciones.BW.Monedas.CambiarEstado;
using Softlithe.ERP.Abstracciones.BW.Monedas.ObtenerMonedasPorIdentificador;
using Softlithe.ERP.Abstracciones.BW.Monedas.ObtenerMonedaPorId;
using Softlithe.ERP.Abstracciones.BW.Monedas.ObtenerTodasLasMonedas;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;

namespace Softlithe.ERP.Api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class MonedasController : ControllerBase
	{
		private readonly IObtenerTodasLasMonedasBW _obtenerTodasLasMonedas;
		private readonly IObtenerMonedasPorIdentificadorBW _obtenerMonedasPorIdentificadorBW;
		private readonly IObtenerMonedaPorIdBW _obtenerMonedaPorIdBW;
		private readonly IAgregarMonedasBW _agregarMonedasBW;
		private readonly ICambiarEstadoMonedaBW _cambiarEstadoMonedaBW;

		public MonedasController(IObtenerTodasLasMonedasBW obtenerTodasLasMonedas, IObtenerMonedasPorIdentificadorBW obtenerMonedasPorIdentificadorBW, IObtenerMonedaPorIdBW obtenerMonedaPorIdBW, IAgregarMonedasBW agregarMonedasBW, ICambiarEstadoMonedaBW cambiarEstadoMonedaBW)
		{
			_obtenerTodasLasMonedas = obtenerTodasLasMonedas;
			_obtenerMonedasPorIdentificadorBW = obtenerMonedasPorIdentificadorBW;
			_obtenerMonedaPorIdBW = obtenerMonedaPorIdBW;
			_agregarMonedasBW = agregarMonedasBW;
			_cambiarEstadoMonedaBW = cambiarEstadoMonedaBW;
		}

		// GET: api/Monedas
		/// <summary>
		/// Obtiene todas las monedas disponibles en el sistema o filtradas por identificador (código de sucursal).
		/// </summary>
		/// <remarks>
		/// Si se proporciona el parámetro 'identificador', devuelve las monedas de esa sucursal.
		/// Si no se proporciona, devuelve todas las monedas del sistema.
		/// Devuelve una lista de monedas junto con el modelo de validación.
		/// </remarks>
		/// <param name="identificador">Opcional. El código único de la sucursal para filtrar las monedas.</param>
		/// <returns>Un objeto <see cref="MonedaConModeloDeValidacionResponse"/> que contiene la lista de monedas y el estado de la validación.</returns>
		/// <response code="200">Operación exitosa. Retorna la lista de monedas.</response>
		/// <response code="500">Error interno del servidor.</response>
		[HttpGet]
		public async Task<MonedaConModeloDeValidacionResponse> ListarMonedas([FromQuery] int? identificador = null)
		{
			if (identificador.HasValue)
			{
				return await _obtenerMonedasPorIdentificadorBW.ObtenerMonedasPorIdentificador(identificador.Value);
			}

			return await _obtenerTodasLasMonedas.Obtener();
		}

		// GET: api/Monedas/ObtenerTodasLasMonedas
		/// <summary>
		/// Obtiene todas las monedas disponibles en el sistema.
		/// </summary>
		/// <remarks>
		/// Devuelve una lista de monedas junto con el modelo de validación.
		/// </remarks>
		/// <returns>Un objeto <see cref="MonedaConModeloDeValidacionResponse"/> que contiene la lista de monedas y el estado de la validación.</returns>
		/// <response code="200">Operación exitosa. Retorna la lista de monedas.</response>
		/// <response code="500">Error interno del servidor.</response>
		[HttpGet("ObtenerTodasLasMonedas")]
		public async Task<MonedaConModeloDeValidacionResponse> ObtenerTodasLasMonedas()
		{
			MonedaConModeloDeValidacionResponse laListaDeMonedas = await _obtenerTodasLasMonedas.Obtener();
			return laListaDeMonedas;
		}

		// GET: api/Monedas/ObtenerMonedasPorIdentificador?identificador=2
		/// <summary>
		/// Obtiene las monedas filtradas por el identificador (código de sucursal).
		/// </summary>
		/// <remarks>
		/// El identificador es el código único de la sucursal obtenido al seleccionar la sucursal en el login.
		/// Devuelve una lista de monedas junto con el modelo de validación.
		/// </remarks>
		/// <param name="identificador">El código único de la sucursal.</param>
		/// <returns>Un objeto <see cref="MonedaConModeloDeValidacionResponse"/> que contiene la lista de monedas filtradas y el estado de la validación.</returns>
		/// <response code="200">Operación exitosa. Retorna la lista de monedas.</response>
		/// <response code="400">Identificador inválido.</response>
		/// <response code="500">Error interno del servidor.</response>
		[HttpGet("ObtenerMonedasPorIdentificador")]
		public async Task<MonedaConModeloDeValidacionResponse> ObtenerMonedasPorIdentificador([FromQuery] int identificador)
		{
			MonedaConModeloDeValidacionResponse laListaDeMonedas = await _obtenerMonedasPorIdentificadorBW.ObtenerMonedasPorIdentificador(identificador);
			return laListaDeMonedas;
		}

		// GET: api/Monedas/{idMoneda}
		/// <summary>
		/// Obtiene una moneda específica por su ID.
		/// </summary>
		/// <remarks>
		/// Devuelve una moneda junto con el modelo de validación.
		/// </remarks>
		/// <param name="idMoneda">El identificador único de la relación moneda-sucursal.</param>
		/// <returns>Un objeto <see cref="ModeloValidacionConDatos{T}"/> que contiene la moneda y el estado de la validación.</returns>
		/// <response code="200">Operación exitosa. Retorna la moneda.</response>
		/// <response code="404">Moneda no encontrada.</response>
		/// <response code="500">Error interno del servidor.</response>
		[HttpGet("{idMoneda}")]
		public async Task<ModeloValidacionConDatos<MonedaResponseDto?>> ObtenerMonedaPorId(int idMoneda)
		{
			ModeloValidacionConDatos<MonedaResponseDto?> resultado = await _obtenerMonedaPorIdBW.ObtenerMonedaPorId(idMoneda);
			return resultado;
		}

		// POST: api/Monedas
		/// <summary>
		/// Inserta una relación moneda-sucursal en la base de datos.
		/// </summary>
		/// <remarks>
		/// Devuelve un modelo de validación para establecer si guardó la relación o no.
		/// La moneda debe existir en la tabla Moneda.
		/// </remarks>
		/// <param name="parametroMoneda">Objeto que contiene el número de moneda, identificador y usuario.</param>
		/// <returns>Un objeto <see cref="ModeloValidacion"/> que contiene el estado de la validación.</returns>
		/// <response code="200">Operación exitosa. Retorna un modelo de validación.</response>
		/// <response code="500">Error interno del servidor.</response>
		[HttpPost]
		public async Task<ModeloValidacion> CrearMoneda([FromBody] MonedaSucursalDto parametroMoneda)
		{
			MonedaDto monedaDto = new MonedaDto
			{
				numeroDeMoneda = parametroMoneda.numeroDeMoneda,
				identificador = parametroMoneda.identificador,
				usuario = parametroMoneda.usuario
			};
			ModeloValidacion resultadoModeloValidacion = await _agregarMonedasBW.AgregarMoneda(monedaDto);
			return resultadoModeloValidacion;
		}

		// POST: api/Monedas/AgregarMoneda
		/// <summary>
		/// Inserta una relación moneda-sucursal en la base de datos.
		/// </summary>
		/// <remarks>
		/// Devuelve un modelo de validación para establecer si guardó la relación o no.
		/// La moneda debe existir en la tabla Moneda.
		/// </remarks>
		/// <returns>Un objeto <see cref="ModeloValidacion"/> que contiene el estado de la validación.</returns>
		/// <response code="200">Operación exitosa. Retorna un modelo de validación.</response>
		/// <response code="500">Error interno del servidor.</response>
		[HttpPost("AgregarMoneda")]
		public async Task<ModeloValidacion> AgregarMoneda(MonedaSucursalDto parametroMoneda)
		{
			MonedaDto monedaDto = new MonedaDto
			{
				numeroDeMoneda = parametroMoneda.numeroDeMoneda,
				identificador = parametroMoneda.identificador,
				usuario = parametroMoneda.usuario
			};
			ModeloValidacion resultadoModeloValidacion = await _agregarMonedasBW.AgregarMoneda(monedaDto);
			return resultadoModeloValidacion;
		}

		// POST: api/Monedas/{idMoneda}/estado
		/// <summary>
		/// Cambia el estado (activo/inactivo) de una relación moneda-sucursal.
		/// </summary>
		/// <remarks>
		/// Devuelve un modelo de validación para establecer si cambió el estado correctamente.
		/// </remarks>
		/// <param name="idMoneda">El identificador único de la relación moneda-sucursal.</param>
		/// <param name="cambiarEstadoMonedaDto">Objeto que contiene el nuevo estado y el usuario que realiza el cambio.</param>
		/// <returns>Un objeto <see cref="ModeloValidacion"/> que contiene el estado de la validación.</returns>
		/// <response code="200">Operación exitosa. Retorna un modelo de validación.</response>
		/// <response code="400">Parámetros inválidos.</response>
		/// <response code="500">Error interno del servidor.</response>
		[HttpPost("{idMoneda}/estado")]
		public async Task<ModeloValidacion> CambiarEstado(int idMoneda, [FromBody] CambiarEstadoMonedaDto cambiarEstadoMonedaDto)
		{
			ModeloValidacion resultadoModeloValidacion = await _cambiarEstadoMonedaBW.CambiarEstado(idMoneda, cambiarEstadoMonedaDto);
			return resultadoModeloValidacion;
		}
	}
}

using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Monedas.ObtenerMonedaPorId;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;
using Softlithe.ERP.Abstracciones.DA.Monedas.ObtenerMonedaPorId;

namespace Softlithe.ERP.BW.Monedas.ObtenerMonedaPorId
{
	public class ObtenerMonedaPorIdBW : IObtenerMonedaPorIdBW
	{
		private readonly IObtenerMonedaPorIdDA _obtenerMonedaPorIdDA;
		private readonly IErrorLogger _logger;

		public ObtenerMonedaPorIdBW(IObtenerMonedaPorIdDA obtenerMonedaPorIdDA, IErrorLogger errorLogger)
		{
			_obtenerMonedaPorIdDA = obtenerMonedaPorIdDA;
			_logger = errorLogger;
		}

		public async Task<ModeloValidacionConDatos<MonedaResponseDto?>> ObtenerMonedaPorId(int idMoneda)
		{
			try
			{
				MonedaResponseDto? moneda = await _obtenerMonedaPorIdDA.ObtenerMonedaPorId(idMoneda);

				if (moneda == null)
				{
					return new ModeloValidacionConDatos<MonedaResponseDto?>
					{
						Mensaje = "No se encontró la moneda solicitada.",
						EsCorrecto = false,
						Datos = null
					};
				}

				return new ModeloValidacionConDatos<MonedaResponseDto?>
				{
					Mensaje = "Moneda obtenida correctamente.",
					EsCorrecto = true,
					Datos = moneda
				};
			}
			catch (Exception ex)
			{
				await _logger.RegistrarEventoError(ex);
				return new ModeloValidacionConDatos<MonedaResponseDto?>
				{
					Mensaje = "Ocurrió un error al obtener la moneda.",
					EsCorrecto = false,
					Datos = null
				};
			}
		}
	}
}

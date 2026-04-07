using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerTodasLasEnfermedades;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.ObtenerTodasLasEnfermedades;

namespace Softlithe.ERP.BW.Enfermedades.ObtenerTodasLasEnfermedades
{
	public class ObtenerTodasLasEnfermedadesBW : IObtenerTodasLasEnfermedadesBW
	{
		private readonly IObtenerTodasLasEnfermedadesDA _obtenerTodasLasEnfermedadesDA;
		private readonly IErrorLogger _logger;

		public ObtenerTodasLasEnfermedadesBW(IObtenerTodasLasEnfermedadesDA obtenerTodasLasEnfermedadesDA, IErrorLogger errorLogger)
		{
			_obtenerTodasLasEnfermedadesDA = obtenerTodasLasEnfermedadesDA;
			_logger = errorLogger;
		}

		public async Task<EnfermedadConModeloDeValidacionResponse> ObtenerTodasLasEnfermedades()
		{
			try
			{
				List<EnfermedadResponseDto> enfermedades = await _obtenerTodasLasEnfermedadesDA.ObtenerTodasLasEnfermedades();

				return new EnfermedadConModeloDeValidacionResponse
				{
					datos = enfermedades,
					modeloValidacion = new Abstracciones.Contenedores.ModeloValidacion
					{
						Mensaje = "Enfermedades obtenidas correctamente.",
						EsCorrecto = true
					}
				};
			}
			catch (Exception ex)
			{
				await _logger.RegistrarEventoError(ex);
				return new EnfermedadConModeloDeValidacionResponse
				{
					datos = new List<EnfermedadResponseDto>(),
					modeloValidacion = new Abstracciones.Contenedores.ModeloValidacion
					{
						Mensaje = "Ocurrió un error al obtener las enfermedades.",
						EsCorrecto = false
					}
				};
			}
		}
	}
}

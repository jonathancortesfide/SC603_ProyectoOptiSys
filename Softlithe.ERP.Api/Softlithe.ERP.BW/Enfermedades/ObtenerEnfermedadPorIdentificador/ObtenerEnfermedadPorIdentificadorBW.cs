using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerEnfermedadPorIdentificador;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.ObtenerEnfermedadPorIdentificador;

namespace Softlithe.ERP.BW.Enfermedades.ObtenerEnfermedadPorIdentificador
{
	public class ObtenerEnfermedadPorIdentificadorBW : IObtenerEnfermedadPorIdentificadorBW
	{
		private readonly IObtenerEnfermedadPorIdentificadorDA _obtenerEnfermedadPorIdentificadorDA;
		private readonly IErrorLogger _logger;

		public ObtenerEnfermedadPorIdentificadorBW(IObtenerEnfermedadPorIdentificadorDA obtenerEnfermedadPorIdentificadorDA, IErrorLogger errorLogger)
		{
			_obtenerEnfermedadPorIdentificadorDA = obtenerEnfermedadPorIdentificadorDA;
			_logger = errorLogger;
		}

		public async Task<EnfermedadConModeloDeValidacionResponse> ObtenerEnfermedadPorIdentificador(int identificador)
		{
			try
			{
				List<EnfermedadResponseDto> enfermedades = await _obtenerEnfermedadPorIdentificadorDA.ObtenerEnfermedadPorIdentificador(identificador);

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

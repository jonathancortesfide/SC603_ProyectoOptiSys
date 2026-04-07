using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Monedas.CambiarEstado;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Monedas.CambiarEstado;

namespace Softlithe.ERP.BW.Monedas.CambiarEstado
{
	public class CambiarEstadoMonedaBW : ICambiarEstadoMonedaBW
	{
		private readonly ICambiarEstadoMonedaDA _cambiarEstadoMonedaDA;
		private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
		private readonly IErrorLogger _logger;

		public CambiarEstadoMonedaBW(ICambiarEstadoMonedaDA cambiarEstadoMonedaDA, IAgregarEventoBitacoraBW agregarEventoBitacoraBW, IErrorLogger errorLogger)
		{
			_cambiarEstadoMonedaDA = cambiarEstadoMonedaDA;
			_agregarEventoBitacoraBW = agregarEventoBitacoraBW;
			_logger = errorLogger;
		}

		public async Task<ModeloValidacion> CambiarEstado(int idMoneda, CambiarEstadoMonedaDto cambiarEstadoMonedaDto)
		{
			try
			{
				CambiarEstadoMonedaResponseDto resultadoCambioEstado = await _cambiarEstadoMonedaDA.CambiarEstado(idMoneda, cambiarEstadoMonedaDto);
				int respuestaBitacora = await AgregarEventoBitacoraCorrecto(idMoneda, cambiarEstadoMonedaDto, resultadoCambioEstado);
				return ConstruirRespuestaExitosa(resultadoCambioEstado.RegistrosActualizados, respuestaBitacora);
			}
			catch (Exception ex)
			{
				await _logger.RegistrarEventoError(ex);
				return ConstruirRespuestaExitosa(0, 1);
			}
		}

		private ModeloValidacion ConstruirRespuestaExitosa(int resultadoMonedasActualizadas, int errorBitacora)
		{
			return new ModeloValidacion
			{
				Mensaje = (resultadoMonedasActualizadas == 0 ? MensajeDeMonedaDto.ErrorCambiarEstadoMoneda : MensajeDeMonedaDto.EstadoMonedaCambiadoCorrectamente) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
				EsCorrecto = resultadoMonedasActualizadas > 0
			};
		}

		private async Task<int> AgregarEventoBitacoraCorrecto(int idMoneda, CambiarEstadoMonedaDto cambiarEstadoMonedaDto, CambiarEstadoMonedaResponseDto resultadoCambioEstado)
		{
			return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
			{
				identificador = resultadoCambioEstado.Identificador,
				descripcionDelEvento = resultadoCambioEstado.RegistrosActualizados > 0 ? MensajeDeMonedaDto.EstadoMonedaCambiadoCorrectamente + ". ID Moneda: " + idMoneda + ", Descripción: " + resultadoCambioEstado.Descripcion + ", Activo: " + resultadoCambioEstado.Activo : MensajeDeMonedaDto.ErrorCambiarEstadoMoneda + ". ID Moneda: " + idMoneda,
				fechaDeRegistro = DateTime.Now,
				nombreDelMetodo = nameof(CambiarEstado),
				tabla = "MonedaSucursal",
				idBitacora = Guid.NewGuid(),
				usuario = cambiarEstadoMonedaDto.usuario
			});
		}
	}
}

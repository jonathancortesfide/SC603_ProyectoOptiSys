using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Monedas.AgregarMoneda;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Monedas.AgregarMoneda;

namespace Softlithe.ERP.BW.Monedas.AgregarMoneda
{
	public class AgregarMonedasBW : IAgregarMonedasBW
	{
		private readonly IAgregarMonedasDA _agregarMonedasDA;
		private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
		private readonly IErrorLogger _logger;

		public AgregarMonedasBW(IAgregarMonedasDA agregarMonedasDA, IAgregarEventoBitacoraBW agregarEventoBitacoraBW, IErrorLogger errorLogger)
		{
			_agregarMonedasDA = agregarMonedasDA;
			_agregarEventoBitacoraBW = agregarEventoBitacoraBW;
			_logger = errorLogger;
		}

		public async Task<ModeloValidacion> AgregarMoneda(MonedaDto monedaDto)
		{
			try
			{
				AgregarMonedaResponseDto resultadoAgregarMoneda = await _agregarMonedasDA.AgregarMoneda(monedaDto);
				int respuestaBitacora = await AgregarEventoBitacoraCorrecto(monedaDto, resultadoAgregarMoneda);
				return ConstruirRespuestaExitosa(resultadoAgregarMoneda.RegistrosActualizados, respuestaBitacora);
			}
			catch (Exception ex)
			{
				await _logger.RegistrarEventoError(ex);
				return ConstruirRespuestaExitosa(0, 1);
			}
		}

		private ModeloValidacion ConstruirRespuestaExitosa(int resultadoMonedasIncluidas, int errorBitacora)
		{
			return new ModeloValidacion
			{
				Mensaje = (resultadoMonedasIncluidas > 0 ? MensajeDeMonedaDto.MonedaAgregadaCorrectamente : MensajeDeMonedaDto.MonedaNoGuardar) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
				EsCorrecto = resultadoMonedasIncluidas > 0
			};
		}

		private async Task<int> AgregarEventoBitacoraCorrecto(MonedaDto monedaDto, AgregarMonedaResponseDto resultadoAgregarMoneda)
		{
			return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
			{
				identificador = resultadoAgregarMoneda.Identificador,
				descripcionDelEvento = resultadoAgregarMoneda.RegistrosActualizados > 0 ? MensajeDeMonedaDto.MonedaAgregadaCorrectamente + ". Descripción Moneda: " + resultadoAgregarMoneda.Descripcion : MensajeDeMonedaDto.MonedaNoGuardar + ". Descripción Moneda: " + resultadoAgregarMoneda.Descripcion,
				fechaDeRegistro = DateTime.Now,
				nombreDelMetodo = nameof(AgregarMoneda),
				tabla = "Moneda",
				idBitacora = Guid.NewGuid(),
				usuario = monedaDto.usuario
			});
		}
	}
}

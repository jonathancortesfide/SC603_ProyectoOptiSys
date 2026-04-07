using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Monedas.ModificarMoneda;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Monedas.ModificarMoneda;

namespace Softlithe.ERP.BW.Monedas.ModificarMoneda
{
	public class ModificarMonedasBW : IModificarMonedasBW
	{
		private readonly IModificarMonedasDA _modificarMonedasDA;
		private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
		private readonly IErrorLogger _logger;

		public ModificarMonedasBW(IModificarMonedasDA modificarMonedasDA, IAgregarEventoBitacoraBW agregarEventoBitacoraBW, IErrorLogger errorLogger)
		{
			_modificarMonedasDA = modificarMonedasDA;
			_agregarEventoBitacoraBW = agregarEventoBitacoraBW;
			_logger = errorLogger;
		}

		public async Task<ModeloValidacion> ModificarMoneda(MonedaDto monedaDto)
		{
			try
			{
				int resultadoMonedasIncluidas = await _modificarMonedasDA.ModificarMoneda(monedaDto);
				int respuestaBitacora = await AgregarEventoBitacoraCorrecto(monedaDto, resultadoMonedasIncluidas);
				return ConstruirRespuestaExitosa(resultadoMonedasIncluidas, respuestaBitacora);
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
				Mensaje = (resultadoMonedasIncluidas == 0 ? MensajeDeMonedaDto.MonedaNoGuardar : MensajeDeMonedaDto.MonedaModificadaCorrectamente) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
				EsCorrecto = resultadoMonedasIncluidas > 0
			};
		}

		private async Task<int> AgregarEventoBitacoraCorrecto(MonedaDto monedaDto, int resultadoMonedasIncluidas)
		{
			return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
			{
				descripcionDelEvento = resultadoMonedasIncluidas > 0 ? MensajeDeMonedaDto.MonedaModificadaCorrectamente + ". Descripción Moneda: " + monedaDto.descripcion : MensajeDeMonedaDto.MonedaNoGuardar + ". Descripción Moneda: " + monedaDto.descripcion,
				fechaDeRegistro = DateTime.Now,
				nombreDelMetodo = nameof(ModificarMoneda),
				tabla = "Moneda",
				idBitacora = Guid.NewGuid(),
				identificador = monedaDto.identificador,
				usuario = monedaDto.usuario
			});
		}
	}
}

using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Monedas.BorrarMoneda;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Monedas.BorrarMoneda;

namespace Softlithe.ERP.BW.Monedas.BorrarMoneda
{
	public class BorrarMonedasBW : IBorrarMonedasBW
	{
		private readonly IBorrarMonedasDA _borrarMonedasDA;
		private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
		private readonly IErrorLogger _logger;

		public BorrarMonedasBW(IBorrarMonedasDA borrarMonedasDA, IAgregarEventoBitacoraBW agregarEventoBitacoraBW, IErrorLogger errorLogger)
		{
			_borrarMonedasDA = borrarMonedasDA;
			_agregarEventoBitacoraBW = agregarEventoBitacoraBW;
			_logger = errorLogger;
		}

		public async Task<ModeloValidacion> BorrarMoneda(MonedaDto monedaDto)
		{
			try
			{
				// Validar que no sea la moneda nacional (numeroDeMoneda = 1)
				if (monedaDto.numeroDeMoneda == 1)
				{
					return ConstruirRespuestaError(MensajeDeMonedaDto.MonedaNacionalNoSeDebeEliminar);
				}

				int resultadoMonedasIncluidas = await _borrarMonedasDA.BorrarMoneda(monedaDto);

				if (resultadoMonedasIncluidas == -1) // Código especial para referencias
				{
					return ConstruirRespuestaError(MensajeDeMonedaDto.MonedaTieneReferenciasEnOtrasTablas);
				}

				int respuestaBitacora = await AgregarEventoBitacoraCorrecto(monedaDto, resultadoMonedasIncluidas);
				return ConstruirRespuestaExitosa(resultadoMonedasIncluidas, respuestaBitacora);
			}
			catch (Exception ex)
			{
				await _logger.RegistrarEventoError(ex);
				return ConstruirRespuestaError(MensajeDeMonedaDto.MonedaTieneReferenciasEnOtrasTablas);
			}
		}

		private ModeloValidacion ConstruirRespuestaExitosa(int resultadoMonedasIncluidas, int errorBitacora)
		{
			return new ModeloValidacion
			{
				Mensaje = (resultadoMonedasIncluidas == 0 ? MensajeDeMonedaDto.MonedaNoGuardar : MensajeDeMonedaDto.MonedaEliminadaCorrectamente) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
				EsCorrecto = resultadoMonedasIncluidas > 0
			};
		}

		private ModeloValidacion ConstruirRespuestaError(string mensaje)
		{
			return new ModeloValidacion
			{
				Mensaje = mensaje,
				EsCorrecto = false
			};
		}

		private async Task<int> AgregarEventoBitacoraCorrecto(MonedaDto monedaDto, int resultadoMonedasIncluidas)
		{
			return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
			{
				descripcionDelEvento = resultadoMonedasIncluidas > 0 ? MensajeDeMonedaDto.MonedaEliminadaCorrectamente + ". Descripción Moneda: " + monedaDto.descripcion : MensajeDeMonedaDto.MonedaNoGuardar + ". Descripción Moneda: " + monedaDto.descripcion,
				fechaDeRegistro = DateTime.Now,
				nombreDelMetodo = nameof(BorrarMoneda),
				tabla = "Moneda",
				idBitacora = Guid.NewGuid(),
				identificador = monedaDto.identificador,
				usuario = monedaDto.usuario
			});
		}
	}
}

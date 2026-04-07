using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.CambiarEstado;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.CambiarEstado;

namespace Softlithe.ERP.BW.Enfermedades.CambiarEstado
{
	public class CambiarEstadoEnfermedadBW : ICambiarEstadoEnfermedadBW
	{
		private readonly ICambiarEstadoEnfermedadDA _cambiarEstadoEnfermedadDA;
		private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
		private readonly IErrorLogger _logger;

		public CambiarEstadoEnfermedadBW(ICambiarEstadoEnfermedadDA cambiarEstadoEnfermedadDA, IAgregarEventoBitacoraBW agregarEventoBitacoraBW, IErrorLogger errorLogger)
		{
			_cambiarEstadoEnfermedadDA = cambiarEstadoEnfermedadDA;
			_agregarEventoBitacoraBW = agregarEventoBitacoraBW;
			_logger = errorLogger;
		}

		public async Task<ModeloValidacion> CambiarEstado(int numeroEnfermedad, CambiarEstadoEnfermedadDto cambiarEstadoEnfermedadDto)
		{
			try
			{
				CambiarEstadoEnfermedadResponseDto resultadoCambioEstado = await _cambiarEstadoEnfermedadDA.CambiarEstado(numeroEnfermedad, cambiarEstadoEnfermedadDto);
				int respuestaBitacora = await AgregarEventoBitacoraCorrecto(numeroEnfermedad, cambiarEstadoEnfermedadDto, resultadoCambioEstado);
				return ConstruirRespuestaExitosa(resultadoCambioEstado.RegistrosActualizados, respuestaBitacora);
			}
			catch (Exception ex)
			{
				await _logger.RegistrarEventoError(ex);
				return ConstruirRespuestaExitosa(0, 1);
			}
		}

		private ModeloValidacion ConstruirRespuestaExitosa(int resultadoEnfermedadActualizada, int errorBitacora)
		{
			return new ModeloValidacion
			{
				Mensaje = (resultadoEnfermedadActualizada == 0 ? MensajeDeEnfermedadDto.ErrorCambiarEstadoEnfermedad : MensajeDeEnfermedadDto.EstadoEnfermedadCambiadoCorrectamente) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
				EsCorrecto = resultadoEnfermedadActualizada > 0
			};
		}

		private async Task<int> AgregarEventoBitacoraCorrecto(int numeroEnfermedad, CambiarEstadoEnfermedadDto cambiarEstadoEnfermedadDto, CambiarEstadoEnfermedadResponseDto resultadoCambioEstado)
		{
			return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
			{
				identificador = resultadoCambioEstado.Identificador,
				descripcionDelEvento = resultadoCambioEstado.RegistrosActualizados > 0 ? MensajeDeEnfermedadDto.EstadoEnfermedadCambiadoCorrectamente + ". No. Enfermedad: " + numeroEnfermedad + ", Descripción: " + resultadoCambioEstado.Descripcion + ", Activo: " + resultadoCambioEstado.Activo : MensajeDeEnfermedadDto.ErrorCambiarEstadoEnfermedad + ". No. Enfermedad: " + numeroEnfermedad,
				fechaDeRegistro = DateTime.Now,
				nombreDelMetodo = nameof(CambiarEstado),
				tabla = "Enfermedad",
				idBitacora = Guid.NewGuid(),
				usuario = cambiarEstadoEnfermedadDto.usuario
			});
		}
	}
}

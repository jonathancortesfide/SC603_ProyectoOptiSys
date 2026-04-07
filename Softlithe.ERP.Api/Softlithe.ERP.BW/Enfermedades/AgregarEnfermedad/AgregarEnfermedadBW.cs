using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.AgregarEnfermedad;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.AgregarEnfermedad;

namespace Softlithe.ERP.BW.Enfermedades.AgregarEnfermedad
{
	public class AgregarEnfermedadBW : IAgregarEnfermedadBW
	{
		private readonly IAgregarEnfermedadDA _agregarEnfermedadDA;
		private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
		private readonly IErrorLogger _logger;

		public AgregarEnfermedadBW(IAgregarEnfermedadDA agregarEnfermedadDA, IAgregarEventoBitacoraBW agregarEventoBitacoraBW, IErrorLogger errorLogger)
		{
			_agregarEnfermedadDA = agregarEnfermedadDA;
			_agregarEventoBitacoraBW = agregarEventoBitacoraBW;
			_logger = errorLogger;
		}

		public async Task<ModeloValidacion> AgregarEnfermedad(EnfermedadDto enfermedadDto)
		{
			try
			{
				AgregarEnfermedadResponseDto resultadoAgregarEnfermedad = await _agregarEnfermedadDA.AgregarEnfermedad(enfermedadDto);
				int respuestaBitacora = await AgregarEventoBitacoraCorrecto(enfermedadDto, resultadoAgregarEnfermedad);
				return ConstruirRespuestaExitosa(resultadoAgregarEnfermedad.RegistrosActualizados, respuestaBitacora);
			}
			catch (Exception ex)
			{
				await _logger.RegistrarEventoError(ex);
				return ConstruirRespuestaExitosa(0, 1);
			}
		}

		private ModeloValidacion ConstruirRespuestaExitosa(int resultadoEnfermedad, int errorBitacora)
		{
			return new ModeloValidacion
			{
				Mensaje = (resultadoEnfermedad == 0 ? MensajeDeEnfermedadDto.ErrorAgregarEnfermedad : MensajeDeEnfermedadDto.EnfermedadAgregadaCorrectamente) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
				EsCorrecto = resultadoEnfermedad > 0
			};
		}

		private async Task<int> AgregarEventoBitacoraCorrecto(EnfermedadDto enfermedadDto, AgregarEnfermedadResponseDto resultadoAgregarEnfermedad)
		{
			return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
			{
				identificador = resultadoAgregarEnfermedad.Identificador,
				descripcionDelEvento = resultadoAgregarEnfermedad.RegistrosActualizados > 0 ? MensajeDeEnfermedadDto.EnfermedadAgregadaCorrectamente + ". Descripción: " + resultadoAgregarEnfermedad.Descripcion : MensajeDeEnfermedadDto.ErrorAgregarEnfermedad + ". ID Enfermedad Catálogo: " + enfermedadDto.idEnfermedad,
				fechaDeRegistro = DateTime.Now,
				nombreDelMetodo = nameof(AgregarEnfermedad),
				tabla = "Enfermedad",
				idBitacora = Guid.NewGuid(),
				usuario = enfermedadDto.usuario
			});
		}
	}
}

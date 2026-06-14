using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.AgregarEnfermedadConCatalogo;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.AgregarEnfermedadConCatalogo;

namespace Softlithe.ERP.BW.Enfermedades.AgregarEnfermedadConCatalogo
{
    public class AgregarEnfermedadConCatalogoBW : IAgregarEnfermedadConCatalogoBW
    {
        private readonly IAgregarEnfermedadConCatalogoDA _agregarEnfermedadConCatalogoDA;
        private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
        private readonly IErrorLogger _logger;

        public AgregarEnfermedadConCatalogoBW(IAgregarEnfermedadConCatalogoDA agregarEnfermedadConCatalogoDA, IAgregarEventoBitacoraBW agregarEventoBitacoraBW, IErrorLogger errorLogger)
        {
            _agregarEnfermedadConCatalogoDA = agregarEnfermedadConCatalogoDA;
            _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
            _logger = errorLogger;
        }

        public async Task<ModeloValidacion> AgregarEnfermedadConCatalogo(AgregarEnfermedadConCatalogoDto enfermedadDto)
        {
            try
            {
                AgregarEnfermedadConCatalogoResponseDto resultadoAgregarEnfermedad = await _agregarEnfermedadConCatalogoDA.AgregarEnfermedadConCatalogo(enfermedadDto);
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
                Mensaje = (resultadoEnfermedad == 0 ? MensajeDeEnfermedadDto.ErrorAgregarEnfermedadConCatalogo : MensajeDeEnfermedadDto.EnfermedadConCatalogoAgregadaCorrectamente) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
                EsCorrecto = resultadoEnfermedad > 0
            };
        }

        private async Task<int> AgregarEventoBitacoraCorrecto(AgregarEnfermedadConCatalogoDto enfermedadDto, AgregarEnfermedadConCatalogoResponseDto resultadoAgregarEnfermedad)
        {
            return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
            {
                identificador = resultadoAgregarEnfermedad.Identificador,
                descripcionDelEvento = resultadoAgregarEnfermedad.RegistrosActualizados > 0 ? MensajeDeEnfermedadDto.EnfermedadConCatalogoAgregadaCorrectamente + ". Descripción: " + resultadoAgregarEnfermedad.Descripcion : MensajeDeEnfermedadDto.ErrorAgregarEnfermedadConCatalogo + ". Descripción: " + enfermedadDto.descripcion,
                fechaDeRegistro = DateTime.Now,
                nombreDelMetodo = nameof(AgregarEnfermedadConCatalogo),
                tabla = "Enfermedad",
                idBitacora = Guid.NewGuid(),
                usuario = enfermedadDto.usuario
            });
        }
    }
}

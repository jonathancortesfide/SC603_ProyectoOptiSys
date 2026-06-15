using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.AgregarEnfermedadCatalogo;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.AgregarEnfermedadCatalogo;

namespace Softlithe.ERP.BW.Enfermedades.AgregarEnfermedadCatalogo
{
    public class AgregarEnfermedadCatalogoBW : IAgregarEnfermedadCatalogoBW
    {
        private readonly IAgregarEnfermedadCatalogoDA _agregarEnfermedadCatalogoDA;
        private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
        private readonly IErrorLogger _logger;

        public AgregarEnfermedadCatalogoBW(IAgregarEnfermedadCatalogoDA agregarEnfermedadCatalogoDA, IAgregarEventoBitacoraBW agregarEventoBitacoraBW, IErrorLogger errorLogger)
        {
            _agregarEnfermedadCatalogoDA = agregarEnfermedadCatalogoDA;
            _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
            _logger = errorLogger;
        }

        public async Task<ModeloValidacion> AgregarEnfermedadCatalogo(AgregarEnfermedadCatalogoDto enfermedadCatalogoDto)
        {
            try
            {
                AgregarEnfermedadCatalogoResponseDto resultadoAgregarEnfermedad = await _agregarEnfermedadCatalogoDA.AgregarEnfermedadCatalogo(enfermedadCatalogoDto);
                int respuestaBitacora = await AgregarEventoBitacoraCorrecto(enfermedadCatalogoDto, resultadoAgregarEnfermedad);
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
                Mensaje = (resultadoEnfermedad == 0 ? MensajeDeEnfermedadDto.ErrorAgregarEnfermedadCatalogo : MensajeDeEnfermedadDto.EnfermedadCatalogoAgregadaCorrectamente) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
                EsCorrecto = resultadoEnfermedad > 0
            };
        }

        private async Task<int> AgregarEventoBitacoraCorrecto(AgregarEnfermedadCatalogoDto enfermedadCatalogoDto, AgregarEnfermedadCatalogoResponseDto resultadoAgregarEnfermedad)
        {
            return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
            {
                identificador = 0,
                descripcionDelEvento = resultadoAgregarEnfermedad.RegistrosActualizados > 0 ? MensajeDeEnfermedadDto.EnfermedadCatalogoAgregadaCorrectamente + ". Descripción: " + resultadoAgregarEnfermedad.Descripcion : MensajeDeEnfermedadDto.ErrorAgregarEnfermedadCatalogo + ". Descripción: " + enfermedadCatalogoDto.descripcion,
                fechaDeRegistro = DateTime.Now,
                nombreDelMetodo = nameof(AgregarEnfermedadCatalogo),
                tabla = "EnfermedadCatalogo",
                idBitacora = Guid.NewGuid(),
                usuario = enfermedadCatalogoDto.usuario
            });
        }
    }
}

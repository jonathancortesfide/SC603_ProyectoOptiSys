using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.Marcas;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Marcas;

namespace Softlithe.ERP.BW.Marcas
{
    public class ModificarEstadoMarcaBW : Abstracciones.BW.Marcas.IModificarEstadoMarcaBW
    {
        private readonly IModificarEstadoMarcaDA _InactivarMarcaDA;
        private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
        private readonly IErrorLogger _logger;
        public ModificarEstadoMarcaBW(IModificarEstadoMarcaDA InactivarMarcaDA, IAgregarEventoBitacoraBW agregarEventoBitacoraBW, IErrorLogger errorLogger)
        {
            _InactivarMarcaDA = InactivarMarcaDA;
            _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
            _logger = errorLogger;
        }
        public async Task<ModeloValidacion> ModificaEstadoMarca(MarcaInActivaDto elMarca)
        {
            RespuestaCambiarEstadoMarcaDA resultadoNo_marcaIncluida = new RespuestaCambiarEstadoMarcaDA() { ResultadoRegistro = 0 };
            try
            {
                resultadoNo_marcaIncluida = await _InactivarMarcaDA.ModificaEstadoMarca(elMarca);
                int respuestaBitacora = await AgregarEventoBitacoraCorrecto(resultadoNo_marcaIncluida, elMarca.Usuario);
                return ConstruirRespuestaExitosa(resultadoNo_marcaIncluida, respuestaBitacora);

            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaExitosa(resultadoNo_marcaIncluida, 1);
            }
        }
        private ModeloValidacion ConstruirRespuestaExitosa(RespuestaCambiarEstadoMarcaDA respuestaCambiarEstadoMarcaDA, int errorBitacora)
        {
            return new ModeloValidacion
            {
                Mensaje = (respuestaCambiarEstadoMarcaDA.ResultadoRegistro == 0 ? MensajeDeMarcaDto.MarcaNoGuadar : string.Format(MensajeDeMarcaDto.MarcaModificaEstadoCorrectamente, respuestaCambiarEstadoMarcaDA.ModeloMarca.Descripcion, respuestaCambiarEstadoMarcaDA.ModeloMarca.EsActivo ? "Activo" : "Inactivo")) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
                EsCorrecto = respuestaCambiarEstadoMarcaDA.ResultadoRegistro > 0
            };
        }
        private async Task<int> AgregarEventoBitacoraCorrecto(RespuestaCambiarEstadoMarcaDA marcaIncluida, string usuarioRegistro)
        {
            return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
            {
                descripcionDelEvento = marcaIncluida.ResultadoRegistro > 0 ? string.Format(MensajeDeMarcaDto.MarcaModificaEstadoCorrectamente, marcaIncluida.ModeloMarca.Descripcion, marcaIncluida.ModeloMarca.EsActivo? "Activo" : "Inactivo")  : string.Format(MensajeDeMarcaDto.MarcaNoGuadar, marcaIncluida.ModeloMarca.Descripcion),
                fechaDeRegistro = DateTime.Now,
                nombreDelMetodo = nameof(ModificaEstadoMarca),
                tabla = "Marca",
                idBitacora = Guid.NewGuid(),
                identificador = marcaIncluida.ModeloMarca.Identificador,
                usuario = usuarioRegistro
            });
        }
    }
}

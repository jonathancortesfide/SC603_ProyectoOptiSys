using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Marcas;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.Marcas;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Marcas;

namespace Softlithe.ERP.BW.Marcas
{
    public class AgregarMarcaBW : IAgregarMarcaBW
    {
        private readonly IAgregarMarcaDA _agregarMarcaDA;
        private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
        private readonly IErrorLogger _logger;
        public AgregarMarcaBW(IAgregarMarcaDA agregarMarcaDA, IAgregarEventoBitacoraBW agregarEventoBitacoraBW, IErrorLogger errorLogger)
        {
            _agregarMarcaDA = agregarMarcaDA;
            _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
            _logger = errorLogger;
        }
        public async Task<ModeloValidacion> AgregarMarca(MarcaDto marcaDto)
        {
            try
            {
                int resultadoNo_marcaIncluida = await _agregarMarcaDA.AgregarMarca(marcaDto);
                int respuestaBitacora = await AgregarEventoBitacoraCorrecto(marcaDto, resultadoNo_marcaIncluida);
                return ConstruirRespuestaExitosa(resultadoNo_marcaIncluida, respuestaBitacora);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaExitosa(0, 1);
            }
        }
        private ModeloValidacion ConstruirRespuestaExitosa(int no_marcaIncluida, int errorBitacora)
        {
            return new ModeloValidacion
            {
                Mensaje = (no_marcaIncluida > 0 ? MensajeDeMarcaDto.MarcaAgregadaCorrectamente : MensajeDeMarcaDto.MarcaNoGuadar) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
                EsCorrecto = no_marcaIncluida > 0
            };
        }
        private async Task<int> AgregarEventoBitacoraCorrecto(MarcaDto marcaDto, int no_marcaIncluida)
        {
            return  await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
            {
                descripcionDelEvento = no_marcaIncluida > 0 ? MensajeDeMarcaDto.MarcaAgregadaCorrectamente + ". Descripción Marca: " + marcaDto.Descripcion : MensajeDeMarcaDto.MarcaNoGuadar + ". Descripción Marca: "+ marcaDto.Descripcion,
                fechaDeRegistro = DateTime.Now,
                nombreDelMetodo = nameof(AgregarMarca),
                tabla = "Marca",
                idBitacora = Guid.NewGuid(),
                identificador = marcaDto.Identificador,
                usuario = marcaDto.Usuario
            });
        }
    }
}
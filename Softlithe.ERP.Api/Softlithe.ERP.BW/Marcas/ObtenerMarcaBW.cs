using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Marcas;
using Softlithe.ERP.Abstracciones.Contenedores.Marcas;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Marcas;

namespace Softlithe.ERP.BW.Marcas
{
    public class ObtenerMarcaBW : IObtenerMarcaBW
    {
        private readonly IObtenerMarcaDA _obtenerMarcaDA;
        private readonly IErrorLogger _logger;
        public ObtenerMarcaBW(IObtenerMarcaDA obtenerMarcaAD, IErrorLogger errorLogger)
        {
            _obtenerMarcaDA = obtenerMarcaAD;
            _logger = errorLogger;
        }

        public async Task<MarcaConModeloDeValidacion> ObtenerMarcas(ParametroConsultaMarca parametroConsultaMarca)
        {
            try
            {
                List<MarcaDto> laListaDeMarcas = await _obtenerMarcaDA.ObtenerMarcas(parametroConsultaMarca.Descripcion, parametroConsultaMarca.NoEmpresa);
                return ConstruirRespuestaExitosa(laListaDeMarcas);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaExitosa(null);
            }
        }
        private MarcaConModeloDeValidacion ConstruirRespuestaExitosa(List<MarcaDto>? laListaDeMarca)
        {
            return new MarcaConModeloDeValidacion
            {
                LaListaDeMarcas = laListaDeMarca ?? new List<MarcaDto>(),
                Mensaje = laListaDeMarca == null ? MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema : MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = laListaDeMarca != null,
            };
        }
    }
}

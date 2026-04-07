using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.Contenedores.ListaPrecio;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.ListaPrecio;
using Softlithe.ERP.Abstracciones.DA.ListaPrecio.ObetenerListaPrecioPorID;


namespace Softlithe.ERP.BW.ListaPrecio.ObetenerListaPrecioPorID
{
    public class ObetenerListaPrecioPorIDBW : IObtenerListaPrecioPorIdBW
    {
        private readonly IObtenerListaPrecioPorIdAD _obtenerListaPrecioPorIdAD;
        private readonly IErrorLogger _logger;

        public ObetenerListaPrecioPorIDBW(IObtenerListaPrecioPorIdAD obtenerListaPrecioPorIdAD, IErrorLogger errorLogger)
        {
            _obtenerListaPrecioPorIdAD = obtenerListaPrecioPorIdAD;
            _logger = errorLogger;
        }

        public async Task<ListaPrecioConModeloDeValidacion> Obtener(int id_moneda)
        {
            try
            {
                List<ListaPrecioDto> listaPrecioDtos = await _obtenerListaPrecioPorIdAD.Obtener(id_moneda);
                return ConstruirRespuestaExitosa(listaPrecioDtos);
            }
            catch (Exception ex)
            {
                return ConstruirRespuestaExitosa(null);
            }
        }

        private ListaPrecioConModeloDeValidacion ConstruirRespuestaExitosa(List<ListaPrecioDto>? laListaPrecio)
        {
            return new ListaPrecioConModeloDeValidacion
            {
                LaListaDePrecios = laListaPrecio ?? new List<ListaPrecioDto>(),
                Mensaje = laListaPrecio == null ? MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema : MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = laListaPrecio != null,
            };
        }
    }
}

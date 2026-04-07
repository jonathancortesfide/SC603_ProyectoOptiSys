using Softlithe.ERP.Abstracciones.BW.TipoLente.ObtenerTipoLentePorId;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores.TipoLente;
using Softlithe.ERP.Abstracciones.DA.TipoLente.ObtenerTipoLentePorId;
using Softlithe.ERP.DA.TipoLente.ObtenerTipoLentePorId;


namespace Softlithe.ERP.BW.TipoLente.ObtenerTipoLentePorId
{
    public class ObtenerTipoLentesPorIdBW : IObtenerTipoLentesPorIdBW
    {
            private readonly IObtenerTipoLentesPorIdAD _obtenerTipoLentePorIdAD;
    
            public ObtenerTipoLentesPorIdBW(IObtenerTipoLentesPorIdAD obtenerTipoLentePorIdAD)
            {
                _obtenerTipoLentePorIdAD = obtenerTipoLentePorIdAD;
            }
    
            public async Task<List<TipoLenteDto>> Obtener(int idTipoLente)
            {
                try
                {
                List<TipoLenteDto> tipoLenteDtos = await _obtenerTipoLentePorIdAD.Obtener(idTipoLente);
                return ConstruirRespuestaExitosa(tipoLenteDtos).TipoDeLente;
            }
            catch (Exception ex)
                {
                return ConstruirRespuestaExitosa(null).TipoDeLente;
                }
            }

        private TipoLenteConModeloDeValidacion ConstruirRespuestaExitosa(List<TipoLenteDto>? tipoLente)
        {
            return new TipoLenteConModeloDeValidacion
            {
                TipoDeLente = tipoLente ?? new List<TipoLenteDto>(),
                Mensaje = tipoLente == null ? MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema : MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = tipoLente != null,
            };
        }
    }
}

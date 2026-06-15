using Softlithe.ERP.Abstracciones.BW.TipoLente.ObtenerTipoLentePorId;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores.TipoLente;
using Softlithe.ERP.Abstracciones.DA.TipoLente.ObtenerTipoLentePorId;
using Softlithe.ERP.DA.TipoLente.ObtenerTipoLentePorId;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Softlithe.ERP.BW.TipoLente.ObtenerTipoLentePorId
{
    public class ObtenerTipoLentesPorIdBW : IObtenerTipoLentesPorIdBW
    {
        private readonly IObtenerTipoLentesPorIdAD _obtenerTipoLentePorIdAD;

        public ObtenerTipoLentesPorIdBW(IObtenerTipoLentesPorIdAD obtenerTipoLentePorIdAD)
        {
            _obtenerTipoLentePorIdAD = obtenerTipoLentePorIdAD;
        }

        public async Task<List<TipoLenteDto>> Obtener(string descripcion, int identificador)
        {
            try
            {
                List<TipoLenteDto> tipoLenteDtos = await _obtenerTipoLentePorIdAD.Obtener(descripcion, identificador);
                return tipoLenteDtos;
            }
            catch (Exception ex)
            {
                return new List<TipoLenteDto>();
            }
        }
    }
}

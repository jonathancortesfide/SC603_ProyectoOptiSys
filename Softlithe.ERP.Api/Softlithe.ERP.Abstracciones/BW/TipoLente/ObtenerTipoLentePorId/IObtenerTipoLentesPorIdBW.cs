using Softlithe.ERP.Abstracciones.Contenedores.TipoLente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.TipoLente.ObtenerTipoLentePorId
{
    public interface IObtenerTipoLentesPorIdBW
    {
        Task<List<TipoLenteDto>> Obtener(int id_tipo_lente);
    }
}

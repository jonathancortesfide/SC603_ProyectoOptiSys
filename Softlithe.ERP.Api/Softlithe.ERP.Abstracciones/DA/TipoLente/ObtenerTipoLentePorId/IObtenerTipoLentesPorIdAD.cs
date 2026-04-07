using Softlithe.ERP.Abstracciones.Contenedores.TipoLente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.TipoLente.ObtenerTipoLentePorId
{
    public interface IObtenerTipoLentesPorIdAD
    {
        Task<List<TipoLenteDto>> Obtener(int id_tipo_lente);
    }
}

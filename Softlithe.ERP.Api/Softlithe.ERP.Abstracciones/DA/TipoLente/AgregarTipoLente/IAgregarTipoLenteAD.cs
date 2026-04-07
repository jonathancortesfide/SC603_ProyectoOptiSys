using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.TipoLente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.TipoLente.AgregarTipoLente
{
    public interface IAgregarTipoLenteAD
    {
        Task<int> Agregar(TipoLenteDto tipoLenteDto);
    }
}

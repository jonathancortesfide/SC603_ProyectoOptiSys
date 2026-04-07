using Softlithe.ERP.Abstracciones.Contenedores.TipoLente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.TipoLente.ModificarTipoLente
{
    public interface IModificarTipoLenteAD
    {
        Task<int> ModificarTipoLente(TipoLenteDto elTipoLente); 
    }
}

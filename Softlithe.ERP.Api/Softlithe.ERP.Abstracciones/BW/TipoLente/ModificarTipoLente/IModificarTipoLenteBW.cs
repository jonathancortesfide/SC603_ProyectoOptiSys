using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.TipoLente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.TipoLente.ModificarTipoLente
{
    public interface IModificarTipoLenteBW
    {
        Task<ModeloValidacion> ModificarTipoLente(TipoLenteDto elTipoLente);
    }
}

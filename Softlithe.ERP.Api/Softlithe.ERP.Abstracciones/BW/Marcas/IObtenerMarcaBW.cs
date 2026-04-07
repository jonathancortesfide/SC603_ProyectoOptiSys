using Softlithe.ERP.Abstracciones.Contenedores.Marcas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Marcas
{
    public interface IObtenerMarcaBW
    {
        Task<MarcaConModeloDeValidacion> ObtenerMarcas(ParametroConsultaMarca parametroConsultaMarca);
    }
}

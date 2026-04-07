using Softlithe.ERP.Abstracciones.Contenedores.Marcas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.Marcas
{
    public interface IObtenerMarcaDA
    {
        Task<List<MarcaDto>> ObtenerMarcas(string descripcion, int identificador);
    }
}

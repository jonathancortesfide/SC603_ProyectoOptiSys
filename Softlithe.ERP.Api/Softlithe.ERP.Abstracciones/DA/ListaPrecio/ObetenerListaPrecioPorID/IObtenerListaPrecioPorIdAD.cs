using Softlithe.ERP.Abstracciones.Contenedores.ListaPrecio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.ListaPrecio.ObetenerListaPrecioPorID
{
    public interface IObtenerListaPrecioPorIdAD
    {
        Task<List<ListaPrecioDto>> Obtener(int id_moneda);
    }
}

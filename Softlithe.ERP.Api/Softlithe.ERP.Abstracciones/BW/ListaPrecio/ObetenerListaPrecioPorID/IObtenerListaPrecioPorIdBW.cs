using Softlithe.ERP.Abstracciones.Contenedores.ListaPrecio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.ListaPrecio
{
    public interface IObtenerListaPrecioPorIdBW
    {
        Task<ListaPrecioConModeloDeValidacion> Obtener(int id_moneda);
    }
}

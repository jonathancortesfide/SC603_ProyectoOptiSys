using Softlithe.ERP.Abstracciones.Contenedores.ListaPrecio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.ListaPrecio.ObetenerListaPrecioPorID
{
    public interface IObtenerListaPrecioPorIdBW
    {
        Task<ListaPrecioConModeloDeValidacion> Obtener(string descripcion, int identificador);
    }
}
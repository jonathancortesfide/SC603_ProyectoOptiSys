using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.ListaPrecio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.ListaPrecio.AgregarListaPrecio
{
    public interface IAgregarListaPrecioBW
    {
        Task<ModeloValidacion> Agregar(ListaPrecioDto listaPrecioDto);
    }
}

using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.ListaPrecio;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.ListaPrecio.AgregarListaPrecio
{
    public interface IAgregarListaPrecioAD
    {
        Task<int> Agregar(ListaPrecioDto listaPrecioDto);

    }
}

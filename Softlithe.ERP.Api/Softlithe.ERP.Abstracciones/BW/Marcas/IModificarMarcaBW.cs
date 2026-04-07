using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Marcas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Marcas
{
    public interface IModificarMarcaBW
    {
        Task<ModeloValidacion> ModificarMarca(MarcaDto marcaDto);
    }
}

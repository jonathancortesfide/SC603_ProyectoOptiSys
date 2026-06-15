using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.EmpresaConfiguracion
{
    public class ActividadEcoEmpresaConModeloDeValidacion : ModeloValidacion
    {
        public List<ActividadEconomicaEmpresaDto> ListaActividadesEconomicas { get; set; } = new List<ActividadEconomicaEmpresaDto>();
    }
}

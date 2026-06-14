using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.EmpresaConfiguracion
{
    public class ActividadEconomicaEmpresaDto
    {
        public string CodigoActividad { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public bool Activo { get; set; }
        public bool ValorPorDefecto { get; set; }
    }
}

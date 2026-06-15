using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.Examenes
{
    public class ExamenDto
    {
        public int id_examen { get; set; }
        public int no_examen { get; set; }
        public int no_paciente { get; set; }
        public DateTime fecha_examen { get; set; }
        public string? motivo { get; set; }
        public string? observacion { get; set; }
    }
}

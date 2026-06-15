using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.Examenes
{
    public class ExamenCompletoDto
    {
        public ExamenDto? examen { get; set; }

        public List<ExamenGraduacionDto> graduaciones { get; set; }
            = new();
    }
}

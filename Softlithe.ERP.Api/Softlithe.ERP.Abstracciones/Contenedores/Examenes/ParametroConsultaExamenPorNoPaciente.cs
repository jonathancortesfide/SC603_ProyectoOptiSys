using System.ComponentModel.DataAnnotations;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Examenes
{
    public class ParametroConsultaExamenPorNoPaciente
    {

        [Required]
        public int NoPaciente { get; set; }
    }
}

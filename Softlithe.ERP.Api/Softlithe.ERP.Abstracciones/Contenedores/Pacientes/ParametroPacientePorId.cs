using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using System.ComponentModel.DataAnnotations;

namespace Softlithe.ERP.Abstracciones.Contenedores.Pacientes
{
    public class ParametroPacientePorId
    {
        [Required(ErrorMessage = MensajeDePacienteDto.CodigoPacienteRequerido)]
        public int NoPaciente { get; set; }
    }
}

using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using System.ComponentModel.DataAnnotations;

namespace Softlithe.ERP.Abstracciones.Contenedores.Pacientes
{
    public class PacienteInActivaDto
    {
        [Required(ErrorMessage = MensajeDePacienteDto.CodigoPacienteRequerido)]
        public int NoPaciente { get; set; }

        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
        public string Usuario { get; set; } = string.Empty;

        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.DatoEsActivoRequerido)]
        public bool EsActivo { get; set; }

        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
        public int Identificador { get; set; }
    }
}

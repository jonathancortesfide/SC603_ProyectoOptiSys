using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using System.ComponentModel.DataAnnotations;

namespace Softlithe.ERP.Abstracciones.Contenedores.Pacientes
{
    public class ParametroConsultaPaciente
    {
        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
        public int Identificador { get; set; }

        /// <summary>
        /// Filtra por coincidencia parcial en cédula o nombre. Vacío = todos los pacientes del identificador.
        /// </summary>
        public string TextoBusqueda { get; set; } = string.Empty;
    }
}

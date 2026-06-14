using Softlithe.ERP.Abstracciones.Contenedores;
using System.ComponentModel.DataAnnotations;

namespace Softlithe.ERP.Abstracciones.Contenedores.Pacientes
{
    public class PacienteClasificacionDto
    {
        public int no_clasificacion { get; set; }
        public string descripcion { get; set; } = string.Empty;
        public int identificador { get; set; }
        public bool activo { get; set; }
        [Required]
        public string usuario { get; set; } = string.Empty;
    }

    // DTO para creación: no incluye no_clasificacion ya que se genera en la base de datos
    public class PacienteClasificacionCrearDto
    {
        public string descripcion { get; set; } = string.Empty;
        public int identificador { get; set; }
        public bool activo { get; set; }
        [Required]
        public string usuario { get; set; } = string.Empty;
    }

    // DTO para cambiar estado: body debe contener usuario y activo
    public class PacienteClasificacionEstadoDto
    {
        [Required]
        public int identificador { get; set; }
        public bool activo { get; set; }
        public string usuario { get; set; } = string.Empty;
    }

    public class PacienteClasificacionConModeloDeValidacion : ModeloValidacion
    {
        public List<PacienteClasificacionDto> laListaDeClasificaciones { get; set; } = new List<PacienteClasificacionDto>();
    }
}

using Softlithe.ERP.Abstracciones.Contenedores;
using System.ComponentModel.DataAnnotations;

namespace Softlithe.ERP.Abstracciones.Contenedores.Grupos
{
    public class GrupoDto
    {
        public int no_grupo { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public int no_empresa { get; set; }
        public bool activo { get; set; }
        public int identificador { get; set; }
        [Required]
        public string usuario { get; set; } = string.Empty;
    }

    public class GrupoCrearDto
    {
        public string Descripcion { get; set; } = string.Empty;
        public int no_empresa { get; set; }
        public bool activo { get; set; }
        public int identificador { get; set; }
        [Required]
        public string usuario { get; set; } = string.Empty;
    }

    // DTO para modificar: no requiere enviar no_empresa
    public class GrupoModificarDto
    {
        public int no_grupo { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public bool activo { get; set; }
        public int identificador { get; set; }
        [Required]
        public string usuario { get; set; } = string.Empty;
    }

    public class GrupoEstadoDto
    {
        [Required]
        public string usuario { get; set; } = string.Empty;
        public bool activo { get; set; }
    }

    public class GrupoConModeloDeValidacion : ModeloValidacion
    {
        public List<GrupoDto> laListaDeGrupos { get; set; } = new List<GrupoDto>();
    }
}

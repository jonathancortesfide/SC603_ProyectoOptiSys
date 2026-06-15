using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos
{
    [Table("PacienteClasificacion")]
    public class PacienteClasificacion
    {
        [Column("no_clasificacion")]
        [Key]
        public int no_clasificacion { get; set; }

        [Column("descripcion")]
        public string descripcion { get; set; } = string.Empty;

        [Column("identificador")]
        public int identificador { get; set; }

        [Column("activo")]
        public bool activo { get; set; }
    }
}

using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos
{
    [Table("ClasificacionPaciente")]
    public class PacienteClasificacion
    {
        [Column("no_clasificacion")]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int no_clasificacion { get; set; }

        [Column("descripcion")]
        [StringLength(150)]
        public string descripcion { get; set; } = string.Empty;

        [Column("no_empresa")]
        public int no_empresa { get; set; }

        [Column("porcentaje_descuento", TypeName = "decimal(5,2)")]
        public decimal porcentaje_descuento { get; set; }

        [Column("activo")]
        public bool activo { get; set; }

        [Column("fecha_creacion", TypeName = "datetime")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime fecha_creacion { get; set; }

        [Column("fecha_modificacion", TypeName = "datetime")]
        public DateTime? fecha_modificacion { get; set; }
    }
}

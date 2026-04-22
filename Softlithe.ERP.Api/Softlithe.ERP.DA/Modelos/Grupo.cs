using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos
{
    [Table("GrupoProductos")]
    public class Grupo
    {
        [Column("no_grupo")]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int no_grupo { get; set; }

        [Column("descripcion")]
        [StringLength(150)]
        public string Descripcion { get; set; } = string.Empty;

        [Column("no_empresa")]
        public int no_empresa { get; set; }

        [Column("activo")]
        public bool activo { get; set; }

        [Column("fecha_creacion", TypeName = "datetime")]
        public DateTime fecha_creacion { get; set; }

        [Column("fecha_modificacion", TypeName = "datetime")]
        public DateTime? fecha_modificacion { get; set; }
    }
}

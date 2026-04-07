using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos
{
    [Table("Grupo")]
    public class Grupo
    {
        [Column("no_grupo")]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int no_grupo { get; set; }

        [Column("Descripcion")]
        public string Descripcion { get; set; } = string.Empty;

        [Column("no_empresa")]
        public int no_empresa { get; set; }

        [Column("activo")]
        public bool activo { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("Seccion")]
public class Seccion
{
    [Key]
    [Column("id_seccion")]
    public int IdSeccion { get; set; }

    [Column("nombre")]
    [StringLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [Column("activo")]
    public bool Activo { get; set; }

    public virtual ICollection<Modulo> Modulos { get; set; } = new List<Modulo>();
}

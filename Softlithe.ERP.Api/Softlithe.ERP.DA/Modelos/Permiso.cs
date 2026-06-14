using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("Permiso")]
public class Permiso
{
    [Key]
    [Column("id_permiso")]
    public int IdPermiso { get; set; }

    [Column("nombre")]
    [StringLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [Column("codigo")]
    [StringLength(100)]
    public string Codigo { get; set; } = string.Empty;

    [Column("descripcion")]
    [StringLength(250)]
    public string? Descripcion { get; set; }

    [Column("id_modulo")]
    public int IdModulo { get; set; }

    [Column("activo")]
    public bool Activo { get; set; }

    [ForeignKey(nameof(IdModulo))]
    public virtual Modulo? Modulo { get; set; }

    public virtual ICollection<RolPermiso> RolPermisos { get; set; } = new List<RolPermiso>();
}

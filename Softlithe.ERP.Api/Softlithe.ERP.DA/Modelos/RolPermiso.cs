using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("Rol_Permiso")]
public class RolPermiso
{
    [Key]
    [Column("id_rol_permiso")]
    public int IdRolPermiso { get; set; }

    [Column("id_rol")]
    public int IdRol { get; set; }

    [Column("id_permiso")]
    public int IdPermiso { get; set; }

    [Column("activo")]
    public bool Activo { get; set; }

    [ForeignKey(nameof(IdRol))]
    public virtual Rol? Rol { get; set; }

    [ForeignKey(nameof(IdPermiso))]
    public virtual Permiso? Permiso { get; set; }
}

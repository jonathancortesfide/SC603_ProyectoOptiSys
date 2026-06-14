using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("Usuario_Rol")]
public class UsuarioRol
{
    [Key]
    [Column("id_usuario_rol")]
    public int IdUsuarioRol { get; set; }

    [Column("id_usuario")]
    public int IdUsuario { get; set; }

    [Column("id_rol")]
    public int IdRol { get; set; }

    [Column("activo")]
    public bool Activo { get; set; }

    [ForeignKey(nameof(IdUsuario))]
    public virtual Usuario? Usuario { get; set; }

    [ForeignKey(nameof(IdRol))]
    public virtual Rol? Rol { get; set; }
}

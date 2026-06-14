using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("Modulo")]
public class Modulo
{
    [Key]
    [Column("id_modulo")]
    public int IdModulo { get; set; }

    [Column("nombre")]
    [StringLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [Column("descripcion")]
    [StringLength(250)]
    public string? Descripcion { get; set; }

    [Column("id_seccion")]
    public int IdSeccion { get; set; }

    [Column("activo")]
    public bool Activo { get; set; }

    [ForeignKey(nameof(IdSeccion))]
    public virtual Seccion? Seccion { get; set; }

    public virtual ICollection<Permiso> Permisos { get; set; } = new List<Permiso>();
}

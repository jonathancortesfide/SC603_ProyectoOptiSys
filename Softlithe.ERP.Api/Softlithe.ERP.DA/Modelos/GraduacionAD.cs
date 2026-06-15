using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("Graduacion")]
public partial class GraduacionAD
{
    [Key]
    [Column("id_graduacion")]
    public short IdGraduacion { get; set; }

    [Column("identificador")]
    public int Identificador { get; set; }

    [Column("nombre")]
    [StringLength(200)]
    public string? Nombre { get; set; }

    [Column("abreviatura")]
    [StringLength(20)]
    public string? Abreviatura { get; set; }

    [Column("descripcion_tecnica")]
    [StringLength(500)]
    public string? DescripcionTecnica { get; set; }

    [Column("orden")]
    public short Orden { get; set; }

    [Column("activo")]
    public bool Activo { get; set; }

    [Column("id_tipo_graduacion")]
    public short IdTipoGraduacion { get; set; }
}

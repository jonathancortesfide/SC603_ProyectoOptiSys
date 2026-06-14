using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("Bodega")]
public class Bodega
{
    [Key]
    [Column("no_bodega")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int NoBodega { get; set; }

    [Column("descripcion")]
    [StringLength(50)]
    public string? Descripcion { get; set; }

    [Column("no_empresa")]
    public int NoEmpresa { get; set; }

    [Column("activo")]
    public bool Activo { get; set; }
}

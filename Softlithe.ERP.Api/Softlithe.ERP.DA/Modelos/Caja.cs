using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("Caja")]
public class Caja
{
    [Key]
    [Column("no_caja")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int NoCaja { get; set; }

    [Column("nombre")]
    [StringLength(50)]
    public string? Nombre { get; set; }

    [Column("identificador")]
    public int Identificador { get; set; }

    [Column("activo")]
    public bool Activo { get; set; } = true;

    [Column("valor_por_defecto")]
    public bool ValorPorDefecto { get; set; }
}

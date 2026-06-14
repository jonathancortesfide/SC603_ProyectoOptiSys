using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("TipoMovimientoCaja")]
public class TipoMovimientoCaja
{
    [Key]
    [Column("no_tipo_movimiento")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int NoTipoMovimiento { get; set; }

    [Column("nombre_movimiento")]
    [StringLength(50)]
    public string? NombreMovimiento { get; set; }

    [Column("abreviatura")]
    [StringLength(10)]
    public string? Abreviatura { get; set; }

    [Column("naturaleza")]
    [StringLength(10)]
    public string? Naturaleza { get; set; }
}

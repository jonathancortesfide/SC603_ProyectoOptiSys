using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("FormaPago")]
public class FormaPago
{
    [Key]
    [Column("no_forma_pago")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int NoFormaPago { get; set; }

    [Column("nombre")]
    [StringLength(50)]
    public string? Nombre { get; set; }

    [Column("requiere_referencia")]
    public bool RequiereReferencia { get; set; }

    [Column("activo")]
    public bool Activo { get; set; } = true;

    [Column("identificador")]
    public int Identificador { get; set; }
}

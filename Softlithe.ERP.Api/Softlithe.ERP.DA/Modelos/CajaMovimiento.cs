using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("CajaMovimiento")]
public class CajaMovimiento
{
    [Key]
    [Column("id_movimiento")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int IdMovimiento { get; set; }

    [Column("id_cierre")]
    public int IdCierre { get; set; }

    [Column("no_tipo_movimiento")]
    public int NoTipoMovimiento { get; set; }

    [Column("no_forma_pago")]
    public int? NoFormaPago { get; set; }

    [Column("no_moneda")]
    public int NoMoneda { get; set; }

    [Column("monto")]
    public decimal Monto { get; set; }

    [Column("concepto")]
    [StringLength(200)]
    public string? Concepto { get; set; }

    [Column("fecha_registro")]
    public DateTime FechaRegistro { get; set; }

    [Column("id_usuario")]
    public int IdUsuario { get; set; }

    [Column("id_documento_origen")]
    public int? IdDocumentoOrigen { get; set; }

    [Column("tipo_documento_origen")]
    [StringLength(30)]
    public string? TipoDocumentoOrigen { get; set; }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("CajaCierre")]
public class CajaCierre
{
    [Key]
    [Column("id_cierre")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int IdCierre { get; set; }

    [Column("no_cierre")]
    public int NoCierre { get; set; }

    [Column("no_caja")]
    public int NoCaja { get; set; }

    [Column("estado")]
    [StringLength(30)]
    public string Estado { get; set; } = string.Empty;

    [Column("identificador")]
    public int Identificador { get; set; }

    [Column("fecha_apertura")]
    public DateTime FechaApertura { get; set; }

    [Column("fecha_cierre")]
    public DateTime? FechaCierre { get; set; }

    [Column("id_usuario")]
    public int? IdUsuario { get; set; }

    [Column("id_usuario_apertura")]
    public int? IdUsuarioApertura { get; set; }

    [Column("id_usuario_cierre")]
    public int? IdUsuarioCierre { get; set; }

    [Column("monto_apertura")]
    public decimal MontoApertura { get; set; }

    [Column("monto_esperado_sistema")]
    public decimal? MontoEsperadoSistema { get; set; }

    [Column("monto_declarado")]
    public decimal? MontoDeclarado { get; set; }

    [Column("diferencia")]
    public decimal? Diferencia { get; set; }

    [Column("observaciones")]
    [StringLength(500)]
    public string? Observaciones { get; set; }
}

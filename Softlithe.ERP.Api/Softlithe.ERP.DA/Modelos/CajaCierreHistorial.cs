using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("CajaCierreHistorial")]
public class CajaCierreHistorial
{
    [Key]
    [Column("id_historial")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int IdHistorial { get; set; }

    [Column("id_cierre")]
    public int IdCierre { get; set; }

    [Column("estado_anterior")]
    [StringLength(30)]
    public string? EstadoAnterior { get; set; }

    [Column("estado_nuevo")]
    [StringLength(30)]
    public string EstadoNuevo { get; set; } = string.Empty;

    [Column("fecha_cambio")]
    public DateTime FechaCambio { get; set; }

    [Column("id_usuario")]
    public int IdUsuario { get; set; }

    [Column("observaciones")]
    [StringLength(500)]
    public string? Observaciones { get; set; }
}

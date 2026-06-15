using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("ParametroFacturacionSucursal")]
public class ParametroFacturacionSucursal
{
    [Key]
    [Column("no_parametro_facturacion_sucursal")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int NoParametroFacturacionSucursal { get; set; }

    [Column("identificador")]
    public int Identificador { get; set; }

    [Column("codigoestablecimiento")]
    public string? CodigoEstablecimiento { get; set; }

    [Column("codigoterminal")]
    public string? CodigoTerminal { get; set; }

    [Column("codigoprovincia")]
    public string? CodigoProvincia { get; set; }

    [Column("codigocanton")]
    public string? CodigoCanton { get; set; }

    [Column("codigodistrito")]
    public string? CodigoDistrito { get; set; }

    [Column("codigobarrio")]
    public string? CodigoBarrio { get; set; }

    [Column("otrassenas")]
    public string? OtrasSenas { get; set; }

    [Column("no_bodega")]
    public int? NoBodega { get; set; }
}

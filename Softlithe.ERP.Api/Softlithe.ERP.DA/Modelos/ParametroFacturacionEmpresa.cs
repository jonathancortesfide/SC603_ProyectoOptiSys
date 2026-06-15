using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("ParametroFacturacionEmpresa")]
public class ParametroFacturacionEmpresa
{
    [Key]
    [Column("no_parametro_facturacion_empresa")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int NoParametroFacturacionEmpresa { get; set; }

    [Column("identificador")]
    public int Identificador { get; set; }

    [Column("codigoseguridad")]
    public string? CodigoSeguridad { get; set; }

    [Column("usuariocertificado")]
    public string? UsuarioCertificado { get; set; }

    [Column("contrasenacertificado")]
    public string? ContrasenaCertificado { get; set; }

    [Column("ambientecertificado")]
    public string? AmbienteCertificado { get; set; }

    [Column("correoemisor")]
    public string? CorreoEmisor { get; set; }

    [Column("contrasenacorreo")]
    public string? ContrasenaCorreo { get; set; }

    [Column("pin")]
    public string? Pin { get; set; }

    [Column("rutacertificado")]
    public string? RutaCertificado { get; set; }

    [Column("host")]
    public string? Host { get; set; }

    [Column("puerto")]
    public int? Puerto { get; set; }

    [Column("mensajefactura")]
    public string? MensajeFactura { get; set; }

    [Column("correoreceptor")]
    public string? CorreoReceptor { get; set; }

    [Column("contrasenacorreoreceptor")]
    public string? ContrasenaCorreoReceptor { get; set; }

    [Column("hostreceptor")]
    public string? HostReceptor { get; set; }

    [Column("puertoreceptor")]
    public int? PuertoReceptor { get; set; }

    [Column("seguridadsslreceptor")]
    public bool? SeguridadSslReceptor { get; set; }
}

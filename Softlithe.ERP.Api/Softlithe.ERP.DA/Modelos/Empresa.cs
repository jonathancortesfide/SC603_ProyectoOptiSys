using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("Empresa")]
public class Empresa
{
    [Key]
    [Column("no_empresa")]
    public int NoEmpresa { get; set; }

    [Column("imagen")]
    public byte[]? Imagen { get; set; }

    [Column("nombre")]
    public string? Nombre { get; set; }

    [Column("direccion")]
    public string? Direccion { get; set; }

    [Column("telefono1")]
    public string? Telefono1 { get; set; }

    [Column("telefono2")]
    public string? Telefono2 { get; set; }

    [Column("email")]
    public string? Email { get; set; }

    [Column("url")]
    public string? Url { get; set; }

    [Column("cedula")]
    public string? Cedula { get; set; }

    [Column("detallecuentasbancaria")]
    public string? DetalleCuentasBancaria { get; set; }

    public virtual ICollection<EmpresaSucursal> EmpresaSucursales { get; set; } = new List<EmpresaSucursal>();
}

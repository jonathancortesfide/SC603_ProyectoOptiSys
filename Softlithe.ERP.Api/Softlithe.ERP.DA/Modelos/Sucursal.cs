using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("Sucursal")]
public class Sucursal
{
    [Key]
    [Column("no_sucursal")]
    public int NoSucursal { get; set; }

    [Column("imagen")]
    public byte[]? Imagen { get; set; }

    [Column("Nombre")]
    public string? Nombre { get; set; }

    [Column("Direccion")]
    public string? Direccion { get; set; }

    [Column("Telefono1")]
    public string? Telefono1 { get; set; }

    [Column("Telefono2")]
    public string? Telefono2 { get; set; }

    [Column("Fax")]
    public string? Fax { get; set; }

    [Column("Email")]
    public string? Email { get; set; }

    [Column("Url")]
    public string? Url { get; set; }

    [Column("Siglas")]
    public string? Siglas { get; set; }

    [Column("Facebook")]
    public string? Facebook { get; set; }

    public virtual ICollection<EmpresaSucursal> EmpresaSucursales { get; set; } = new List<EmpresaSucursal>();
}

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("ProductoDetalle")]
public partial class ProductoDetalle
{
    [Column("id_producto")]
    [Key]
    public int IdProducto { get; set; }

    [Column("existencia")]
    public int Existencia { get; set; }

    [Column("minimo")]
    public double? Minimo { get; set; }

    [Column("perecedero")]
    public bool? Perecedero { get; set; }

    [Column("caracteristicas_adic")]
    [StringLength(256)]
    public string? CaracteristicasAdicionales { get; set; }

    [Column("foto")]
    public byte[]? Foto { get; set; }

    // Relación con Producto
    [ForeignKey("IdProducto")]
    public virtual Producto? Producto { get; set; }
}

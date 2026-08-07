using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("Producto")]
public partial class Producto
{
    [Key]
    [Column("id_producto")]
    public int IdProducto { get; set; }

    [Column("no_empresa")]
    public int NoEmpresa { get; set; }

    [Column("codigo")]
    [StringLength(50)]
    public string Codigo { get; set; } = null!;

    [Column("codigo_barra")]
    [StringLength(50)]
    public string? CodigoBarra { get; set; }

    [Column("codigo_proveedor")]
    [StringLength(50)]
    public string? CodigoProveedor { get; set; }

    [Column("descripcion")]
    [StringLength(500)]
    public string Descripcion { get; set; } = null!;

    [Column("no_grupo")]
    public int? NoGrupo { get; set; }

    [Column("activo")]
    public bool Activo { get; set; } = true;

    [Column("no_unidad_medida")]
    public int? NoUnidadMedida { get; set; }

    [Column("costo_promedio")]
    public decimal? CostoPromedio { get; set; }

    [Column("ultimo_costo")]
    public decimal? UltimoCosto { get; set; }

    [Column("ultimo_precio_costo")]
    public decimal? UltimoPrecioCosto { get; set; }

    [Column("tipo_producto")]
    [StringLength(50)]
    public string? TipoProducto { get; set; }

    [Column("no_tipo")]
    public int? NoTipo { get; set; }

    [Column("no_marca")]
    public int? NoMarca { get; set; }

    [Column("codigo_material")]
    [StringLength(50)]
    public string? CodigoMaterial { get; set; }

    [Column("codigo_impuesto")]
    [StringLength(50)]
    public string? CodigoImpuesto { get; set; }

    [Column("no_tarifa")]
    [StringLength(50)]
    public string? NoTarifa { get; set; }

    [Column("codigo_cabys")]
    [StringLength(50)]
    public string? CodigoCabys { get; set; }

    // Relación con ProductoDetalle (One-to-One)
    public virtual ProductoDetalle? ProductoDetalle { get; set; }
}

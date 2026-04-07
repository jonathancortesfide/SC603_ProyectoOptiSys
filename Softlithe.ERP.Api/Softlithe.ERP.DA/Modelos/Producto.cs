using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos
{
    [Table("Producto")]
    public class Producto
    {
        [Key]
        [Column("no_producto")]
        public int noProducto { get; set; }

        [Column("no_empresa")]
        public int noEmpresa { get; set; }


        [Column("tipo_articulo")]
        public required string tipoArticulo { get; set; }

        [Column("codigo_interno")]
        public required string codigoInterno { get; set; }

        [Column("codigo_barras")]
        public required string codigoBarras { get; set; }

        [Column("codigo_auxiliar")]
        public required string codigoAuxiliar { get; set; }

        [Column("nombre")]
        public required string nombre { get; set; }

        [Column("codigo_cabys")]
        public required string codigoCabys { get; set; }

        [Column("unidad_medida")]
        public required string unidadMedida { get; set; }

        [Column("tipo_impuesto")]
        public required string tipoImpuesto { get; set; }

        [Column("porcentaje_impuesto")]
        public decimal porcentajeImpuesto { get; set; }

        [Column("existencia")]
        public decimal existencia { get; set; }

        [Column("activo")]
        public bool activo { get; set; }

        [Column("fecha_creacion")]
        public DateTime fechaCreacion { get; set; }

        [Column("fecha_modificacion")]
        public DateTime? fechaModificacion { get; set; }
    }
}

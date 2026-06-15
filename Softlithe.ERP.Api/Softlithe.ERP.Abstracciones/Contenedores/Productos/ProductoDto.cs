using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Softlithe.ERP.Abstracciones.Contenedores.Productos
{
    public class ProductoDto
    {
        public int IdProducto { get; set; }

        /// <summary>Empresa propietaria. Requerido al insertar (validación en negocio); no se usa para actualizar por <c>IdProducto</c> único.</summary>
        public int NoEmpresa { get; set; }

        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
        public int Identificador { get; set; }

        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
        public string Usuario { get; set; } = string.Empty;

        [Required(ErrorMessage = MensajeDeProductoDto.CodigoInternoRequerido)]
        public string Codigo { get; set; } = string.Empty;

        public string? CodigoBarra { get; set; }

        public string? CodigoProveedor { get; set; }
        public int NoGrupo { get; set; }

        public bool? Activo { get; set; }

        public int? NoUnidadMedida { get; set; }

        public decimal? CostoPromedio { get; set; }

        public decimal? UltimoCosto { get; set; }

        public decimal? UltimoPrecioCosto { get; set; }

        public string? TipoProducto { get; set; }

        public int? NoTipo { get; set; }

        public int? NoMarca { get; set; }

        public string? CodigoMaterial { get; set; }

        public string? CodigoImpuesto { get; set; }

        public string? NoTarifa { get; set; }

        public string? CodigoCabys { get; set; }

        public string? descripcion { get; set; }

    }

    public class ProductoDetalleDto : ProductoDto
    {
        public string NombreMarca { get; set; } = string.Empty;
        public string NombreTarifaImpuesto { get; set; } = string.Empty;
        public decimal? ValorImpuesto { get; set; }
    }

    public class ProductoConModeloDeValidacion : ModeloValidacion
    {
        public List<ProductoDto> LaListaDeProductos { get; set; } = new List<ProductoDto>();
    }

    public class ProductoDetalleConModeloDeValidacion : ModeloValidacion
    {
        public ProductoDetalleDto? Producto { get; set; }
    }
}

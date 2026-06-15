using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Productos;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Productos;

namespace Softlithe.ERP.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly IObtenerProductoBW _obtenerProductoBW;
        private readonly IAgregarProductoBW _agregarProductoBW;
        private readonly IModificarProductoBW _modificarProductoBW;
        private readonly IModificarEstadoProductoBW _modificarEstadoProductoBW;

        public ProductosController(
            IObtenerProductoBW obtenerProductoBW,
            IAgregarProductoBW agregarProductoBW,
            IModificarProductoBW modificarProductoBW,
            IModificarEstadoProductoBW modificarEstadoProductoBW)
        {
            _obtenerProductoBW = obtenerProductoBW;
            _agregarProductoBW = agregarProductoBW;
            _modificarProductoBW = modificarProductoBW;
            _modificarEstadoProductoBW = modificarEstadoProductoBW;
        }

        /// <summary>
        /// Obtiene los productos de la empresa; filtro opcional por texto (código, barra, proveedor, descripción, marca).
        /// Incluye precio unitario sin y con impuesto (<see cref="ProductoDto.PrecioSinImpuesto"/>, <see cref="ProductoDto.PrecioConImpuesto"/>)
        /// desde <c>PrecioVenta</c> usando la lista en <c>ListaPrecios</c> con <c>valor_por_defecto = true</c>.
        /// </summary>
        [HttpGet("ObtenerProducto")]
        public async Task<ProductoConModeloDeValidacion> ObtenerProducto([FromQuery] ParametroConsultaProducto parametroConsultaProducto)
        {
            ProductoConModeloDeValidacion resultado = await _obtenerProductoBW.ObtenerProductos(parametroConsultaProducto);
            return resultado;
        }

        /// <summary>
        /// Obtiene un producto por <c>idProducto</c> único (sin filtro por empresa) con marca, tarifa de impuesto y precios de lista por defecto.
        /// </summary>
        [HttpGet("ObtenerProductoPorId")]
        public async Task<ProductoDetalleConModeloDeValidacion> ObtenerProductoPorId([FromQuery] ParametroConsultaProductoPorId parametro)
        {
            ProductoDetalleConModeloDeValidacion resultado = await _obtenerProductoBW.ObtenerProductoPorId(parametro);
            return resultado;
        }

        [HttpPost("AgregarProducto")]
        public async Task<ModeloValidacion> AgregarProducto(ProductoDto parametroProducto)
        {
            ModeloValidacion resultadoModeloValidacion = await _agregarProductoBW.AgregarProducto(parametroProducto);
            return resultadoModeloValidacion;
        }

        [HttpPost("ModificarProducto")]
        public async Task<ModeloValidacion> ModificarProducto(ProductoDto parametroProducto)
        {
            ModeloValidacion resultadoModeloValidacion = await _modificarProductoBW.ModificarProducto(parametroProducto);
            return resultadoModeloValidacion;
        }

        [HttpPost("ModificarEstadoProducto")]
        public async Task<ModeloValidacion> ModificarEstadoProducto(ProductoInActivaDto parametroProducto)
        {
            ModeloValidacion resultadoModeloValidacion = await _modificarEstadoProductoBW.ModificarEstadoProducto(parametroProducto);
            return resultadoModeloValidacion;
        }

        /// <summary>
        /// Obtiene productos mediante sp_ObtenerProductosMT por empresa y tipo.
        /// </summary>
        [HttpGet("ObtenerProductosMT/{noEmpresa}/{noTipo}")]
        public async Task<ProductoConModeloDeValidacion> ObtenerProductosMT([FromRoute] int noEmpresa, [FromRoute] int noTipo)
        {
            ProductoConModeloDeValidacion resultado = await _obtenerProductoBW.ObtenerProductosMT(noEmpresa, noTipo);
            return resultado;
        }

        /// <summary>
        /// Obtiene productos mediante sp_ObtenerProductosAR por empresa y descripción.
        /// </summary>
        [HttpGet("ObtenerProductosAR/{noEmpresa}/{descripcion}")]
        public async Task<ProductoConModeloDeValidacion> ObtenerProductosAR([FromRoute] int noEmpresa, [FromRoute] string descripcion)
        {
            ProductoConModeloDeValidacion resultado = await _obtenerProductoBW.ObtenerProductosAR(noEmpresa, descripcion);
            return resultado;
        }
    }
}

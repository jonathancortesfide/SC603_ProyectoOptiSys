using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Productos;
using Softlithe.ERP.Abstracciones.Contenedores.Productos;

namespace Softlithe.ERP.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly IProductoBW _productoBW;
        
        public ProductosController(IProductoBW productoBW)
        {
            _productoBW = productoBW;
        }
        
        [HttpGet]
        [ProducesResponseType(typeof(List<ProductoDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProductos() 
        {
            var productos = await _productoBW.ObtenerTodos();
            return Ok(productos);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ProductoDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProducto(int id)
        {
            var producto = await _productoBW.ObtenerPorId(id);
            if (producto == null) 
                return NotFound(new { EsCorrecto = false, Mensaje = "Producto no encontrado." });
            return Ok(producto);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CrearProducto([FromBody] ProductoDto producto)
        {
            var id = await _productoBW.Crear(producto);
            return Ok(new { EsCorrecto = true, Mensaje = "Producto creado correctamente.", Data = new { id } });
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ActualizarProducto(int id, [FromBody] ProductoDto producto)
        {
            if (id != producto.noProducto)
                return BadRequest(new { EsCorrecto = false, Mensaje = "El id de la URL no coincide con el del producto." });
            
            var ok = await _productoBW.Actualizar(producto);
            return Ok(new { EsCorrecto = ok, Mensaje = ok ? "Producto actualizado correctamente." : "No se encontró el producto." });
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> EliminarProducto(int id)
        {
            var ok = await _productoBW.Eliminar(id);
            return Ok(new { EsCorrecto = ok, Mensaje = ok ? "Producto eliminado correctamente." : "No se encontró el producto." });
        }

        [HttpPut("{id}/estado/{activo}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CambiarEstadoProducto(int id, bool activo)
        {
            var ok = await _productoBW.CambiarEstado(id, activo);
            return Ok(new { EsCorrecto = ok, Mensaje = ok ? $"Producto {(activo ? "activado" : "desactivado")} correctamente." : "No se encontró el producto." });
        }
    }
}

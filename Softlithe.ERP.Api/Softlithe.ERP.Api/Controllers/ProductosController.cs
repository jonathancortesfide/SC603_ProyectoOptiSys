using Microsoft.AspNetCore.Mvc;

namespace Softlithe.ERP.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductosController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetProductos()
        {
            // TODO: Implementar lógica para obtener productos
            return Ok(new object[0]);
        }

        [HttpPost]
        public IActionResult GuardarProducto([FromBody] object producto)
        {
            // TODO: Implementar lógica para crear/actualizar producto
            return Ok(new { EsCorrecto = true, Mensaje = "Producto guardado.", Data = new { id = 0 } });
        }

        [HttpDelete("{id}")]
        public IActionResult EliminarProducto(int id)
        {
            // TODO: Implementar lógica para eliminar producto
            return Ok(new { EsCorrecto = true, Mensaje = "Producto eliminado." });
        }
    }
}

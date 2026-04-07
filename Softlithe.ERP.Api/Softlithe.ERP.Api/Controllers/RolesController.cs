using Microsoft.AspNetCore.Mvc;

namespace Softlithe.ERP.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RolesController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetRoles() => Ok(new object[0]);

        [HttpGet("{id}")]
        public IActionResult GetRol(string id) => Ok(new { });

        [HttpPost]
        public IActionResult CrearRol([FromBody] object rol) => Ok(new { EsCorrecto = true, Mensaje = "Rol creado.", Data = rol });

        [HttpPut("{id}")]
        public IActionResult ActualizarRol(string id, [FromBody] object rol) => Ok(new { EsCorrecto = true, Mensaje = "Rol actualizado.", Data = rol });

        [HttpDelete("{id}")]
        public IActionResult EliminarRol(string id) => Ok(new { EsCorrecto = true, Mensaje = "Rol eliminado." });
    }
}

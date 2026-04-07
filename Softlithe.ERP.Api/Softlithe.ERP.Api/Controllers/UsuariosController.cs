using Microsoft.AspNetCore.Mvc;

namespace Softlithe.ERP.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsuariosController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetUsuarios() => Ok(new object[0]);

        [HttpGet("{id}")]
        public IActionResult GetUsuario(string id) => Ok(new { });

        [HttpGet("buscar")]
        public IActionResult BuscarUsuarios([FromQuery] string parametro) => Ok(new object[0]);

        [HttpPost]
        public IActionResult CrearUsuario([FromBody] object usuario) => Ok(new { EsCorrecto = true, Mensaje = "Usuario creado.", Data = new { id = "" } });

        [HttpPut("{id}")]
        public IActionResult ActualizarUsuario(string id, [FromBody] object usuario) => Ok(new { EsCorrecto = true, Mensaje = "Usuario actualizado.", Data = usuario });

        [HttpPost("cambiar-contrasena/{id}")]
        public IActionResult CambiarContrasena(string id, [FromBody] object cambio) => Ok(new { EsCorrecto = true, Mensaje = "Contraseña actualizada." });

        [HttpDelete("{id}")]
        public IActionResult EliminarUsuario(string id) => Ok(new { EsCorrecto = true, Mensaje = "Usuario eliminado." });
    }
}

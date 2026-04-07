using Microsoft.AspNetCore.Mvc;

namespace Softlithe.ERP.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsuariosRolesController : ControllerBase
    {
        [HttpGet("usuario/{usuarioId}")]
        public IActionResult GetRolesDeUsuario(string usuarioId) => Ok(new object[0]);

        [HttpPost("asignar")]
        public IActionResult AsignarRol([FromBody] object asignacion) => Ok(new { EsCorrecto = true, Mensaje = "Rol asignado." });

        [HttpPost("desvincular")]
        public IActionResult DesvincularRol([FromBody] object desvinculacion) => Ok(new { EsCorrecto = true, Mensaje = "Rol desvinculado." });
    }
}

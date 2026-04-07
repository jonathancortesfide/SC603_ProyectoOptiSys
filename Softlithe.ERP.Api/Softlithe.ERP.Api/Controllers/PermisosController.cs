using Microsoft.AspNetCore.Mvc;

namespace Softlithe.ERP.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PermisosController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetPermisos() => Ok(new object[0]);
    }
}

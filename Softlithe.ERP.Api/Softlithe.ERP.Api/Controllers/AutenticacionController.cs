using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Autenticacion;
using Softlithe.ERP.Abstracciones.Contenedores.Autenticacion;

namespace Softlithe.ERP.Api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AutenticacionController : ControllerBase
	{
		private readonly IAutenticacionBW _autenticacionBW;

		public AutenticacionController(IAutenticacionBW autenticacionBW)
		{
			_autenticacionBW = autenticacionBW;
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginDto credenciales)
		{
			var resultado = await _autenticacionBW.Login(credenciales);
			return Ok(resultado);
		}
	}
}

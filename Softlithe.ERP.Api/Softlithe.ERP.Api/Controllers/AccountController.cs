using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.Contenedores.Autenticacion;

namespace Softlithe.ERP.Api.Controllers;

[ApiController]
[Route("api/account")]
[Authorize]
public class AccountController : ControllerBase
{
    /// <summary>
    /// Valida el token y retorna los datos del usuario de la sesión activa.
    /// El header Authorization debe contener el JWT (sin prefijo Bearer).
    /// </summary>
    [HttpGet("my-account")]
    public IActionResult MiCuenta()
    {
        var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                  ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var email = User.FindFirst(JwtRegisteredClaimNames.Email)?.Value
                 ?? User.FindFirst(ClaimTypes.Email)?.Value;

        var displayName = User.FindFirst(JwtRegisteredClaimNames.Name)?.Value
                       ?? User.FindFirst(ClaimTypes.Name)?.Value
                       ?? email;

        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(email))
            return Unauthorized();

        return Ok(new MiCuentaResponseDto
        {
            User = new UsuarioSesionDto
            {
                Id = userId,
                Email = email,
                DisplayName = displayName ?? email,
                Role = "user"
            }
        });
    }
}

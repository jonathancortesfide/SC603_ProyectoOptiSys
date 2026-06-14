using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Autenticacion;
using Softlithe.ERP.Abstracciones.Contenedores.Autenticacion;
using Softlithe.ERP.Api.Servicios;

namespace Softlithe.ERP.Api.Controllers;

[ApiController]
[Route("connect")]
public class ConnectController : ControllerBase
{
    private readonly IAutenticacionBW _autenticacionBW;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly ILogger<ConnectController> _logger;

    public ConnectController(
        IAutenticacionBW AutenticacionBW,
        IJwtTokenService JwtTokenService,
        ILogger<ConnectController> Logger)
    {
        _autenticacionBW = AutenticacionBW;
        _jwtTokenService = JwtTokenService;
        _logger = Logger;
    }

    /// <summary>
    /// Emite un JWT a partir de credenciales usuario/contraseña.
    /// Recibe application/x-www-form-urlencoded — compatible con el flujo password grant del SPA.
    /// </summary>
    [HttpPost("token")]
    [Consumes("application/x-www-form-urlencoded")]
    public async Task<IActionResult> Token(
        [FromForm(Name = "username")] string Username,
        [FromForm(Name = "password")] string Password,
        [FromForm(Name = "grant_type")] string GrantType = "password")
    {
        if (GrantType != "password")
            return BadRequest(new { error = "unsupported_grant_type" });

        if (string.IsNullOrWhiteSpace(Username) || string.IsNullOrWhiteSpace(Password))
            return BadRequest(new { error = "invalid_request" });

        var usuario = await _autenticacionBW.ValidarCredencialesAsync(Username, Password);

        if (usuario is null)
            return Unauthorized(new { error = "invalid_credentials" });

        var accessToken = _jwtTokenService.GenerarToken(usuario);

        return Ok(new TokenResponseDto { AccessToken = accessToken });
    }
}

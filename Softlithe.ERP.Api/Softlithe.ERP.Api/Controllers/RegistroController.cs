using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Autenticacion;
using Softlithe.ERP.Abstracciones.Contenedores.Autenticacion;
using Softlithe.ERP.Api.Servicios;

namespace Softlithe.ERP.Api.Controllers;

[ApiController]
[Route("api/Seguridad")]
public class RegistroController : ControllerBase
{
    private readonly IAutenticacionBW _autenticacionBW;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly ILogger<RegistroController> _logger;

    public RegistroController(
        IAutenticacionBW AutenticacionBW,
        IJwtTokenService JwtTokenService,
        ILogger<RegistroController> Logger)
    {
        _autenticacionBW = AutenticacionBW;
        _jwtTokenService = JwtTokenService;
        _logger = Logger;
    }

    /// <summary>
    /// Registra un nuevo usuario y retorna un JWT de sesión.
    /// </summary>
    [HttpPost("RegistrarUsuario")]
    public async Task<IActionResult> RegistrarUsuario([FromBody] RegistrarUsuarioDto Request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var usuario = await _autenticacionBW.RegistrarUsuarioAsync(Request);

        if (usuario is null)
            return Conflict(new { error = "El email ya está registrado." });

        var accessToken = _jwtTokenService.GenerarToken(usuario);

        return Ok(new RegistrarUsuarioResponseDto
        {
            AccessToken = accessToken,
            User = usuario
        });
    }
}

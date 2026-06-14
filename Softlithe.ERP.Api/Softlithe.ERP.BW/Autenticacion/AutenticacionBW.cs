using Microsoft.Extensions.Logging;
using Softlithe.ERP.Abstracciones.BW.Autenticacion;
using Softlithe.ERP.Abstracciones.Contenedores.Autenticacion;
using Softlithe.ERP.Abstracciones.DA.Autenticacion;

namespace Softlithe.ERP.BW.Autenticacion;

public class AutenticacionBW : IAutenticacionBW
{
    private readonly IAutenticacionDA _autenticacionDA;
    private readonly IPasswordService _passwordService;
    private readonly ILogger<AutenticacionBW> _logger;

    public AutenticacionBW(
        IAutenticacionDA AutenticacionDA,
        IPasswordService PasswordService,
        ILogger<AutenticacionBW> Logger)
    {
        _autenticacionDA = AutenticacionDA;
        _passwordService = PasswordService;
        _logger = Logger;
    }

    public async Task<UsuarioSesionDto?> ValidarCredencialesAsync(string Email, string Password)
    {
        try
        {
            var usuario = await _autenticacionDA.ObtenerUsuarioParaLoginAsync(Email);

            if (usuario is null || !usuario.Activo)
            {
                _logger.LogWarning("Login fallido — usuario no encontrado o inactivo: {Email}", Email);
                return null;
            }

            if (!_passwordService.VerifyPassword(usuario.PasswordHash, Password))
            {
                _logger.LogWarning("Login fallido — contraseña incorrecta: {Email}", Email);
                return null;
            }

            return new UsuarioSesionDto
            {
                Id = usuario.IdUsuario.ToString(),
                Email = usuario.Email,
                DisplayName = usuario.Nombre,
                Role = "user"
            };
        }
        catch (Exception Ex)
        {
            _logger.LogError(Ex, "Error al validar credenciales para {Email}", Email);
            throw;
        }
    }

    public async Task<UsuarioSesionDto?> RegistrarUsuarioAsync(RegistrarUsuarioDto Request)
    {
        try
        {
            var usuarioExistente = await _autenticacionDA.ObtenerUsuarioParaLoginAsync(Request.Email);
            if (usuarioExistente is not null)
            {
                _logger.LogWarning("Intento de registro con email ya existente: {Email}", Request.Email);
                return null;
            }

            var passwordHash = _passwordService.HashPassword(Request.Password);

            var nuevoUsuario = await _autenticacionDA.RegistrarUsuarioAsync(new RegistrarUsuarioInternoDto
            {
                Email = Request.Email,
                PasswordHash = passwordHash,
                Nombre = $"{Request.FirstName} {Request.LastName}".Trim(),
                Identificador = Request.Identificador
            });

            if (nuevoUsuario is null) return null;

            return new UsuarioSesionDto
            {
                Id = nuevoUsuario.IdUsuario.ToString(),
                Email = nuevoUsuario.Email,
                DisplayName = nuevoUsuario.Nombre,
                Role = "user"
            };
        }
        catch (Exception Ex)
        {
            _logger.LogError(Ex, "Error al registrar usuario {Email}", Request.Email);
            throw;
        }
    }
}

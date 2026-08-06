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
            var passwordHash = _passwordService.HashPassword(Request.Password);
            var usuarioExistente = await _autenticacionDA.ObtenerUsuarioParaLoginAsync(Request.Email);

            if (usuarioExistente is not null)
            {
                if (usuarioExistente.Activo)
                {
                    _logger.LogWarning("Intento de registro con email ya existente y activo: {Email}", Request.Email);
                    return null;
                }

                var activado = await _autenticacionDA.ActivarUsuarioAsync(Request.Email, passwordHash);
                if (!activado)
                {
                    _logger.LogWarning("No se pudo reactivar el usuario pendiente: {Email}", Request.Email);
                    return null;
                }

                return new UsuarioSesionDto
                {
                    Id = usuarioExistente.IdUsuario.ToString(),
                    Email = usuarioExistente.Email,
                    DisplayName = usuarioExistente.Nombre,
                    Role = "user"
                };
            }

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

    public async Task<bool> ActivarUsuarioAsync(ActivarUsuarioDto Request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(Request.Email) || string.IsNullOrWhiteSpace(Request.Password))
            {
                return false;
            }

            var usuario = await _autenticacionDA.ObtenerUsuarioParaLoginAsync(Request.Email);
            if (usuario is null)
            {
                return false;
            }

            var passwordHash = _passwordService.HashPassword(Request.Password);
            return await _autenticacionDA.ActivarUsuarioAsync(Request.Email, passwordHash);
        }
        catch (Exception Ex)
        {
            _logger.LogError(Ex, "Error al activar usuario {Email}", Request.Email);
            throw;
        }
    }
}

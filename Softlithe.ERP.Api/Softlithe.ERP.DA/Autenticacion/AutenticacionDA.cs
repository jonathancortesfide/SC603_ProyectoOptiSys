using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Autenticacion;
using Softlithe.ERP.Abstracciones.DA.Autenticacion;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Autenticacion;

public class AutenticacionDA : IAutenticacionDA
{
    private readonly ContextoBasedeDatos _contexto;

    public AutenticacionDA(ContextoBasedeDatos Contexto)
    {
        _contexto = Contexto;
    }

    public async Task<UsuarioParaLoginDto?> ObtenerUsuarioParaLoginAsync(string Email)
    {
        try
        {
            var emailBuscado = Email.Trim().ToLower();

            return await _contexto.Usuarios
                .AsNoTracking()
                .Where(U => U.Email != null && U.Email.Trim().ToLower() == emailBuscado)
                .OrderByDescending(U => U.Activo)
                .Select(U => new UsuarioParaLoginDto
                {
                    IdUsuario = U.IdUsuario,
                    Email = U.Email ?? string.Empty,
                    Nombre = U.Nombre ?? string.Empty,
                    PasswordHash = U.PasswordHash ?? string.Empty,
                    Activo = U.Activo,
                    Identificador = U.Identificador
                })
                .FirstOrDefaultAsync();
        }
        catch (Exception Ex)
        {
            throw new Exception($"Error al obtener usuario para login: {Ex.Message}", Ex);
        }
    }

    public async Task<UsuarioParaLoginDto?> RegistrarUsuarioAsync(RegistrarUsuarioInternoDto Request)
    {
        try
        {
            var nuevoUsuario = new Usuario
            {
                Email = Request.Email,
                Nombre = Request.Nombre,
                PasswordHash = Request.PasswordHash,
                Identificador = Request.Identificador,
                IdIdentityServer = string.Empty,
                Activo = true
            };

            _contexto.Usuarios.Add(nuevoUsuario);
            await _contexto.SaveChangesAsync();

            return new UsuarioParaLoginDto
            {
                IdUsuario = nuevoUsuario.IdUsuario,
                Email = nuevoUsuario.Email ?? string.Empty,
                Nombre = nuevoUsuario.Nombre ?? string.Empty,
                PasswordHash = nuevoUsuario.PasswordHash ?? string.Empty,
                Activo = nuevoUsuario.Activo,
                Identificador = nuevoUsuario.Identificador
            };
        }
        catch (Exception Ex)
        {
            throw new Exception($"Error al registrar usuario: {Ex.Message}", Ex);
        }
    }
}

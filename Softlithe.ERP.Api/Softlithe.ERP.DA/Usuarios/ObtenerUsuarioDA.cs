using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;
using Softlithe.ERP.Abstracciones.DA.Usuarios;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Usuarios;

public class ObtenerUsuarioDA : IObtenerUsuarioDA
{
    private readonly ContextoBasedeDatos _contexto;

    public ObtenerUsuarioDA(ContextoBasedeDatos contexto)
    {
        _contexto = contexto;
    }

    public async Task<List<UsuarioDto>> ObtenerUsuarios(int identificador, string? descripcion)
    {
        try
        {
            IQueryable<Usuario> consulta = _contexto.Usuarios.AsNoTracking()
                .Where(u => u.Identificador == identificador);

            if (!string.IsNullOrWhiteSpace(descripcion))
            {
                consulta = consulta.Where(u =>
                    EF.Functions.Like(u.Nombre ?? string.Empty, "%" + descripcion + "%"));
            }

            return await consulta
                .OrderBy(u => u.Nombre)
                .Select(u => new UsuarioDto
                {
                    IdUsuario = u.IdUsuario,
                    IdIdentityServer = u.IdIdentityServer,
                    Identificador = u.Identificador,
                    Nombre = u.Nombre ?? string.Empty,
                    EsDoctor = u.EsDoctor,
                    CodigoProfesional = u.CodigoProfesional,
                    Email = u.Email ?? string.Empty,
                    Telefono = u.Telefono,
                    Direccion = u.Direccion,
                    FechaNacimiento = u.FechaNacimiento,
                    EsActivo = u.Activo,
                })
                .ToListAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Ocurrió un error al obtener los usuarios: " + ex.Message + ". StackTrace: " + ex.StackTrace +
                ". Mensaje Inner Exception: " + ex.InnerException?.Message);
        }
    }

    public async Task<List<UsuarioDto>> ObtenerDoctores(int identificador)
    {
        try
        {
            return await _contexto.Usuarios.AsNoTracking()
                .Where(u => u.Identificador == identificador && u.EsDoctor == true)
                .OrderBy(u => u.Nombre)
                .Select(u => new UsuarioDto
                {
                    IdUsuario = u.IdUsuario,
                    IdIdentityServer = u.IdIdentityServer,
                    Identificador = u.Identificador,
                    Nombre = u.Nombre ?? string.Empty,
                    EsDoctor = u.EsDoctor,
                    CodigoProfesional = u.CodigoProfesional,
                    Email = u.Email ?? string.Empty,
                    Telefono = u.Telefono,
                    Direccion = u.Direccion,
                    FechaNacimiento = u.FechaNacimiento,
                    EsActivo = u.Activo,
                })
                .ToListAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Ocurrió un error al obtener los doctores: " + ex.Message + ". StackTrace: " + ex.StackTrace +
                ". Mensaje Inner Exception: " + ex.InnerException?.Message);
        }
    }

    public async Task<UsuarioDto?> ObtenerUsuarioPorId(int idUsuario)
    {
        try
        {
            return await _contexto.Usuarios.AsNoTracking()
                .Where(u => u.IdUsuario == idUsuario)
                .Select(u => new UsuarioDto
                {
                    IdUsuario = u.IdUsuario,
                    IdIdentityServer = u.IdIdentityServer,
                    Identificador = u.Identificador,
                    Nombre = u.Nombre ?? string.Empty,
                    EsDoctor = u.EsDoctor,
                    CodigoProfesional = u.CodigoProfesional,
                    Email = u.Email ?? string.Empty,
                    Telefono = u.Telefono,
                    Direccion = u.Direccion,
                    FechaNacimiento = u.FechaNacimiento,
                    EsActivo = u.Activo,
                })
                .FirstOrDefaultAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Ocurrió un error al obtener el usuario por id: " + ex.Message + ". StackTrace: " + ex.StackTrace +
                ". Mensaje Inner Exception: " + ex.InnerException?.Message);
        }
    }

    public async Task<UsuarioDto?> ObtenerUsuarioPorCorreo(string email)
    {
        try
        {
            string emailBuscado = email.Trim();
            return await _contexto.Usuarios.AsNoTracking()
                .Where(u => u.Email != null && u.Email.Trim() == emailBuscado)
                .OrderByDescending(u => u.Activo)
                .ThenBy(u => u.IdUsuario)
                .Select(u => new UsuarioDto
                {
                    IdUsuario = u.IdUsuario,
                    IdIdentityServer = u.IdIdentityServer,
                    Identificador = u.Identificador,
                    Nombre = u.Nombre ?? string.Empty,
                    EsDoctor = u.EsDoctor,
                    CodigoProfesional = u.CodigoProfesional,
                    Email = u.Email ?? string.Empty,
                    Telefono = u.Telefono,
                    Direccion = u.Direccion,
                    FechaNacimiento = u.FechaNacimiento,
                    EsActivo = u.Activo,
                })
                .FirstOrDefaultAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Ocurrió un error al obtener el usuario por correo: " + ex.Message + ". StackTrace: " + ex.StackTrace +
                ". Mensaje Inner Exception: " + ex.InnerException?.Message);
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;
using Softlithe.ERP.Abstracciones.DA.Usuarios;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Usuarios;

public class ModificarEstadoUsuarioDA : IModificarEstadoUsuarioDA
{
    private readonly ContextoBasedeDatos _contexto;

    public ModificarEstadoUsuarioDA(ContextoBasedeDatos contexto)
    {
        _contexto = contexto;
    }

    public async Task<RespuestaCambiarEstadoUsuarioDA> ModificarEstadoUsuario(ModificarEstadoUsuarioDto dto)
    {
        if (dto == null)
        {
            throw new ArgumentNullException(nameof(dto));
        }

        await using IDbContextTransaction transaction = await _contexto.Database.BeginTransactionAsync();

        try
        {
            Usuario? existente = await _contexto.Usuarios.FindAsync(dto.IdUsuario);

            if (existente == null)
            {
                return new RespuestaCambiarEstadoUsuarioDA
                {
                    ModeloUsuario = new UsuarioDto { Identificador = dto.Identificador },
                    ResultadoRegistro = 0,
                };
            }

            existente.Activo = dto.EsActivo;
            _contexto.Usuarios.Update(existente);
            int resultadoRegistro = await _contexto.SaveChangesAsync();
            await transaction.CommitAsync();

            return new RespuestaCambiarEstadoUsuarioDA
            {
                ResultadoRegistro = resultadoRegistro,
                ModeloUsuario = new UsuarioDto
                {
                    IdUsuario = existente.IdUsuario,
                    IdIdentityServer = existente.IdIdentityServer,
                    Identificador = existente.Identificador,
                    Nombre = existente.Nombre ?? string.Empty,
                    EsDoctor = existente.EsDoctor,
                    CodigoProfesional = existente.CodigoProfesional,
                    Email = existente.Email ?? string.Empty,
                    Telefono = existente.Telefono,
                    Direccion = existente.Direccion,
                    FechaNacimiento = existente.FechaNacimiento,
                    EsActivo = existente.Activo,
                },
            };
        }
        catch (DbUpdateException dbEx)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar el estado del usuario en la base de datos.", dbEx);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar el estado del usuario.", ex);
        }
    }
}

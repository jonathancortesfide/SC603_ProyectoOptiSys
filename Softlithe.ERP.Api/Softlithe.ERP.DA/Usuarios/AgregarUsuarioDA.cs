using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;
using Softlithe.ERP.Abstracciones.DA.Usuarios;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Usuarios;

public class AgregarUsuarioDA : IAgregarUsuarioDA
{
    private readonly ContextoBasedeDatos _contexto;

    public AgregarUsuarioDA(ContextoBasedeDatos contexto)
    {
        _contexto = contexto;
    }

    public async Task<int> AgregarUsuario(AgregarUsuarioDto dto)
    {
        if (dto == null)
        {
            throw new ArgumentNullException(nameof(dto));
        }

        await using IDbContextTransaction transaction = await _contexto.Database.BeginTransactionAsync();

        try
        {
            var entidad = new Usuario
            {
                IdIdentityServer = dto.IdIdentityServer,
                Identificador = dto.Identificador,
                Nombre = dto.Nombre,
                EsDoctor = dto.EsDoctor,
                CodigoProfesional = dto.CodigoProfesional,
                Email = dto.Email,
                Telefono = dto.Telefono,
                Direccion = dto.Direccion,
                FechaNacimiento = dto.FechaNacimiento,
                Activo = dto.EsActivo,
            };

            await _contexto.Usuarios.AddAsync(entidad);
            int resultadoRegistro = await _contexto.SaveChangesAsync();
            await transaction.CommitAsync();

            return resultadoRegistro;
        }
        catch (DbUpdateException dbEx)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al guardar el usuario en la base de datos.", dbEx);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al guardar el usuario.", ex);
        }
    }
}

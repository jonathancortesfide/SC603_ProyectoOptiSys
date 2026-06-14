using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;
using Softlithe.ERP.Abstracciones.DA.Usuarios;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Usuarios;

public class ModificarUsuarioDA : IModificarUsuarioDA
{
    private readonly ContextoBasedeDatos _contexto;

    public ModificarUsuarioDA(ContextoBasedeDatos contexto)
    {
        _contexto = contexto;
    }

    public async Task<int> ModificarUsuario(ModificarUsuarioDto dto)
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
                return 0;
            }

            existente.IdIdentityServer = dto.IdIdentityServer;
            existente.Identificador = dto.Identificador;
            existente.Nombre = dto.Nombre;
            existente.EsDoctor = dto.EsDoctor;
            existente.CodigoProfesional = dto.CodigoProfesional;
            existente.Email = dto.Email;
            existente.Telefono = dto.Telefono;
            existente.Direccion = dto.Direccion;
            existente.FechaNacimiento = dto.FechaNacimiento;

            _contexto.Usuarios.Update(existente);
            int resultadoRegistro = await _contexto.SaveChangesAsync();
            await transaction.CommitAsync();

            return resultadoRegistro;
        }
        catch (DbUpdateException dbEx)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar el usuario en la base de datos.", dbEx);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar el usuario.", ex);
        }
    }
}

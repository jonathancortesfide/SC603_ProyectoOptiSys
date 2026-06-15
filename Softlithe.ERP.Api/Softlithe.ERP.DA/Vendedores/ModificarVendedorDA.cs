using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Vendedores;
using Softlithe.ERP.Abstracciones.DA.Vendedores;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Vendedores;

public class ModificarVendedorDA : IModificarVendedorDA
{
    private readonly ContextoBasedeDatos _contexto;

    public ModificarVendedorDA(ContextoBasedeDatos contexto)
    {
        _contexto = contexto;
    }

    public async Task<int> ModificarVendedor(ModificarVendedorDto dto)
    {
        if (dto == null)
        {
            throw new ArgumentNullException(nameof(dto));
        }

        await using IDbContextTransaction transaction = await _contexto.Database.BeginTransactionAsync();

        try
        {
            Vendedor? existente = await _contexto.Vendedores.FindAsync(dto.NoVendedor);

            if (existente == null)
            {
                return 0;
            }

            existente.Descripcion = dto.Descripcion;
            existente.Identificador = dto.Identificador;
            existente.IdUsuario = dto.IdUsuario;

            _contexto.Vendedores.Update(existente);
            int resultadoRegistro = await _contexto.SaveChangesAsync();
            await transaction.CommitAsync();

            return resultadoRegistro;
        }
        catch (DbUpdateException dbEx)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar el vendedor en la base de datos.", dbEx);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar el vendedor.", ex);
        }
    }
}

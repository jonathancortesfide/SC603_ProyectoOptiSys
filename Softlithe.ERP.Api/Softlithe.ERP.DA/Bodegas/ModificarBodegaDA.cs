using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Bodegas;
using Softlithe.ERP.Abstracciones.DA.Bodegas;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Bodegas;

public class ModificarBodegaDA : IModificarBodegaDA
{
    private readonly ContextoBasedeDatos _contexto;

    public ModificarBodegaDA(ContextoBasedeDatos contextoBasedeDatos)
    {
        _contexto = contextoBasedeDatos;
    }

    public async Task<int> ModificarBodega(ModificarBodegaDto dto)
    {
        if (dto == null)
        {
            throw new ArgumentNullException(nameof(dto));
        }

        await using IDbContextTransaction transaction = await _contexto.Database.BeginTransactionAsync();

        try
        {
            Bodega? existente = await _contexto.Bodegas.FindAsync(dto.NoBodega);

            if (existente == null)
            {
                return 0;
            }

            existente.Descripcion = dto.Descripcion;

            _contexto.Bodegas.Update(existente);
            int resultadoRegistro = await _contexto.SaveChangesAsync();
            await transaction.CommitAsync();

            return resultadoRegistro;
        }
        catch (DbUpdateException dbEx)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar la bodega en la base de datos.", dbEx);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar la bodega.", ex);
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Bodegas;
using Softlithe.ERP.Abstracciones.DA.Bodegas;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Bodegas;

public class AgregarBodegaDA : IAgregarBodegaDA
{
    private readonly ContextoBasedeDatos _contexto;

    public AgregarBodegaDA(ContextoBasedeDatos contextoBasedeDatos)
    {
        _contexto = contextoBasedeDatos;
    }

    public async Task<int> AgregarBodega(AgregarBodegaDto dto)
    {
        if (dto == null)
        {
            throw new ArgumentNullException(nameof(dto));
        }

        await using IDbContextTransaction transaction = await _contexto.Database.BeginTransactionAsync();

        try
        {
            var entidad = new Bodega
            {
                NoEmpresa = dto.NoEmpresa,
                Descripcion = dto.Descripcion,
                Activo = dto.EsActivo,
            };

            await _contexto.Bodegas.AddAsync(entidad);
            int resultadoRegistro = await _contexto.SaveChangesAsync();
            await transaction.CommitAsync();

            return resultadoRegistro;
        }
        catch (DbUpdateException dbEx)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al guardar la bodega en la base de datos.", dbEx);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al guardar la bodega.", ex);
        }
    }
}

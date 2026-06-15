using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Vendedores;
using Softlithe.ERP.Abstracciones.DA.Vendedores;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Vendedores;

public class AgregarVendedorDA : IAgregarVendedorDA
{
    private readonly ContextoBasedeDatos _contexto;

    public AgregarVendedorDA(ContextoBasedeDatos contexto)
    {
        _contexto = contexto;
    }

    public async Task<int> AgregarVendedor(AgregarVendedorDto dto)
    {
        if (dto == null)
        {
            throw new ArgumentNullException(nameof(dto));
        }

        await using IDbContextTransaction transaction = await _contexto.Database.BeginTransactionAsync();

        try
        {
            var entidad = new Vendedor
            {
                Descripcion = dto.Descripcion,
                Identificador = dto.Identificador,
                IdUsuario = dto.IdUsuario,
                Activo = dto.EsActivo,
            };

            await _contexto.Vendedores.AddAsync(entidad);
            int resultadoRegistro = await _contexto.SaveChangesAsync();
            await transaction.CommitAsync();

            return resultadoRegistro;
        }
        catch (DbUpdateException dbEx)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al guardar el vendedor en la base de datos.", dbEx);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al guardar el vendedor.", ex);
        }
    }
}

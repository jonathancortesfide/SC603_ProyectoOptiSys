using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Bodegas;
using Softlithe.ERP.Abstracciones.DA.Bodegas;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Bodegas;

public class ModificarEstadoBodegaDA : IModificarEstadoBodegaDA
{
    private readonly ContextoBasedeDatos _contexto;

    public ModificarEstadoBodegaDA(ContextoBasedeDatos contextoBasedeDatos)
    {
        _contexto = contextoBasedeDatos;
    }

    public async Task<RespuestaCambiarEstadoBodegaDA> ModificarEstadoBodega(ModificarEstadoBodegaDto dto)
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
                return new RespuestaCambiarEstadoBodegaDA
                {
                    ModeloBodega = new BodegaDto(),
                    ResultadoRegistro = 0,
                };
            }

            int identificadorBitacora = await _contexto.EmpresaSucursales.AsNoTracking()
                .Where(es => es.NoEmpresa == existente.NoEmpresa)
                .OrderBy(es => es.Identificador)
                .Select(es => es.Identificador)
                .FirstOrDefaultAsync();

            existente.Activo = dto.EsActivo;
            _contexto.Bodegas.Update(existente);
            int resultadoRegistro = await _contexto.SaveChangesAsync();
            await transaction.CommitAsync();

            return new RespuestaCambiarEstadoBodegaDA
            {
                ResultadoRegistro = resultadoRegistro,
                ModeloBodega = new BodegaDto
                {
                    NoBodega = existente.NoBodega,
                    Descripcion = existente.Descripcion ?? string.Empty,
                    NoEmpresa = existente.NoEmpresa,
                    EsActivo = existente.Activo,
                    Identificador = identificadorBitacora,
                },
            };
        }
        catch (DbUpdateException dbEx)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar el estado de la bodega en la base de datos.", dbEx);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar el estado de la bodega.", ex);
        }
    }
}

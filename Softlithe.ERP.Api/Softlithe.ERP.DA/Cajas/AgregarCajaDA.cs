using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Cajas;
using Softlithe.ERP.Abstracciones.DA.Cajas;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Cajas;

public class AgregarCajaDA : IAgregarCajaDA
{
    private readonly ContextoBasedeDatos _contexto;

    public AgregarCajaDA(ContextoBasedeDatos contexto)
    {
        _contexto = contexto;
    }

    public async Task<int> AgregarCaja(AgregarCajaDto dto)
    {
        if (dto == null)
        {
            throw new ArgumentNullException(nameof(dto));
        }

        await using IDbContextTransaction transaction = await _contexto.Database.BeginTransactionAsync();

        try
        {
            var entidad = new Caja
            {
                Nombre = dto.Nombre,
                Identificador = dto.Identificador,
                Activo = dto.EsActivo,
                ValorPorDefecto = dto.EsPorDefecto,
            };

            await _contexto.Cajas.AddAsync(entidad);
            int resultadoRegistro = await _contexto.SaveChangesAsync();

            if (dto.EsPorDefecto)
            {
                await CajaValorPorDefectoSoporte.QuitarOtrosPorDefecto(_contexto, dto.Identificador, entidad.NoCaja);
                await _contexto.SaveChangesAsync();
            }

            await transaction.CommitAsync();

            return resultadoRegistro;
        }
        catch (DbUpdateException dbEx)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al guardar la caja en la base de datos.", dbEx);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al guardar la caja.", ex);
        }
    }
}

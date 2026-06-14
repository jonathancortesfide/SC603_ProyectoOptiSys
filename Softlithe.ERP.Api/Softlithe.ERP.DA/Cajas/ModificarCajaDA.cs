using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Cajas;
using Softlithe.ERP.Abstracciones.DA.Cajas;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Cajas;

public class ModificarCajaDA : IModificarCajaDA
{
    private readonly ContextoBasedeDatos _contexto;

    public ModificarCajaDA(ContextoBasedeDatos contexto)
    {
        _contexto = contexto;
    }

    public async Task<int> ModificarCaja(ModificarCajaDto dto)
    {
        if (dto == null)
        {
            throw new ArgumentNullException(nameof(dto));
        }

        await using IDbContextTransaction transaction = await _contexto.Database.BeginTransactionAsync();

        try
        {
            Caja? existente = await _contexto.Cajas.FindAsync(dto.NoCaja);

            if (existente == null)
            {
                return 0;
            }

            existente.Nombre = dto.Nombre;
            existente.Identificador = dto.Identificador;
            existente.ValorPorDefecto = dto.EsPorDefecto;

            if (dto.EsPorDefecto)
            {
                await CajaValorPorDefectoSoporte.QuitarOtrosPorDefecto(_contexto, dto.Identificador, existente.NoCaja);
            }

            _contexto.Cajas.Update(existente);
            int resultadoRegistro = await _contexto.SaveChangesAsync();
            await transaction.CommitAsync();

            return resultadoRegistro;
        }
        catch (DbUpdateException dbEx)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar la caja en la base de datos.", dbEx);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar la caja.", ex);
        }
    }
}

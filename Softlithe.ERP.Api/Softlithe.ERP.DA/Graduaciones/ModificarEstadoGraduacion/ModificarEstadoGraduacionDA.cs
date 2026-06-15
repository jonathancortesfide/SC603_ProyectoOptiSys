using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.DA.Graduaciones.ModificarEstadoGraduacion;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Graduaciones.ModificarEstadoGraduacion;

public class ModificarEstadoGraduacionDA : IModificarEstadoGraduacionDA
{
    private readonly ContextoBasedeDatos _contextoBasedeDatos;

    public ModificarEstadoGraduacionDA(ContextoBasedeDatos contextoBasedeDatos)
    {
        _contextoBasedeDatos = contextoBasedeDatos;
    }

    public async Task<int> ModificarEstadoGraduacion(int idGraduacion, bool activo)
    {
        await using IDbContextTransaction transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();
        try
        {
            GraduacionAD? existente = await _contextoBasedeDatos.GraduacionContexto.FindAsync((short)idGraduacion);
            if (existente == null)
            {
                return 0;
            }

            existente.Activo = activo;
            _contextoBasedeDatos.GraduacionContexto.Update(existente);
            int resultado = await _contextoBasedeDatos.SaveChangesAsync();
            await transaction.CommitAsync();
            return resultado;
        }
        catch (DbUpdateException dbEx)
        {
            await transaction.RollbackAsync();
            _contextoBasedeDatos.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar el estado de la graduación en la base de datos.", dbEx);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _contextoBasedeDatos.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar el estado de la graduación.", ex);
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Graduaciones;
using Softlithe.ERP.Abstracciones.DA.Graduaciones.ModificarGraduacion;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Graduaciones.ModificarGraduacion;

public class ModificarGraduacionDA : IModificarGraduacionDA
{
    private readonly ContextoBasedeDatos _contextoBasedeDatos;

    public ModificarGraduacionDA(ContextoBasedeDatos contextoBasedeDatos)
    {
        _contextoBasedeDatos = contextoBasedeDatos;
    }

    public async Task<int> ModificarGraduacion(GraduacionDto graduacion)
    {
        if (graduacion == null) throw new ArgumentNullException(nameof(graduacion));
        await using IDbContextTransaction transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();
        try
        {
            GraduacionAD? existente = await _contextoBasedeDatos.GraduacionContexto.FindAsync((short)graduacion.IdGraduacion);
            if (existente == null)
            {
                return 0;
            }

            existente.Identificador = graduacion.Identificador;
            existente.Nombre = graduacion.Nombre;
            existente.Abreviatura = graduacion.Abreviatura;
            existente.DescripcionTecnica = graduacion.DescripcionTecnica;
            existente.Orden = (short)graduacion.Orden;
            existente.Activo = graduacion.Activo;
            existente.IdTipoGraduacion = (short)graduacion.IdTipoGraduacion;

            _contextoBasedeDatos.GraduacionContexto.Update(existente);
            int resultado = await _contextoBasedeDatos.SaveChangesAsync();
            await transaction.CommitAsync();
            return resultado;
        }
        catch (DbUpdateException dbEx)
        {
            await transaction.RollbackAsync();
            _contextoBasedeDatos.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar la graduación en la base de datos.", dbEx);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _contextoBasedeDatos.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar la graduación.", ex);
        }
    }
}

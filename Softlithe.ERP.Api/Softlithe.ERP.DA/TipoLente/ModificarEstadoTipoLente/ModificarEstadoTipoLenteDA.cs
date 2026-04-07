using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.DA.TipoLente.ModificarEstadoTipoLente;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.TipoLente.ModificarEstadoTipoLente
{
    public class ModificarEstadoTipoLenteDA : IModificarEstadoTipoLenteDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;

        public ModificarEstadoTipoLenteDA(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }

        public async Task<int> ModificarEstadoTipoLente(int noTipoLente, bool activo)
        {
            await using IDbContextTransaction transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();
            try
            {
                TipoLenteAD? tipoLenteExistente = await _contextoBasedeDatos.TipoLente.FindAsync(noTipoLente);

                if (tipoLenteExistente == null)
                {
                    return 0;
                }

                tipoLenteExistente.Activo = activo;
                _contextoBasedeDatos.TipoLente.Update(tipoLenteExistente);
                int resultadoRegistro = await _contextoBasedeDatos.SaveChangesAsync();
                await transaction.CommitAsync();
                return resultadoRegistro;
            }
            catch (DbUpdateException dbEx)
            {
                await transaction.RollbackAsync();
                _contextoBasedeDatos.ChangeTracker.Clear();
                throw new Exception("Ocurrió un error al modificar el estado del tipo de lente en la base de datos.", dbEx);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _contextoBasedeDatos.ChangeTracker.Clear();
                throw new Exception("Ocurrió un error al modificar el estado del tipo de lente.", ex);
            }
        }
    }
}
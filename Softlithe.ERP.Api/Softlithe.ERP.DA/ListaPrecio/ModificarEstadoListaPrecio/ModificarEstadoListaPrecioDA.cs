using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.DA.ListaPrecio.ModificarEstadoListaPrecio;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.ListaPrecio.ModificarEstadoListaPrecio
{
    public class ModificarEstadoListaPrecioDA : IModificarEstadoListaPrecioDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;

        public ModificarEstadoListaPrecioDA(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }

        public async Task<int> ModificarEstadoListaPrecio(int noLista, bool activo)
        {
            await using IDbContextTransaction transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();
            try
            {
                ListaPrecioAD? listaExistente = await _contextoBasedeDatos.ListaPrecioContexto.FindAsync(noLista);

                if (listaExistente == null)
                {
                    return 0;
                }

                listaExistente.Activo = activo;
                _contextoBasedeDatos.ListaPrecioContexto.Update(listaExistente);
                int resultadoRegistro = await _contextoBasedeDatos.SaveChangesAsync();
                await transaction.CommitAsync();
                return resultadoRegistro;
            }
            catch (DbUpdateException dbEx)
            {
                await transaction.RollbackAsync();
                _contextoBasedeDatos.ChangeTracker.Clear();
                throw new Exception("Ocurrió un error al modificar el estado de la lista de precios en la base de datos.", dbEx);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _contextoBasedeDatos.ChangeTracker.Clear();
                throw new Exception("Ocurrió un error al modificar el estado de la lista de precios.", ex);
            }
        }
    }
}
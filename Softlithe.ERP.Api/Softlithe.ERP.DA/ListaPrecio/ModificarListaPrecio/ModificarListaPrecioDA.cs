using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.ListaPrecio;
using Softlithe.ERP.Abstracciones.DA.ListaPrecio.ModificarListaPrecio;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.ListaPrecio.ModificarListaPrecio
{
    public class ModificarListaPrecioDA : IModificarListaPrecioDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;

        public ModificarListaPrecioDA(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }

        public async Task<int> ModificarListaPrecio(ListaPrecioDto laListaPrecio)
        {
            if (laListaPrecio == null) throw new ArgumentNullException(nameof(laListaPrecio));
            await using IDbContextTransaction transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();
            try
            {
                ListaPrecioAD? ListaExistente = await _contextoBasedeDatos.ListaPrecioContexto.FindAsync(laListaPrecio.no_lista);

                if (ListaExistente == null)
                {
                    return 0;
                }
                ListaExistente.Descripcion = laListaPrecio.descripcion;
                ListaExistente.Activo = laListaPrecio.Activo;// aca se le manda el estado en caso de que este camnbie a inactivo o activo
                _contextoBasedeDatos.ListaPrecioContexto.Update(ListaExistente);
                int resultadoRegistro = await _contextoBasedeDatos.SaveChangesAsync();
                await transaction.CommitAsync();
                return resultadoRegistro;
            }
            catch (DbUpdateException dbEx)
            {
                await transaction.RollbackAsync();
                _contextoBasedeDatos.ChangeTracker.Clear();
                throw new Exception("Ocurrió un error al modificar la lista de precios en la base de datos.", dbEx);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // Preservar la excepción original como InnerException
                _contextoBasedeDatos.ChangeTracker.Clear();
                throw new Exception("Ocurrió un error al modificar la lista de precios.", ex);
            }

        }
    }
}

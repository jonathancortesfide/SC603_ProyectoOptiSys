using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Marcas;
using Softlithe.ERP.Abstracciones.DA.Marcas;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Marcas
{
    public class ModificarMarcaDA : IModificarMarcaDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;
        public ModificarMarcaDA(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }
        public async Task<int> ModificarMarca(MarcaDto elMarca)
        {
            if (elMarca == null) throw new ArgumentNullException(nameof(elMarca));
            await using IDbContextTransaction transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();
            try
            {
                Marca? marcaExistente = await _contextoBasedeDatos.Marcas.FindAsync(elMarca.NoMarca);

                if (marcaExistente == null)
                {
                    return 0;
                }
                marcaExistente.EsActivo = elMarca.EsActivo;
                marcaExistente.Descripcion = elMarca.Descripcion;

                _contextoBasedeDatos.Marcas.Update(marcaExistente);
                int resultadoRegistro = await _contextoBasedeDatos.SaveChangesAsync();
                await transaction.CommitAsync();

                return resultadoRegistro;
            }
            catch (DbUpdateException dbEx)
            {
                await transaction.RollbackAsync();
                _contextoBasedeDatos.ChangeTracker.Clear();
                throw new Exception("Ocurrió un error al modificar la marca en la base de datos.", dbEx);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // Preservar la excepción original como InnerException
                _contextoBasedeDatos.ChangeTracker.Clear();
                throw new Exception("Ocurrió un error al modificar la marca.", ex);
            }
        }
    }
}

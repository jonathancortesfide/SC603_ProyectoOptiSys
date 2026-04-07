using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Marcas;
using Softlithe.ERP.Abstracciones.DA.Marcas;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Marcas
{
    public class AgregarMarcaDA : IAgregarMarcaDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;
        public AgregarMarcaDA(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }
        public async Task<int> AgregarMarca(MarcaDto elMarca)
        {
            if (elMarca == null) throw new ArgumentNullException(nameof(elMarca));

            // Declarar la variable transaction fuera del bloque try para que esté disponible en catch
            await using IDbContextTransaction transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();

            try
            {
                Marca marca = new Marca
                {
                    NoEmpresa = elMarca.NoEmpresa,
                    Descripcion = elMarca.Descripcion
                };

                await _contextoBasedeDatos.Marcas.AddAsync(marca);
                int resultadoRegistro = await _contextoBasedeDatos.SaveChangesAsync();
                await transaction.CommitAsync();

                return resultadoRegistro;
            }
            catch (DbUpdateException dbEx)
            {
				await transaction.RollbackAsync();
				_contextoBasedeDatos.ChangeTracker.Clear();
				throw new Exception("Ocurrió un error al guardar la marca en la base de datos.", dbEx);
            }
            catch (Exception ex)
            {
				await transaction.RollbackAsync();
				// Preservar la excepción original como InnerException
				_contextoBasedeDatos.ChangeTracker.Clear();
				throw new Exception("Ocurrió un error al guardar la marca.", ex);
            }
        }
    }
}

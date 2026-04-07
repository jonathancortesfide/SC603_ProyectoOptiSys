using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;
using Softlithe.ERP.Abstracciones.DA.Monedas.BorrarMoneda;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Monedas.BorrarMoneda
{
	public class BorrarMonedasDA : IBorrarMonedasDA
	{
		private readonly ContextoBasedeDatos _contextoBasedeDatos;

		public BorrarMonedasDA(ContextoBasedeDatos contextoBasedeDatos)
		{
			_contextoBasedeDatos = contextoBasedeDatos;
		}

		public async Task<int> BorrarMoneda(MonedaDto laMoneda)
		{
			if (laMoneda == null) throw new ArgumentNullException(nameof(laMoneda));

			await using IDbContextTransaction transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();

			try
			{
				// Buscar el registro en MonedaSucursal
				MonedaSucursal? monedasucursal = await _contextoBasedeDatos.MonedasSucursal
					.FirstOrDefaultAsync(ms => ms.numeroDeMoneda == laMoneda.numeroDeMoneda && 
											   ms.identificador == laMoneda.identificador);

				if (monedasucursal == null)
				{
					return 0; // No encontrado
				}

				_contextoBasedeDatos.MonedasSucursal.Remove(monedasucursal);
				int resultadoRegistro = await _contextoBasedeDatos.SaveChangesAsync();
				await transaction.CommitAsync();

				return resultadoRegistro;
			}
			catch (DbUpdateException dbEx)
			{
				await transaction.RollbackAsync();
				_contextoBasedeDatos.ChangeTracker.Clear();

				// Retornar -1 para indicar que hay referencias en otras tablas
				if (dbEx.InnerException?.Message.Contains("FOREIGN KEY") == true || 
					dbEx.InnerException?.Message.Contains("constraint") == true)
				{
					return -1; // Código especial: tiene referencias
				}

				throw new Exception("Ocurrió un error al eliminar la moneda en la base de datos.", dbEx);
			}
			catch (Exception ex)
			{
				await transaction.RollbackAsync();
				_contextoBasedeDatos.ChangeTracker.Clear();
				throw new Exception("Ocurrió un error al eliminar la moneda.", ex);
			}
		}
	}
}

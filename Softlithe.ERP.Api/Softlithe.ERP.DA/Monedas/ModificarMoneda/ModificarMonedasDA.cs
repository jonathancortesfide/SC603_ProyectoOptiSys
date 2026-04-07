using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;
using Softlithe.ERP.Abstracciones.DA.Monedas.ModificarMoneda;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Monedas.ModificarMoneda
{
	public class ModificarMonedasDA : IModificarMonedasDA
	{
		private readonly ContextoBasedeDatos _contextoBasedeDatos;

		public ModificarMonedasDA(ContextoBasedeDatos contextoBasedeDatos)
		{
			_contextoBasedeDatos = contextoBasedeDatos;
		}

		public async Task<int> ModificarMoneda(MonedaDto laMoneda)
		{
			if (laMoneda == null) throw new ArgumentNullException(nameof(laMoneda));

			await using IDbContextTransaction transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();

			try
			{
				Moneda? monedaExistente = await _contextoBasedeDatos.Monedas.FirstOrDefaultAsync(m => m.numeroDeMoneda == laMoneda.numeroDeMoneda);

				if (monedaExistente == null)
				{
					return 0;
				}

				monedaExistente.descripcion = laMoneda.descripcion;
				monedaExistente.signo = laMoneda.signo;
				monedaExistente.url = laMoneda.url;

				_contextoBasedeDatos.Monedas.Update(monedaExistente);
				int resultadoRegistro = await _contextoBasedeDatos.SaveChangesAsync();
				await transaction.CommitAsync();

				return resultadoRegistro;
			}
			catch (DbUpdateException dbEx)
			{
				await transaction.RollbackAsync();
				_contextoBasedeDatos.ChangeTracker.Clear();
				throw new Exception("Ocurrió un error al modificar la moneda en la base de datos.", dbEx);
			}
			catch (Exception ex)
			{
				await transaction.RollbackAsync();
				_contextoBasedeDatos.ChangeTracker.Clear();
				throw new Exception("Ocurrió un error al modificar la moneda.", ex);
			}
		}
	}
}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;
using Softlithe.ERP.Abstracciones.DA.Monedas.AgregarMoneda;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Monedas.AgregarMoneda
{
	public class AgregarMonedasDA : IAgregarMonedasDA
	{
		private readonly ContextoBasedeDatos _contextoBasedeDatos;

		public AgregarMonedasDA(ContextoBasedeDatos contextoBasedeDatos)
		{
			_contextoBasedeDatos = contextoBasedeDatos;
		}

		public async Task<AgregarMonedaResponseDto> AgregarMoneda(MonedaDto laMoneda)
		{
			if (laMoneda == null) throw new ArgumentNullException(nameof(laMoneda));

			await using IDbContextTransaction transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();

			try
			{
				// Validar que la moneda existe en la tabla Moneda
				Moneda? monedaExistente = await _contextoBasedeDatos.Monedas
					.FirstOrDefaultAsync(m => m.numeroDeMoneda == laMoneda.numeroDeMoneda);

				if (monedaExistente == null)
				{
					throw new Exception($"La moneda con no_moneda {laMoneda.numeroDeMoneda} no existe.");
				}

				// Crear registro en MonedaSucursal
				MonedaSucursal monedasucursal = new MonedaSucursal
				{
					numeroDeMoneda = laMoneda.numeroDeMoneda,
					identificador = laMoneda.identificador
				};

				await _contextoBasedeDatos.MonedasSucursal.AddAsync(monedasucursal);
				int resultadoRegistro = await _contextoBasedeDatos.SaveChangesAsync();
				await transaction.CommitAsync();

				return new AgregarMonedaResponseDto
				{
					RegistrosActualizados = resultadoRegistro,
					Identificador = laMoneda.identificador,
					Descripcion = monedaExistente.descripcion
				};
			}
			catch (DbUpdateException dbEx)
			{
				await transaction.RollbackAsync();
				_contextoBasedeDatos.ChangeTracker.Clear();
				throw new Exception("Ocurrió un error al guardar la moneda en la base de datos.", dbEx);
			}
			catch (Exception ex)
			{
				await transaction.RollbackAsync();
				_contextoBasedeDatos.ChangeTracker.Clear();
				throw new Exception("Ocurrió un error al guardar la moneda.", ex);
			}
		}
	}
}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;
using Softlithe.ERP.Abstracciones.DA.Monedas.CambiarEstado;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Monedas.CambiarEstado
{
	public class CambiarEstadoMonedaDA : ICambiarEstadoMonedaDA
	{
		private readonly ContextoBasedeDatos _contextoBasedeDatos;

		public CambiarEstadoMonedaDA(ContextoBasedeDatos contextoBasedeDatos)
		{
			_contextoBasedeDatos = contextoBasedeDatos;
		}

		public async Task<CambiarEstadoMonedaResponseDto> CambiarEstado(int idMoneda, CambiarEstadoMonedaDto cambiarEstadoMonedaDto)
		{
			if (cambiarEstadoMonedaDto == null) throw new ArgumentNullException(nameof(cambiarEstadoMonedaDto));

			await using IDbContextTransaction transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();

			try
			{
				MonedaSucursal? monedaSucursalExistente = await _contextoBasedeDatos.MonedasSucursal
					.Include(m => m.Moneda)
					.FirstOrDefaultAsync(m => m.idMoneda == idMoneda);

				if (monedaSucursalExistente == null)
				{
					return new CambiarEstadoMonedaResponseDto
					{
						RegistrosActualizados = 0,
						Identificador = 0,
						Descripcion = string.Empty,
						Activo = false
					};
				}

				monedaSucursalExistente.activo = cambiarEstadoMonedaDto.activo;

				_contextoBasedeDatos.MonedasSucursal.Update(monedaSucursalExistente);
				int resultadoRegistro = await _contextoBasedeDatos.SaveChangesAsync();
				await transaction.CommitAsync();

				return new CambiarEstadoMonedaResponseDto
				{
					RegistrosActualizados = resultadoRegistro,
					Identificador = monedaSucursalExistente.identificador,
					Descripcion = monedaSucursalExistente.Moneda?.descripcion ?? string.Empty,
					Activo = cambiarEstadoMonedaDto.activo
				};
			}
			catch (DbUpdateException dbEx)
			{
				await transaction.RollbackAsync();
				_contextoBasedeDatos.ChangeTracker.Clear();
				throw new Exception("Ocurrió un error al cambiar el estado de la moneda en la base de datos.", dbEx);
			}
			catch (Exception ex)
			{
				await transaction.RollbackAsync();
				_contextoBasedeDatos.ChangeTracker.Clear();
				throw new Exception("Ocurrió un error al cambiar el estado de la moneda.", ex);
			}
		}
	}
}

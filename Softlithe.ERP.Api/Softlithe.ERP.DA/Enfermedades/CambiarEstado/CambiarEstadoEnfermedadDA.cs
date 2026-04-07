using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.CambiarEstado;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Enfermedades.CambiarEstado
{
	public class CambiarEstadoEnfermedadDA : ICambiarEstadoEnfermedadDA
	{
		private readonly ContextoBasedeDatos _contextoBasedeDatos;

		public CambiarEstadoEnfermedadDA(ContextoBasedeDatos contextoBasedeDatos)
		{
			_contextoBasedeDatos = contextoBasedeDatos;
		}

		public async Task<CambiarEstadoEnfermedadResponseDto> CambiarEstado(int numeroEnfermedad, CambiarEstadoEnfermedadDto cambiarEstadoEnfermedadDto)
		{
			if (cambiarEstadoEnfermedadDto == null) throw new ArgumentNullException(nameof(cambiarEstadoEnfermedadDto));

			await using IDbContextTransaction transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();

			try
			{
				EnfermedadSucursal? enfermedadSucursalExistente = await _contextoBasedeDatos.Enfermedades
					.Include(e => e.EnfermedadCatalogo)
					.FirstOrDefaultAsync(e => e.numeroEnfermedad == numeroEnfermedad);

				if (enfermedadSucursalExistente == null)
				{
					return new CambiarEstadoEnfermedadResponseDto
					{
						RegistrosActualizados = 0,
						Identificador = 0,
						Descripcion = string.Empty,
						Activo = false
					};
				}

				enfermedadSucursalExistente.activo = cambiarEstadoEnfermedadDto.activo;

				_contextoBasedeDatos.Enfermedades.Update(enfermedadSucursalExistente);
				int resultadoRegistro = await _contextoBasedeDatos.SaveChangesAsync();
				await transaction.CommitAsync();

				return new CambiarEstadoEnfermedadResponseDto
				{
					RegistrosActualizados = resultadoRegistro,
					Identificador = enfermedadSucursalExistente.identificador,
					Descripcion = enfermedadSucursalExistente.EnfermedadCatalogo?.Descripcion ?? string.Empty,
					Activo = cambiarEstadoEnfermedadDto.activo
				};
			}
			catch (DbUpdateException dbEx)
			{
				await transaction.RollbackAsync();
				_contextoBasedeDatos.ChangeTracker.Clear();
				throw new Exception("Ocurrió un error al cambiar el estado de la enfermedad en la base de datos.", dbEx);
			}
			catch (Exception ex)
			{
				await transaction.RollbackAsync();
				_contextoBasedeDatos.ChangeTracker.Clear();
				throw new Exception("Ocurrió un error al cambiar el estado de la enfermedad.", ex);
			}
		}
	}
}

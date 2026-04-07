using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.ObtenerEnfermedadPorIdentificador;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Enfermedades.ObtenerEnfermedadPorIdentificador
{
	public class ObtenerEnfermedadPorIdentificadorDA : IObtenerEnfermedadPorIdentificadorDA
	{
		private readonly ContextoBasedeDatos _contextoBasedeDatos;

		public ObtenerEnfermedadPorIdentificadorDA(ContextoBasedeDatos contextoBasedeDatos)
		{
			_contextoBasedeDatos = contextoBasedeDatos;
		}

		public async Task<List<EnfermedadResponseDto>> ObtenerEnfermedadPorIdentificador(int identificador)
		{
			try
			{
				List<EnfermedadResponseDto> enfermedades = await _contextoBasedeDatos.Enfermedades
					.Where(e => e.identificador == identificador)
					.Include(e => e.EnfermedadCatalogo)
					.ThenInclude(ec => ec.EnfermedadTipo)
					.Select(e => new EnfermedadResponseDto
					{
						numeroEnfermedad = e.numeroEnfermedad,
						identificador = e.identificador,
						idEnfermedad = e.idEnfermedad,
						descripcion = e.EnfermedadCatalogo != null ? e.EnfermedadCatalogo.Descripcion : string.Empty,
						tipoEnfermedad = e.EnfermedadCatalogo != null && e.EnfermedadCatalogo.EnfermedadTipo != null
							? e.EnfermedadCatalogo.EnfermedadTipo.Nombre
							: string.Empty,
						activo = e.activo
					})
					.ToListAsync();

				return enfermedades;
			}
			catch (Exception ex)
			{
				throw new Exception("Ocurrió un error al obtener las enfermedades por identificador de la base de datos.", ex);
			}
		}
	}
}

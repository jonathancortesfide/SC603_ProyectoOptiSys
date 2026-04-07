using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.ObtenerTodasLasEnfermedades;
using Softlithe.ERP.DA.Modelos;
using System.Collections.Generic;

namespace Softlithe.ERP.DA.Enfermedades.ObtenerTodasLasEnfermedades
{
	public class ObtenerTodasLasEnfermedadesDA : IObtenerTodasLasEnfermedadesDA
	{
		private readonly ContextoBasedeDatos _contextoBasedeDatos;

		public ObtenerTodasLasEnfermedadesDA(ContextoBasedeDatos contextoBasedeDatos)
		{
			_contextoBasedeDatos = contextoBasedeDatos;
		}

		public async Task<List<EnfermedadResponseDto>> ObtenerTodasLasEnfermedades()
		{
			try
			{
				List<EnfermedadResponseDto> enfermedades = await _contextoBasedeDatos.Enfermedades
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
				throw new Exception("Ocurrió un error al obtener las enfermedades de la base de datos.", ex);
			}
		}
	}
}

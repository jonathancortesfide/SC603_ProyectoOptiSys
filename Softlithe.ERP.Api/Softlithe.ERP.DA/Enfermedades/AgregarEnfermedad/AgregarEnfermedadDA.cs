using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.AgregarEnfermedad;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Enfermedades.AgregarEnfermedad
{
	public class AgregarEnfermedadDA : IAgregarEnfermedadDA
	{
		private readonly ContextoBasedeDatos _contextoBasedeDatos;

		public AgregarEnfermedadDA(ContextoBasedeDatos contextoBasedeDatos)
		{
			_contextoBasedeDatos = contextoBasedeDatos;
		}

		public async Task<AgregarEnfermedadResponseDto> AgregarEnfermedad(EnfermedadDto enfermedadDto)
		{
			if (enfermedadDto == null) throw new ArgumentNullException(nameof(enfermedadDto));

			try
			{
				EnfermedadCatalogo? enfermedadCatalogo = await _contextoBasedeDatos.EnfermedadCatalogos
					.FirstOrDefaultAsync(e => e.IdEnfermedad == enfermedadDto.idEnfermedad);

				if (enfermedadCatalogo == null)
				{
					throw new Exception("El catálogo de enfermedad especificado no existe.");
				}

				EnfermedadSucursal nuevaEnfermedad = new EnfermedadSucursal
				{
					identificador = enfermedadDto.identificador,
					idEnfermedad = enfermedadDto.idEnfermedad
				};

				_contextoBasedeDatos.Enfermedades.Add(nuevaEnfermedad);
				int resultado = await _contextoBasedeDatos.SaveChangesAsync();

				return new AgregarEnfermedadResponseDto
				{
					RegistrosActualizados = resultado,
					Identificador = enfermedadDto.identificador,
					Descripcion = enfermedadCatalogo.Descripcion
				};
			}
			catch (Exception ex)
			{
				throw new Exception("Ocurrió un error al agregar la enfermedad en la base de datos.", ex);
			}
		}
	}
}


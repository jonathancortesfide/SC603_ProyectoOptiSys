using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;

namespace Softlithe.ERP.Abstracciones.DA.Enfermedades.ObtenerTodasLasEnfermedades
{
	public interface IObtenerTodasLasEnfermedadesDA
	{
		Task<List<EnfermedadResponseDto>> ObtenerTodasLasEnfermedades();
	}
}

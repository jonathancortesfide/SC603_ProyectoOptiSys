using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;

namespace Softlithe.ERP.Abstracciones.DA.Enfermedades.ObtenerEnfermedadPorIdentificador
{
	public interface IObtenerEnfermedadPorIdentificadorDA
	{
		Task<List<EnfermedadResponseDto>> ObtenerEnfermedadPorIdentificador(int identificador);
	}
}

using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;

namespace Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerEnfermedadPorIdentificador
{
	public interface IObtenerEnfermedadPorIdentificadorBW
	{
		Task<EnfermedadConModeloDeValidacionResponse> ObtenerEnfermedadPorIdentificador(int identificador);
	}
}

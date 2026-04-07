using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;

namespace Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerTodasLasEnfermedades
{
	public interface IObtenerTodasLasEnfermedadesBW
	{
		Task<EnfermedadConModeloDeValidacionResponse> ObtenerTodasLasEnfermedades();
	}
}

using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;

namespace Softlithe.ERP.Abstracciones.DA.Enfermedades.CambiarEstado
{
	public interface ICambiarEstadoEnfermedadDA
	{
		Task<CambiarEstadoEnfermedadResponseDto> CambiarEstado(int numeroEnfermedad, CambiarEstadoEnfermedadDto cambiarEstadoEnfermedadDto);
	}
}

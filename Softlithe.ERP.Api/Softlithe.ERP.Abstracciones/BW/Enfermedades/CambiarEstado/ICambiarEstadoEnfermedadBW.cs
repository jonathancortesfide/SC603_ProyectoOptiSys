using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;

namespace Softlithe.ERP.Abstracciones.BW.Enfermedades.CambiarEstado
{
	public interface ICambiarEstadoEnfermedadBW
	{
		Task<ModeloValidacion> CambiarEstado(int numeroEnfermedad, CambiarEstadoEnfermedadDto cambiarEstadoEnfermedadDto);
	}
}

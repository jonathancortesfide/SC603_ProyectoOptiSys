using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;

namespace Softlithe.ERP.Abstracciones.BW.Enfermedades.AgregarEnfermedad
{
	public interface IAgregarEnfermedadBW
	{
		Task<ModeloValidacion> AgregarEnfermedad(EnfermedadDto enfermedadDto);
	}
}

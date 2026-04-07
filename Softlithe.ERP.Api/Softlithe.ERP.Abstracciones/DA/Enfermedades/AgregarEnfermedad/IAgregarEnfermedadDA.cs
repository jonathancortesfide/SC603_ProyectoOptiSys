using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;

namespace Softlithe.ERP.Abstracciones.DA.Enfermedades.AgregarEnfermedad
{
	public interface IAgregarEnfermedadDA
	{
		Task<AgregarEnfermedadResponseDto> AgregarEnfermedad(EnfermedadDto enfermedadDto);
	}
}

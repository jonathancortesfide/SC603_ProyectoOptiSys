using Softlithe.ERP.Abstracciones.Contenedores;

namespace Softlithe.ERP.Abstracciones.Contenedores.Enfermedades
{
	public class EnfermedadConModeloDeValidacionResponse
	{
		public List<EnfermedadResponseDto> datos { get; set; } = new List<EnfermedadResponseDto>();
		public ModeloValidacion modeloValidacion { get; set; } = new ModeloValidacion { Mensaje = "Operación completada.", EsCorrecto = true };
	}
}

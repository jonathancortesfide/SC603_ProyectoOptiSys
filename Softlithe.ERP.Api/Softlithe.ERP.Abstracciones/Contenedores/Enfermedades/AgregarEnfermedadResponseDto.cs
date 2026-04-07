namespace Softlithe.ERP.Abstracciones.Contenedores.Enfermedades
{
	public class AgregarEnfermedadResponseDto
	{
		public int RegistrosActualizados { get; set; }
		public int Identificador { get; set; }
		public string Descripcion { get; set; } = string.Empty;
	}
}

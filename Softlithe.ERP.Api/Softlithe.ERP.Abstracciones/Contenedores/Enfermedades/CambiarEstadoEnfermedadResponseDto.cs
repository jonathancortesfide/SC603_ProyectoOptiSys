namespace Softlithe.ERP.Abstracciones.Contenedores.Enfermedades
{
	public class CambiarEstadoEnfermedadResponseDto
	{
		public int RegistrosActualizados { get; set; }
		public int Identificador { get; set; }
		public string Descripcion { get; set; } = string.Empty;
		public bool Activo { get; set; }
	}
}

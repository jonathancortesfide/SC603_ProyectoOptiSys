namespace Softlithe.ERP.Abstracciones.Contenedores.Enfermedades
{
	public class EnfermedadResponseDto
	{
		public int numeroEnfermedad { get; set; }
		public int identificador { get; set; }
		public int idEnfermedad { get; set; }
		public string descripcion { get; set; } = string.Empty;
		public string tipoEnfermedad { get; set; } = string.Empty;
		public bool activo { get; set; }
	}
}

namespace Softlithe.ERP.Abstracciones.Contenedores.Monedas
{
	public class MonedaResponseDto
	{
		public int idMoneda { get; set; }
		public int numeroDeMoneda { get; set; }
		public string descripcion { get; set; } = string.Empty;
		public string signo { get; set; } = string.Empty;
		public int identificador { get; set; }
		public string url { get; set; } = string.Empty;
		public bool activo { get; set; }
	}

	public class MonedaConModeloDeValidacionResponse : ModeloValidacion
	{
		public List<MonedaResponseDto> laListaDeMonedas { get; set; } = new List<MonedaResponseDto>();
	}
}

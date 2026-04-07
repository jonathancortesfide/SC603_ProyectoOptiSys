namespace Softlithe.ERP.Abstracciones.Contenedores.Monedas
{
	public class AgregarMonedaResponseDto
	{
		public int RegistrosActualizados { get; set; }
		public int Identificador { get; set; }
		public string Descripcion { get; set; } = string.Empty;
	}
}

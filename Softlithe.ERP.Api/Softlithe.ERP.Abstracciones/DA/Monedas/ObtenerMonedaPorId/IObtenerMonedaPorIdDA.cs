using Softlithe.ERP.Abstracciones.Contenedores.Monedas;

namespace Softlithe.ERP.Abstracciones.DA.Monedas.ObtenerMonedaPorId
{
	public interface IObtenerMonedaPorIdDA
	{
		Task<MonedaResponseDto?> ObtenerMonedaPorId(int idMoneda);
	}
}

using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;

namespace Softlithe.ERP.Abstracciones.BW.Monedas.ObtenerMonedaPorId
{
	public interface IObtenerMonedaPorIdBW
	{
		Task<ModeloValidacionConDatos<MonedaResponseDto?>> ObtenerMonedaPorId(int idMoneda);
	}
}

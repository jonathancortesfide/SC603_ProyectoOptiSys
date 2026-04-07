using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;

namespace Softlithe.ERP.Abstracciones.BW.Monedas.CambiarEstado
{
	public interface ICambiarEstadoMonedaBW
	{
		Task<ModeloValidacion> CambiarEstado(int idMoneda, CambiarEstadoMonedaDto cambiarEstadoMonedaDto);
	}
}

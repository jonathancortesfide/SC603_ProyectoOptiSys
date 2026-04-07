using Softlithe.ERP.Abstracciones.Contenedores.Monedas;

namespace Softlithe.ERP.Abstracciones.DA.Monedas.CambiarEstado
{
	public interface ICambiarEstadoMonedaDA
	{
		Task<CambiarEstadoMonedaResponseDto> CambiarEstado(int idMoneda, CambiarEstadoMonedaDto cambiarEstadoMonedaDto);
	}
}

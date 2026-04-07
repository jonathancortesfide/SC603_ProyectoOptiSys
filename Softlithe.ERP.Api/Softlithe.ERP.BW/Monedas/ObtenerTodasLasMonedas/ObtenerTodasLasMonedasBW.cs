using Softlithe.ERP.Abstracciones.BW.Monedas.ObtenerTodasLasMonedas;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;
using Softlithe.ERP.Abstracciones.DA.Monedas.ObtenerTodasLasMonedas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Monedas.ObtenerTodasLasMonedas
{
	public class ObtenerTodasLasMonedasBW: IObtenerTodasLasMonedasBW
	{
		private readonly IObtenerTodasLasMonedasAD _obtenerTodasLasMonedasAD;

		public ObtenerTodasLasMonedasBW(IObtenerTodasLasMonedasAD obtenerTodasLasMonedasAD)
		{
			_obtenerTodasLasMonedasAD = obtenerTodasLasMonedasAD;
		}

		public async Task<MonedaConModeloDeValidacionResponse> Obtener()
		{
			try
			{
				List<MonedaResponseDto> laListaDeMonedas = await _obtenerTodasLasMonedasAD.Obtener();
				return ConstruirRespuestaExitosa(laListaDeMonedas);

			} catch (Exception ex) {
				return ConstruirRespuestaExitosa(null);
			}
		}
		private MonedaConModeloDeValidacionResponse ConstruirRespuestaExitosa(List<MonedaResponseDto>? laListaDeMonedas)
		{
			return new MonedaConModeloDeValidacionResponse
			{
				laListaDeMonedas = laListaDeMonedas,
				Mensaje = laListaDeMonedas == null ? MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema:MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
				EsCorrecto = laListaDeMonedas == null ? false : true,
			};
		}

		private void LimpiarEspaciosEnBlanco(List<MonedaResponseDto>? laListaDeMonedas)
		{
			if (laListaDeMonedas == null) return;

			foreach (var moneda in laListaDeMonedas)
			{
				moneda.descripcion = moneda.descripcion?.Trim();
				moneda.signo = moneda.signo?.Trim();
				moneda.url = moneda.url?.Trim();
			}
		}
	}
}

using Softlithe.ERP.Abstracciones.BW.Monedas.ObtenerMonedasPorIdentificador;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Monedas.ObtenerMonedasPorIdentificador;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Monedas.ObtenerMonedasPorIdentificador
{
	public class ObtenerMonedasPorIdentificadorBW : IObtenerMonedasPorIdentificadorBW
	{
		private readonly IObtenerMonedasPorIdentificadorDA _obtenerMonedasPorIdentificadorDA;

		public ObtenerMonedasPorIdentificadorBW(IObtenerMonedasPorIdentificadorDA obtenerMonedasPorIdentificadorDA)
		{
			_obtenerMonedasPorIdentificadorDA = obtenerMonedasPorIdentificadorDA;
		}

		public async Task<MonedaConModeloDeValidacionResponse> ObtenerMonedasPorIdentificador(int identificador)
		{
			try
			{
				if (identificador <= 0)
				{
					return ConstruirRespuestaError("El identificador debe ser mayor a cero.");
				}

				List<MonedaResponseDto> laListaDeMonedas = await _obtenerMonedasPorIdentificadorDA.ObtenerMonedasPorIdentificador(identificador);
				LimpiarEspaciosEnBlanco(laListaDeMonedas);
				return ConstruirRespuestaExitosa(laListaDeMonedas);

			}
			catch (Exception ex)
			{
				return ConstruirRespuestaError("Ocurrió un error al obtener las monedas: " + ex.Message);
			}
		}

		private MonedaConModeloDeValidacionResponse ConstruirRespuestaExitosa(List<MonedaResponseDto>? laListaDeMonedas)
		{
			bool tieneResultados = laListaDeMonedas != null && laListaDeMonedas.Count > 0;
			return new MonedaConModeloDeValidacionResponse
			{
				laListaDeMonedas = laListaDeMonedas ?? new List<MonedaResponseDto>(),
				Mensaje = tieneResultados ? MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta : "No se encontraron monedas para el identificador especificado.",
				EsCorrecto = tieneResultados,
			};
		}

		private MonedaConModeloDeValidacionResponse ConstruirRespuestaError(string mensaje)
		{
			return new MonedaConModeloDeValidacionResponse
			{
				laListaDeMonedas = new List<MonedaResponseDto>(),
				Mensaje = mensaje,
				EsCorrecto = false,
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

using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;
using Softlithe.ERP.Abstracciones.DA.Monedas.ObtenerTodasLasMonedas;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Monedas.ObtenerTodasLasMonedas
{
	public class ObtenerTodasLasMonedasAD: IObtenerTodasLasMonedasAD
	{

		private readonly ContextoBasedeDatos _contextoBasedeDatos;
		public ObtenerTodasLasMonedasAD(ContextoBasedeDatos contextoBasedeDatos)
		{
			_contextoBasedeDatos = contextoBasedeDatos;
		}

		public async Task<List<MonedaResponseDto>> Obtener()
		{
			try
			{
				List<MonedaResponseDto> laListaDeMonedas = await (from monedas in _contextoBasedeDatos.Monedas
														  select new MonedaResponseDto
														  {
															  idMoneda = 0,
															  descripcion = monedas.descripcion,
															  signo = monedas.signo,
															  identificador = 0,
															  numeroDeMoneda = monedas.numeroDeMoneda,
															  url = monedas.url,
															  activo = false
														  }).ToListAsync();
				return laListaDeMonedas;
			}
			catch (Exception ex)
			{
				throw new Exception("Ocurrió un error al obtener las monedas: " + ex.Message + ". StackTrace: " + ex.StackTrace+ ". Mensaje Inner Exception: " + ex.InnerException?.Message);
			}
		}

	}
}

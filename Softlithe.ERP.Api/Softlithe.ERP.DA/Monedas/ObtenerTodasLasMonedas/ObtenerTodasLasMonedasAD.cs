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
				List<MonedaResponseDto> laListaDeMonedas = await (
					from ms in _contextoBasedeDatos.MonedasSucursal
					join m in _contextoBasedeDatos.Monedas
						on ms.numeroDeMoneda equals m.numeroDeMoneda
					select new MonedaResponseDto
					{
						idMoneda = ms.idMoneda,
						descripcion = m.descripcion,
						signo = m.signo,
						identificador = ms.identificador,
						numeroDeMoneda = m.numeroDeMoneda,
						url = m.url,
						activo = ms.activo
					}
				).ToListAsync();

				return laListaDeMonedas;
			}
			catch (Exception ex)
			{
				throw new Exception("Ocurrió un error al obtener las monedas: " + ex.Message + ". StackTrace: " + ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.Message);
			}
		}

	}
}

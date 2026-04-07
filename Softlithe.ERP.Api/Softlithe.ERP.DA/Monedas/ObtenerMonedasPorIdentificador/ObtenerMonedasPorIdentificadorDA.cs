using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;
using Softlithe.ERP.Abstracciones.DA.Monedas.ObtenerMonedasPorIdentificador;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Monedas.ObtenerMonedasPorIdentificador
{
	public class ObtenerMonedasPorIdentificadorDA : IObtenerMonedasPorIdentificadorDA
	{
		private readonly ContextoBasedeDatos _contextoBasedeDatos;

		public ObtenerMonedasPorIdentificadorDA(ContextoBasedeDatos contextoBasedeDatos)
		{
			_contextoBasedeDatos = contextoBasedeDatos;
		}

		public async Task<List<MonedaResponseDto>> ObtenerMonedasPorIdentificador(int identificador)
		{
			try
			{
				List<MonedaResponseDto> laListaDeMonedas = await (from monedasSucursal in _contextoBasedeDatos.MonedasSucursal
														  join monedas in _contextoBasedeDatos.Monedas
														  on monedasSucursal.numeroDeMoneda equals monedas.numeroDeMoneda
														  where monedasSucursal.identificador == identificador
														  select new MonedaResponseDto
														  {
															  idMoneda = monedasSucursal.idMoneda,
															  descripcion = monedas.descripcion,
															  signo = monedas.signo,
															  identificador = monedasSucursal.identificador,
															  numeroDeMoneda = monedas.numeroDeMoneda,
															  url = monedas.url,
															  activo = monedasSucursal.activo
														  }).ToListAsync();
				return laListaDeMonedas;
			}
			catch (Exception ex)
			{
				throw new Exception("Ocurrió un error al obtener las monedas por identificador: " + ex.Message + ". StackTrace: " + ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.Message);
			}
		}
	}
}

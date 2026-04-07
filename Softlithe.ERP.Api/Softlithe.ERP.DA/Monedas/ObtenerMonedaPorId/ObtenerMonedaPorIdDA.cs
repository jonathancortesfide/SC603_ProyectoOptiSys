using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;
using Softlithe.ERP.Abstracciones.DA.Monedas.ObtenerMonedaPorId;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Monedas.ObtenerMonedaPorId
{
	public class ObtenerMonedaPorIdDA : IObtenerMonedaPorIdDA
	{
		private readonly ContextoBasedeDatos _contextoBasedeDatos;

		public ObtenerMonedaPorIdDA(ContextoBasedeDatos contextoBasedeDatos)
		{
			_contextoBasedeDatos = contextoBasedeDatos;
		}

		public async Task<MonedaResponseDto?> ObtenerMonedaPorId(int idMoneda)
		{
			try
			{
				MonedaResponseDto? laMoneda = await (from monedasSucursal in _contextoBasedeDatos.MonedasSucursal
											 join monedas in _contextoBasedeDatos.Monedas
											 on monedasSucursal.numeroDeMoneda equals monedas.numeroDeMoneda
											 where monedasSucursal.idMoneda == idMoneda
											 select new MonedaResponseDto
											 {
												 idMoneda = monedasSucursal.idMoneda,
												 descripcion = monedas.descripcion,
												 signo = monedas.signo,
												 identificador = monedasSucursal.identificador,
												 numeroDeMoneda = monedas.numeroDeMoneda,
												 url = monedas.url,
												 activo = monedasSucursal.activo
											 }).FirstOrDefaultAsync();
				return laMoneda;
			}
			catch (Exception ex)
			{
				throw new Exception("Ocurrió un error al obtener la moneda por ID: " + ex.Message + ". StackTrace: " + ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.Message);
			}
		}
	}
}

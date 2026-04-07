using Softlithe.ERP.Abstracciones.BW.Monedas.AgregarMoneda;
using Softlithe.ERP.Abstracciones.BW.Monedas.BorrarMoneda;
using Softlithe.ERP.Abstracciones.BW.Monedas.CambiarEstado;
using Softlithe.ERP.Abstracciones.BW.Monedas.ModificarMoneda;
using Softlithe.ERP.Abstracciones.BW.Monedas.ObtenerMonedasPorIdentificador;
using Softlithe.ERP.Abstracciones.BW.Monedas.ObtenerMonedaPorId;
using Softlithe.ERP.Abstracciones.BW.Monedas.ObtenerTodasLasMonedas;
using Softlithe.ERP.Abstracciones.DA.Monedas.AgregarMoneda;
using Softlithe.ERP.Abstracciones.DA.Monedas.BorrarMoneda;
using Softlithe.ERP.Abstracciones.DA.Monedas.CambiarEstado;
using Softlithe.ERP.Abstracciones.DA.Monedas.ModificarMoneda;
using Softlithe.ERP.Abstracciones.DA.Monedas.ObtenerMonedasPorIdentificador;
using Softlithe.ERP.Abstracciones.DA.Monedas.ObtenerMonedaPorId;
using Softlithe.ERP.Abstracciones.DA.Monedas.ObtenerTodasLasMonedas;
using Softlithe.ERP.BW.Monedas.AgregarMoneda;
using Softlithe.ERP.BW.Monedas.BorrarMoneda;
using Softlithe.ERP.BW.Monedas.CambiarEstado;
using Softlithe.ERP.BW.Monedas.ModificarMoneda;
using Softlithe.ERP.BW.Monedas.ObtenerMonedasPorIdentificador;
using Softlithe.ERP.BW.Monedas.ObtenerMonedaPorId;
using Softlithe.ERP.BW.Monedas.ObtenerTodasLasMonedas;
using Softlithe.ERP.DA.Monedas.AgregarMoneda;
using Softlithe.ERP.DA.Monedas.BorrarMoneda;
using Softlithe.ERP.DA.Monedas.CambiarEstado;
using Softlithe.ERP.DA.Monedas.ModificarMoneda;
using Softlithe.ERP.DA.Monedas.ObtenerMonedasPorIdentificador;
using Softlithe.ERP.DA.Monedas.ObtenerMonedaPorId;
using Softlithe.ERP.DA.Monedas.ObtenerTodasLasMonedas;

namespace Softlithe.ERP.Api.Inyeccion
{
	internal static class InyeccionDependenciasMonedas
	{
		internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
		{
			//Inyeccion de Obtener Todas las Monedas
			services.AddScoped<IObtenerTodasLasMonedasAD, ObtenerTodasLasMonedasAD>();
			services.AddScoped<IObtenerTodasLasMonedasBW, ObtenerTodasLasMonedasBW>();

			//Inyeccion de Obtener Monedas por Identificador
			services.AddScoped<IObtenerMonedasPorIdentificadorDA, ObtenerMonedasPorIdentificadorDA>();
			services.AddScoped<IObtenerMonedasPorIdentificadorBW, ObtenerMonedasPorIdentificadorBW>();

			//Inyeccion de Obtener Moneda por ID
			services.AddScoped<IObtenerMonedaPorIdDA, ObtenerMonedaPorIdDA>();
			services.AddScoped<IObtenerMonedaPorIdBW, ObtenerMonedaPorIdBW>();

			//Inyeccion de Agregar Monedas
			services.AddScoped<IAgregarMonedasDA, AgregarMonedasDA>();
			services.AddScoped<IAgregarMonedasBW, AgregarMonedasBW>();

			//Inyeccion de Modificar Monedas
			services.AddScoped<IModificarMonedasDA, ModificarMonedasDA>();
			services.AddScoped<IModificarMonedasBW, ModificarMonedasBW>();

			//Inyeccion de Borrar Monedas
			services.AddScoped<IBorrarMonedasDA, BorrarMonedasDA>();
			services.AddScoped<IBorrarMonedasBW, BorrarMonedasBW>();

			//Inyeccion de Cambiar Estado de Moneda
			services.AddScoped<ICambiarEstadoMonedaDA, CambiarEstadoMonedaDA>();
			services.AddScoped<ICambiarEstadoMonedaBW, CambiarEstadoMonedaBW>();

			return services;
		}
	}
}


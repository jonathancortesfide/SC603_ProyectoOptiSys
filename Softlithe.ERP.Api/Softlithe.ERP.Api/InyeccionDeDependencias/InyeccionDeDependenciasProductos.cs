using Softlithe.ERP.Abstracciones.BW.Productos;
using Softlithe.ERP.Abstracciones.DA.Productos;
using Softlithe.ERP.BW.Productos;
using Softlithe.ERP.DA.Productos;

namespace Softlithe.ERP.Api.Inyeccion
{
	internal static class InyeccionDeDependenciasProductos
	{
		internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
		{
			// Inyección de Productos
			services.AddScoped<IProductoDA, ProductoDA>();
			services.AddScoped<IProductoBW, ProductoBW>();

			return services;
		}
	}
}
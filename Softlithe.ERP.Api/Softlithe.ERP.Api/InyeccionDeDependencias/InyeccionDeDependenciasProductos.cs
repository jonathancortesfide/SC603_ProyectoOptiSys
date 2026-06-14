using Softlithe.ERP.Abstracciones.BC.Productos;
using Softlithe.ERP.Abstracciones.BW.Productos;
using Softlithe.ERP.Abstracciones.DA.Productos;
using Softlithe.ERP.BC.Productos;
using Softlithe.ERP.BW.Productos;
using Softlithe.ERP.DA.Productos;

namespace Softlithe.ERP.Api.Inyeccion
{
    internal static class InyeccionDeDependenciasProductos
    {
        internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
        {
            services.AddScoped<IObtenerProductoBW, ObtenerProductoBW>();
            services.AddScoped<IAgregarProductoBW, AgregarProductoBW>();
            services.AddScoped<IModificarProductoBW, ModificarProductoBW>();
            services.AddScoped<IModificarEstadoProductoBW, ModificarEstadoProductoBW>();
            services.AddScoped<IProductoBC, ProductoBC>();
            services.AddScoped<IProductoRepository, ProductoRepository>();

            return services;
        }
    }
}

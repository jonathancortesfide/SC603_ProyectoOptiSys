using Softlithe.ERP.Abstracciones.BW.Marcas;
using Softlithe.ERP.Abstracciones.DA.Marcas;
using Softlithe.ERP.BW.Marcas;
using Softlithe.ERP.DA.Marcas;

namespace Softlithe.ERP.Api.Inyeccion
{
    internal static class InyeccionDeDependenciaMarcas
    {
        internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
        {
            //Inyeccion de Marcas
            services.AddScoped<IObtenerMarcaBW, ObtenerMarcaBW>();
            services.AddScoped<IObtenerMarcaDA, ObtenerMarcaDA>();
            services.AddScoped<IAgregarMarcaDA, AgregarMarcaDA>();
            services.AddScoped<IAgregarMarcaBW, AgregarMarcaBW>();
            services.AddScoped<IModificarMarcaDA, ModificarMarcaDA>();
            services.AddScoped<IModificarMarcaBW, ModificarMarcaBW>();
            services.AddScoped<IModificarEstadoMarcaDA, ModificarEstadoMarcaDA>();
            services.AddScoped<IModificarEstadoMarcaBW, ModificarEstadoMarcaBW>();
            
            return services;
        }
    }
}

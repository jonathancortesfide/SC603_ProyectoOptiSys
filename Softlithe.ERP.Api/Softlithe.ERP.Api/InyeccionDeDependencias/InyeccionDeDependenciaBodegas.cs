using Softlithe.ERP.Abstracciones.BW.Bodegas;
using Softlithe.ERP.Abstracciones.DA.Bodegas;
using Softlithe.ERP.BW.Bodegas;
using Softlithe.ERP.DA.Bodegas;

namespace Softlithe.ERP.Api.Inyeccion;

internal static class InyeccionDeDependenciaBodegas
{
    internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
    {
        services.AddScoped<IObtenerBodegaBW, ObtenerBodegaBW>();
        services.AddScoped<IObtenerBodegaDA, ObtenerBodegaDA>();
        services.AddScoped<IAgregarBodegaBW, AgregarBodegaBW>();
        services.AddScoped<IAgregarBodegaDA, AgregarBodegaDA>();
        services.AddScoped<IModificarBodegaBW, ModificarBodegaBW>();
        services.AddScoped<IModificarBodegaDA, ModificarBodegaDA>();
        services.AddScoped<IModificarEstadoBodegaBW, ModificarEstadoBodegaBW>();
        services.AddScoped<IModificarEstadoBodegaDA, ModificarEstadoBodegaDA>();

        return services;
    }
}

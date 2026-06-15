using Softlithe.ERP.Abstracciones.BW.CajaMovimientos;
using Softlithe.ERP.Abstracciones.BW.Cajas;
using Softlithe.ERP.Abstracciones.DA.CajaMovimientos;
using Softlithe.ERP.Abstracciones.DA.Cajas;
using Softlithe.ERP.BW.CajaMovimientos;
using Softlithe.ERP.BW.Cajas;
using Softlithe.ERP.DA.CajaMovimientos;
using Softlithe.ERP.DA.Cajas;

namespace Softlithe.ERP.Api.Inyeccion;

internal static class InyeccionDeDependenciaCajas
{
    internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
    {
        services.AddScoped<IObtenerCajaBW, ObtenerCajaBW>();
        services.AddScoped<IObtenerCajaDA, ObtenerCajaDA>();
        services.AddScoped<IAgregarCajaBW, AgregarCajaBW>();
        services.AddScoped<IAgregarCajaDA, AgregarCajaDA>();
        services.AddScoped<IModificarCajaBW, ModificarCajaBW>();
        services.AddScoped<IModificarCajaDA, ModificarCajaDA>();
        services.AddScoped<IModificarEstadoCajaBW, ModificarEstadoCajaBW>();
        services.AddScoped<IModificarEstadoCajaDA, ModificarEstadoCajaDA>();

        services.AddScoped<IObtenerCajaMovimientoBW, ObtenerCajaMovimientoBW>();
        services.AddScoped<IObtenerCajaMovimientoDA, ObtenerCajaMovimientoDA>();
        services.AddScoped<IAgregarCajaMovimientoBW, AgregarCajaMovimientoBW>();
        services.AddScoped<IAgregarCajaMovimientoDA, AgregarCajaMovimientoDA>();
        services.AddScoped<IAperturaCajaBW, AperturaCajaBW>();
        services.AddScoped<IAperturaCajaDA, AperturaCajaDA>();

        return services;
    }
}

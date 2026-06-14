using Softlithe.ERP.Abstracciones.BW.Vendedores;
using Softlithe.ERP.Abstracciones.DA.Vendedores;
using Softlithe.ERP.BW.Vendedores;
using Softlithe.ERP.DA.Vendedores;

namespace Softlithe.ERP.Api.Inyeccion;

internal static class InyeccionDeDependenciaVendedores
{
    internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
    {
        services.AddScoped<IObtenerVendedorBW, ObtenerVendedorBW>();
        services.AddScoped<IObtenerVendedorDA, ObtenerVendedorDA>();
        services.AddScoped<IAgregarVendedorBW, AgregarVendedorBW>();
        services.AddScoped<IAgregarVendedorDA, AgregarVendedorDA>();
        services.AddScoped<IModificarVendedorBW, ModificarVendedorBW>();
        services.AddScoped<IModificarVendedorDA, ModificarVendedorDA>();
        services.AddScoped<IModificarEstadoVendedorBW, ModificarEstadoVendedorBW>();
        services.AddScoped<IModificarEstadoVendedorDA, ModificarEstadoVendedorDA>();

        return services;
    }
}

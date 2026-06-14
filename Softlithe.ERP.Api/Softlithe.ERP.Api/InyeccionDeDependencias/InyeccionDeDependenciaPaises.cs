using Softlithe.ERP.Abstracciones.BW.Paises;
using Softlithe.ERP.Abstracciones.DA.Paises;
using Softlithe.ERP.BW.Paises;
using Softlithe.ERP.DA.Paises;

namespace Softlithe.ERP.Api.Inyeccion;

internal static class InyeccionDeDependenciaPaises
{
    internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
    {
        services.AddScoped<IObtenerPaisBW, ObtenerPaisBW>();
        services.AddScoped<IObtenerPaisDA, ObtenerPaisDA>();
        return services;
    }
}

using Softlithe.ERP.Abstracciones.BW.ActividadEconomicaHacienda;
using Softlithe.ERP.Abstracciones.DA.ActividadEconomicaHacienda;
using Softlithe.ERP.BW.ActividadEconomicaHacienda;
using Softlithe.ERP.DA.ActividadEconomicaHacienda;

namespace Softlithe.ERP.Api.Inyeccion
{
    internal static class InyeccionDeDependenciaActividadEconomicaHacienda
    {
        internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
        {
            services.AddScoped<IObtenerActividadEconomicaHaciendaBW, ObtenerActividadEconomicaHaciendaBW>();
            services.AddScoped<IObtenerActividadEconomicaHaciendaDA, ObtenerActividadEconomicaHaciendaDA>();
            return services;
        }
    }
}

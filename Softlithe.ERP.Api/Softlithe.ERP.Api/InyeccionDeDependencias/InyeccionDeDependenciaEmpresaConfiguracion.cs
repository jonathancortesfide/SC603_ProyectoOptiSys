using Softlithe.ERP.Abstracciones.BW.EmpresaConfiguracion;
using Softlithe.ERP.Abstracciones.DA.EmpresaConfiguracion;
using Softlithe.ERP.BW.EmpresaConfiguracion;
using Softlithe.ERP.DA.EmpresaConfiguracion;

namespace Softlithe.ERP.Api.Inyeccion
{
    internal static class InyeccionDeDependenciaEmpresaConfiguracion
    {
        internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
        {
            services.AddScoped<IObtenerEmpresaConfiguracionBW, ObtenerEmpresaConfiguracionBW>();
            services.AddScoped<IObtenerEmpresaConfiguracionDA, ObtenerEmpresaConfiguracionDA>();
            return services;
        }
    }
}

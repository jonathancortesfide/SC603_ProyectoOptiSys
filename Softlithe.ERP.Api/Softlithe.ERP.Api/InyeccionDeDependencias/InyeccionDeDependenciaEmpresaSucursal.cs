using Softlithe.ERP.Abstracciones.BW.EmpresaSucursal;
using Softlithe.ERP.Abstracciones.DA.EmpresaSucursal;
using Softlithe.ERP.BW.EmpresaSucursal;
using Softlithe.ERP.DA.EmpresaSucursal;

namespace Softlithe.ERP.Api.Inyeccion
{
    internal static class InyeccionDeDependenciaEmpresaSucursal
    {
        internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
        {
            services.AddScoped<IObtenerEmpresaSucursalBW, ObtenerEmpresaSucursalBW>();
            services.AddScoped<IObtenerEmpresaSucursalDA, ObtenerEmpresaSucursalDA>();
            return services;
        }
    }
}

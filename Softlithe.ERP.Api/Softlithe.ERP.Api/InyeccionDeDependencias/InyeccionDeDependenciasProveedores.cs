using Softlithe.ERP.Abstracciones.BC.Proveedores;
using Softlithe.ERP.Abstracciones.BW.Marcas;
using Softlithe.ERP.Abstracciones.BW.Proveedores;
using Softlithe.ERP.Abstracciones.DA.Marcas;
using Softlithe.ERP.Abstracciones.DA.Proveedores;
using Softlithe.ERP.BC.Proveedores;
using Softlithe.ERP.BW.Marcas;
using Softlithe.ERP.BW.Proveedores;
using Softlithe.ERP.DA.Marcas;
using Softlithe.ERP.DA.Proveedores;

namespace Softlithe.ERP.Api.Inyeccion
{
    internal static class InyeccionDeDependenciasProveedores
    {
        internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
        {
            //Inyeccion de Proveedor
            services.AddScoped<IObtenerProveedorBW, ObtenerProveedorBW>();
            services.AddScoped<IAgregarProveedorBW, AgregarProveedorBW>();
            services.AddScoped<IModificarProveedorBW, ModificarProveedorBW>();
            services.AddScoped<IModificarEstadoProveedorBW, ModificarEstadoProveedorBW>();
            services.AddScoped<IProveedorBC, ProveedorBC>();
            
            services.AddScoped<IProveedorRepository, ProveedorRepository>();
            return services;
        }
    }
}

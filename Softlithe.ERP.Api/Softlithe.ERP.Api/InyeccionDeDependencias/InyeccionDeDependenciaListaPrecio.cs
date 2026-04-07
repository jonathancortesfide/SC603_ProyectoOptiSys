using Softlithe.ERP.Abstracciones.BW.ListaPrecio.AgregarListaPrecio;
using Softlithe.ERP.Abstracciones.BW.ListaPrecio.ModificarEstadoListaPrecio;
using Softlithe.ERP.Abstracciones.BW.ListaPrecio.ModificarListaPrecio;
using Softlithe.ERP.Abstracciones.DA.ListaPrecio;
using Softlithe.ERP.Abstracciones.DA.ListaPrecio.AgregarListaPrecio;
using Softlithe.ERP.Abstracciones.DA.ListaPrecio.ModificarEstadoListaPrecio;
using Softlithe.ERP.Abstracciones.DA.ListaPrecio.ModificarListaPrecio;
using Softlithe.ERP.Abstracciones.DA.ListaPrecio.ObetenerListaPrecioPorID;
using Softlithe.ERP.BW.ListaPrecio.AgregarListaPrecio;
using Softlithe.ERP.BW.ListaPrecio.ModificarEstadoListaPrecio;
using Softlithe.ERP.BW.ListaPrecio.ModificarListaPrecio;
using Softlithe.ERP.BW.ListaPrecio.ObetenerListaPrecioPorID;
using Softlithe.ERP.DA.ListaPrecio.AgregarListaPrecio;
using Softlithe.ERP.DA.ListaPrecio.ModificarEstadoListaPrecio;
using Softlithe.ERP.DA.ListaPrecio.ModificarListaPrecio;
using Softlithe.ERP.DA.ListaPrecio.ObtenerListaPrecioPorID;

namespace Softlithe.ERP.Api.Inyeccion
{
    internal static class InyeccionDeDependenciaListaPrecio
    {
        internal static IServiceCollection InyectarDependenciasListaPrecio(this IServiceCollection services)
        {
            //Inyeccion de Lista de Precios
            services.AddScoped<IAgregarListaPrecioBW, AgregarListaPrecioBW>();
            services.AddScoped<IAgregarListaPrecioAD, AgregarListaPrecioAD>();
            services.AddScoped<IModificarListaPrecioBW, ModificarListaPrecioBW>();
            services.AddScoped<IModificarListaPrecioDA, ModificarListaPrecioDA>();
            services.AddScoped<IModificarEstadoListaPrecioBW, ModificarEstadoListaPrecioBW>();
            services.AddScoped<IModificarEstadoListaPrecioDA, ModificarEstadoListaPrecioDA>();
            services.AddScoped<IObtenerListaPrecioPorIdBW, ObetenerListaPrecioPorIDBW>();
            services.AddScoped<IObtenerListaPrecioPorIdAD, ObtenerListaPrecioPorIdAD>();

            return services;
        }
    }
}

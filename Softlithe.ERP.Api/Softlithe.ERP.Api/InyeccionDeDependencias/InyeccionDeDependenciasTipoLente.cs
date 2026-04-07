using Softlithe.ERP.Abstracciones.BW.TipoLente.AgregarTipoLente;
using Softlithe.ERP.Abstracciones.BW.TipoLente.ModificarEstadoTipoLente;
using Softlithe.ERP.Abstracciones.BW.TipoLente.ModificarTipoLente;
using Softlithe.ERP.Abstracciones.BW.TipoLente.ObtenerTipoLentePorId;
using Softlithe.ERP.Abstracciones.DA.TipoLente.AgregarTipoLente;
using Softlithe.ERP.Abstracciones.DA.TipoLente.ModificarEstadoTipoLente;
using Softlithe.ERP.Abstracciones.DA.TipoLente.ModificarTipoLente;
using Softlithe.ERP.Abstracciones.DA.TipoLente.ObtenerTipoLentePorId;
using Softlithe.ERP.BW.TipoLente.AgregarTipoLente;
using Softlithe.ERP.BW.TipoLente.ModificarEstadoTipoLente;
using Softlithe.ERP.BW.TipoLente.ModificarTipoLente;
using Softlithe.ERP.BW.TipoLente.ObtenerTipoLentePorId;
using Softlithe.ERP.DA.TipoLente.AgregarTipoLente;
using Softlithe.ERP.DA.TipoLente.ModificarEstadoTipoLente;
using Softlithe.ERP.DA.TipoLente.ModificarTipoLente;
using Softlithe.ERP.DA.TipoLente.ObtenerTipoLentePorId;

namespace Softlithe.ERP.Api.Inyeccion 
{ 
    internal static class InyeccionDeDependenciasTipoLente
    {
        internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
        {
            //Inyeccion de TipoLente
            services.AddScoped<IObtenerTipoLentesPorIdBW, ObtenerTipoLentesPorIdBW>();
            services.AddScoped<IObtenerTipoLentesPorIdAD, ObtenerTipoLentesPorIdAD>();
            services.AddScoped<IModificarTipoLenteBW, ModificarTipoLenteBW>();
            services.AddScoped<IModificarTipoLenteAD, ModificarTipoLenteAD>();
            services.AddScoped<IModificarEstadoTipoLenteBW, ModificarEstadoTipoLenteBW>();
            services.AddScoped<IModificarEstadoTipoLenteDA, ModificarEstadoTipoLenteDA>();
            services.AddScoped<IAgregarTipoLenteBW, AgregaTipoLenteBW>();
            services.AddScoped<IAgregarTipoLenteAD, AgregarTipoLenteAD>();

            return services;
        }
    }
}

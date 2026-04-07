using Softlithe.ERP.Abstracciones.BW.Grupos.AgregarGrupo;
using Softlithe.ERP.Abstracciones.BW.Grupos.CambiarEstadoGrupo;
using Softlithe.ERP.Abstracciones.BW.Grupos.ModificarGrupo;
using Softlithe.ERP.Abstracciones.BW.Grupos.ObtenerGruposPorEmpresa;
using Softlithe.ERP.Abstracciones.DA.Grupos.AgregarGrupo;
using Softlithe.ERP.Abstracciones.DA.Grupos.CambiarEstadoGrupo;
using Softlithe.ERP.Abstracciones.DA.Grupos.ModificarGrupo;
using Softlithe.ERP.Abstracciones.DA.Grupos.ObtenerGruposPorEmpresa;
using Softlithe.ERP.BW.Grupos.AgregarGrupo;
using Softlithe.ERP.BW.Grupos.CambiarEstadoGrupo;
using Softlithe.ERP.BW.Grupos.ModificarGrupo;
using Softlithe.ERP.BW.Grupos.ObtenerGruposPorEmpresa;
using Softlithe.ERP.DA.Grupos.AgregarGrupo;
using Softlithe.ERP.DA.Grupos.CambiarEstadoGrupo;
using Softlithe.ERP.DA.Grupos.ModificarGrupo;
using Softlithe.ERP.DA.Grupos.ObtenerGruposPorEmpresa;

namespace Softlithe.ERP.Api.Inyeccion
{
    internal static class InyeccionDependenciasGrupos
    {
        internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
        {
            services.AddScoped<IObtenerGruposPorEmpresaDA, ObtenerGruposPorEmpresaDA>();
            services.AddScoped<IObtenerGruposPorEmpresaBW, ObtenerGruposPorEmpresaBW>();

            services.AddScoped<IAgregarGrupoDA, AgregarGrupoDA>();
            services.AddScoped<IAgregarGrupoBW, AgregarGrupoBW>();

            services.AddScoped<IModificarGrupoDA, ModificarGrupoDA>();
            services.AddScoped<IModificarGrupoBW, ModificarGrupoBW>();

            services.AddScoped<ICambiarEstadoGrupoDA, CambiarEstadoGrupoDA>();
            services.AddScoped<ICambiarEstadoGrupoBW, CambiarEstadoGrupoBW>();

            return services;
        }
    }
}

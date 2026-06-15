using Softlithe.ERP.Abstracciones.BW.Graduaciones.AgregarGraduacion;
using Softlithe.ERP.Abstracciones.BW.Graduaciones.ModificarEstadoGraduacion;
using Softlithe.ERP.Abstracciones.BW.Graduaciones.ModificarGraduacion;
using Softlithe.ERP.Abstracciones.BW.Graduaciones.ObtenerGraduacionPorIdentificador;
using Softlithe.ERP.Abstracciones.DA.Graduaciones.AgregarGraduacion;
using Softlithe.ERP.Abstracciones.DA.Graduaciones.ModificarEstadoGraduacion;
using Softlithe.ERP.Abstracciones.DA.Graduaciones.ModificarGraduacion;
using Softlithe.ERP.Abstracciones.DA.Graduaciones.ObtenerGraduacionPorIdentificador;
using Softlithe.ERP.BW.Graduaciones.AgregarGraduacion;
using Softlithe.ERP.BW.Graduaciones.ModificarEstadoGraduacion;
using Softlithe.ERP.BW.Graduaciones.ModificarGraduacion;
using Softlithe.ERP.BW.Graduaciones.ObtenerGraduacionPorIdentificador;
using Softlithe.ERP.DA.Graduaciones.AgregarGraduacion;
using Softlithe.ERP.DA.Graduaciones.ModificarEstadoGraduacion;
using Softlithe.ERP.DA.Graduaciones.ModificarGraduacion;
using Softlithe.ERP.DA.Graduaciones.ObtenerGraduacionPorIdentificador;

namespace Softlithe.ERP.Api.Inyeccion;

internal static class InyeccionDeDependenciasGraduaciones
{
    internal static IServiceCollection InyectarDependenciasGraduaciones(this IServiceCollection services)
    {
        services.AddScoped<IAgregarGraduacionBW, AgregarGraduacionBW>();
        services.AddScoped<IAgregarGraduacionAD, AgregarGraduacionAD>();
        services.AddScoped<IModificarGraduacionBW, ModificarGraduacionBW>();
        services.AddScoped<IModificarGraduacionDA, ModificarGraduacionDA>();
        services.AddScoped<IModificarEstadoGraduacionBW, ModificarEstadoGraduacionBW>();
        services.AddScoped<IModificarEstadoGraduacionDA, ModificarEstadoGraduacionDA>();
        services.AddScoped<IObtenerGraduacionPorIdentificadorBW, ObtenerGraduacionPorIdentificadorBW>();
        services.AddScoped<IObtenerGraduacionPorIdentificadorAD, ObtenerGraduacionPorIdentificadorAD>();

        return services;
    }
}

using Softlithe.ERP.Abstracciones.BW.Graduaciones.ObtenerGraduacionPorIdentificador;
using Softlithe.ERP.Abstracciones.DA.Graduaciones.ObtenerGraduacionPorIdentificador;
using Softlithe.ERP.BW.Graduaciones.ObtenerGraduacionPorIdentificador;
using Softlithe.ERP.DA.Graduaciones.ObtenerGraduacionPorIdentificador;

namespace Softlithe.ERP.Api.Inyeccion
{
    internal static class InyeccionDeDependenciasGraduaciones
    {
        internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
        {
            // Registraciones para Graduaciones
            services.AddScoped<IObtenerGraduacionPorIdentificadorBW, ObtenerGraduacionPorIdentificadorBW>();
            services.AddScoped<IObtenerGraduacionPorIdentificadorAD, ObtenerGraduacionPorIdentificadorAD>();

            return services;
        }
    }
}

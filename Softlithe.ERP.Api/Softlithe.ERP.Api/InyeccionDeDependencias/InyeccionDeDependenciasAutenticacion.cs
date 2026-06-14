using Softlithe.ERP.Abstracciones.BW.Autenticacion;
using Softlithe.ERP.Abstracciones.DA.Autenticacion;
using Softlithe.ERP.Api.Servicios;
using Softlithe.ERP.BW.Autenticacion;
using Softlithe.ERP.DA.Autenticacion;

namespace Softlithe.ERP.Api.Inyeccion;

internal static class InyeccionDeDependenciasAutenticacion
{
    internal static IServiceCollection InyectarDependencias(this IServiceCollection Services)
    {
        Services.AddScoped<IAutenticacionDA, AutenticacionDA>();
        Services.AddScoped<IAutenticacionBW, AutenticacionBW>();
        Services.AddScoped<IPasswordService, PasswordService>();
        Services.AddScoped<IJwtTokenService, JwtTokenService>();

        return Services;
    }
}

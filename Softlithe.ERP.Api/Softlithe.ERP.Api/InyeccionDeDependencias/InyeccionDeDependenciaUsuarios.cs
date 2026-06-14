using Softlithe.ERP.Abstracciones.BW.Usuarios;
using Softlithe.ERP.Abstracciones.DA.Usuarios;
using Softlithe.ERP.BW.Usuarios;
using Softlithe.ERP.DA.Usuarios;

namespace Softlithe.ERP.Api.Inyeccion;

internal static class InyeccionDeDependenciaUsuarios
{
    internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
    {
        services.AddScoped<IObtenerUsuarioBW, ObtenerUsuarioBW>();
        services.AddScoped<IObtenerUsuarioDA, ObtenerUsuarioDA>();
        services.AddScoped<IAgregarUsuarioBW, AgregarUsuarioBW>();
        services.AddScoped<IAgregarUsuarioDA, AgregarUsuarioDA>();
        services.AddScoped<IModificarUsuarioBW, ModificarUsuarioBW>();
        services.AddScoped<IModificarUsuarioDA, ModificarUsuarioDA>();
        services.AddScoped<IModificarEstadoUsuarioBW, ModificarEstadoUsuarioBW>();
        services.AddScoped<IModificarEstadoUsuarioDA, ModificarEstadoUsuarioDA>();

        return services;
    }
}

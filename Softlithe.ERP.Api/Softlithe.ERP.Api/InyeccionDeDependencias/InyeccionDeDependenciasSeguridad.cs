using Softlithe.ERP.Abstracciones.BW.Seguridad.Modulos;
using Softlithe.ERP.Abstracciones.BW.Seguridad.Permisos;
using Softlithe.ERP.Abstracciones.BW.Seguridad.RolPermisos;
using Softlithe.ERP.Abstracciones.BW.Seguridad.Roles;
using Softlithe.ERP.Abstracciones.BW.Seguridad.Secciones;
using Softlithe.ERP.Abstracciones.BW.Seguridad.UsuarioRoles;
using Softlithe.ERP.Abstracciones.DA.Seguridad.Modulos;
using Softlithe.ERP.Abstracciones.DA.Seguridad.Permisos;
using Softlithe.ERP.Abstracciones.DA.Seguridad.RolPermisos;
using Softlithe.ERP.Abstracciones.DA.Seguridad.Roles;
using Softlithe.ERP.Abstracciones.DA.Seguridad.Secciones;
using Softlithe.ERP.Abstracciones.DA.Seguridad.UsuarioRoles;
using Softlithe.ERP.BW.Seguridad.Modulos;
using Softlithe.ERP.BW.Seguridad.Permisos;
using Softlithe.ERP.BW.Seguridad.RolPermisos;
using Softlithe.ERP.BW.Seguridad.Roles;
using Softlithe.ERP.BW.Seguridad.Secciones;
using Softlithe.ERP.BW.Seguridad.UsuarioRoles;
using Softlithe.ERP.DA.Seguridad.Modulos;
using Softlithe.ERP.DA.Seguridad.Permisos;
using Softlithe.ERP.DA.Seguridad.RolPermisos;
using Softlithe.ERP.DA.Seguridad.Roles;
using Softlithe.ERP.DA.Seguridad.Secciones;
using Softlithe.ERP.DA.Seguridad.UsuarioRoles;

namespace Softlithe.ERP.Api.Inyeccion
{
    internal static class InyeccionDeDependenciasSeguridad
    {
        internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
        {
            // Secciones
            services.AddScoped<IObtenerSeccionesDA, ObtenerSeccionesDA>();
            services.AddScoped<IObtenerSeccionesBW, ObtenerSeccionesBW>();
            services.AddScoped<IAgregarSeccionDA, AgregarSeccionDA>();
            services.AddScoped<IAgregarSeccionBW, AgregarSeccionBW>();
            services.AddScoped<IModificarEstadoSeccionDA, ModificarEstadoSeccionDA>();
            services.AddScoped<IModificarEstadoSeccionBW, ModificarEstadoSeccionBW>();

            // Módulos
            services.AddScoped<IObtenerModulosDA, ObtenerModulosDA>();
            services.AddScoped<IObtenerModulosBW, ObtenerModulosBW>();
            services.AddScoped<IAgregarModuloDA, AgregarModuloDA>();
            services.AddScoped<IAgregarModuloBW, AgregarModuloBW>();
            services.AddScoped<IModificarEstadoModuloDA, ModificarEstadoModuloDA>();
            services.AddScoped<IModificarEstadoModuloBW, ModificarEstadoModuloBW>();

            // Permisos
            services.AddScoped<IObtenerPermisosDA, ObtenerPermisosDA>();
            services.AddScoped<IObtenerPermisosBW, ObtenerPermisosBW>();
            services.AddScoped<IAgregarPermisoDA, AgregarPermisoDA>();
            services.AddScoped<IAgregarPermisoBW, AgregarPermisoBW>();
            services.AddScoped<IModificarEstadoPermisoDA, ModificarEstadoPermisoDA>();
            services.AddScoped<IModificarEstadoPermisoBW, ModificarEstadoPermisoBW>();

            // Roles
            services.AddScoped<IObtenerRolesDA, ObtenerRolesDA>();
            services.AddScoped<IObtenerRolesBW, ObtenerRolesBW>();
            services.AddScoped<IAgregarRolDA, AgregarRolDA>();
            services.AddScoped<IAgregarRolBW, AgregarRolBW>();
            services.AddScoped<IModificarEstadoRolDA, ModificarEstadoRolDA>();
            services.AddScoped<IModificarEstadoRolBW, ModificarEstadoRolBW>();

            // Rol-Permisos
            services.AddScoped<IObtenerRolPermisosDA, ObtenerRolPermisosDA>();
            services.AddScoped<IObtenerRolPermisosBW, ObtenerRolPermisosBW>();
            services.AddScoped<IAsignarPermisoARolDA, AsignarPermisoARolDA>();
            services.AddScoped<IAsignarPermisoARolBW, AsignarPermisoARolBW>();
            services.AddScoped<IModificarEstadoRolPermisoDA, ModificarEstadoRolPermisoDA>();
            services.AddScoped<IModificarEstadoRolPermisoBW, ModificarEstadoRolPermisoBW>();

            // Usuario-Roles
            services.AddScoped<IObtenerUsuarioRolesDA, ObtenerUsuarioRolesDA>();
            services.AddScoped<IObtenerUsuarioRolesBW, ObtenerUsuarioRolesBW>();
            services.AddScoped<IAsignarRolAUsuarioDA, AsignarRolAUsuarioDA>();
            services.AddScoped<IAsignarRolAUsuarioBW, AsignarRolAUsuarioBW>();
            services.AddScoped<IModificarEstadoUsuarioRolDA, ModificarEstadoUsuarioRolDA>();
            services.AddScoped<IModificarEstadoUsuarioRolBW, ModificarEstadoUsuarioRolBW>();
            services.AddScoped<IObtenerPermisosEfectivosUsuarioDA, ObtenerPermisosEfectivosUsuarioDA>();
            services.AddScoped<IObtenerPermisosEfectivosUsuarioBW, ObtenerPermisosEfectivosUsuarioBW>();

            return services;
        }
    }
}

const apiBase = import.meta.env.VITE_ApiBase;

const apiObtenerRoles = `${apiBase}/Roles`;
const apiObtenerRolPorId = `${apiBase}/Roles/`;
const apiCrearRol = `${apiBase}/Roles`;
const apiCambiarEstadoRol = `${apiBase}/Roles/estado`;
const apiObtenerModulos = `${apiBase}/Modulos`;
const apiObtenerPermisos = `${apiBase}/Permisos`;
const apiObtenerPermisosDelRol = `${apiBase}/Roles/`;
const apiAsignarPermisoARol = `${apiBase}/Roles/permisos`;
const apiCambiarEstadoPermisoDeRol = `${apiBase}/Roles/permisos/estado`;
const apiAsignarRolAUsuario = `${apiBase}/usuarios/`;
const apiDesvincularRolDelUsuario = `${apiBase}/usuarios/`;
const apiObtenerRolesDelUsuario = `${apiBase}/usuarios/`;

export {
    apiObtenerRoles,
    apiObtenerRolPorId,
    apiCrearRol,
    apiCambiarEstadoRol,
    apiObtenerModulos,
    apiObtenerPermisos,
    apiObtenerPermisosDelRol,
    apiAsignarPermisoARol,
    apiCambiarEstadoPermisoDeRol,
    apiAsignarRolAUsuario,
    apiDesvincularRolDelUsuario,
    apiObtenerRolesDelUsuario
};

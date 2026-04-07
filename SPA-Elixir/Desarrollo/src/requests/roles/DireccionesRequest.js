// Configurar estas URLs según tu API de roles
const apiBase = import.meta.env.VITE_ApiBase;

const apiObtenerRoles = `${apiBase}/Roles/`;
const apiObtenerRolPorId = `${apiBase}/Roles/`;
const apiCrearRol = `${apiBase}/Roles/`;
const apiActualizarRol = `${apiBase}/Roles/`;
const apiEliminarRol = `${apiBase}/Roles/`;
const apiObtenerPermisos = `${apiBase}/Permisos/`;
const apiAsignarRolAUsuario = `${apiBase}/UsuariosRoles/asignar`;
const apiDesvincularRolDelUsuario = `${apiBase}/UsuariosRoles/desvincular`;
const apiObtenerRolesDelUsuario = `${apiBase}/UsuariosRoles/usuario/`;

export {
    apiObtenerRoles,
    apiObtenerRolPorId,
    apiCrearRol,
    apiActualizarRol,
    apiEliminarRol,
    apiObtenerPermisos,
    apiAsignarRolAUsuario,
    apiDesvincularRolDelUsuario,
    apiObtenerRolesDelUsuario
};

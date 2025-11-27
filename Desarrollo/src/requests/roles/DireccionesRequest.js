// Configurar estas URLs según tu API de roles
const apiBase = import.meta.env.VITE_ApiBase;

const apiObtenerRoles = `${apiBase}/roles/`;
const apiObtenerRolPorId = `${apiBase}/roles/`;
const apiCrearRol = `${apiBase}/roles/`;
const apiActualizarRol = `${apiBase}/roles/`;
const apiEliminarRol = `${apiBase}/roles/`;
const apiObtenerPermisos = `${apiBase}/permisos/`;
const apiAsignarRolAUsuario = `${apiBase}/usuarios-roles/asignar/`;
const apiDesvincularRolDelUsuario = `${apiBase}/usuarios-roles/desvincular/`;
const apiObtenerRolesDelUsuario = `${apiBase}/usuarios-roles/usuario/`;

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

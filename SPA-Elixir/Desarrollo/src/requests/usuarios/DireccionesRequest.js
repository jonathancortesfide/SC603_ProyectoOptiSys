const apiBase = import.meta.env.VITE_ApiBase;

const apiObtenerUsuarios = `${apiBase}/Usuarios/`;
const apiObtenerUsuarioPorId = `${apiBase}/Usuarios/`;
const apiCrearUsuario = `${apiBase}/Usuarios/`;
const apiActualizarUsuario = `${apiBase}/Usuarios/`;
const apiEliminarUsuario = `${apiBase}/Usuarios/`;
const apiCambiarContrasena = `${apiBase}/Usuarios/cambiar-contrasena/`;
const apiBuscarUsuarios = `${apiBase}/Usuarios/buscar?`;

export {
    apiObtenerUsuarios,
    apiObtenerUsuarioPorId,
    apiCrearUsuario,
    apiActualizarUsuario,
    apiEliminarUsuario,
    apiCambiarContrasena,
    apiBuscarUsuarios
};

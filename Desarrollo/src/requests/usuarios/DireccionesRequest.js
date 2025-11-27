const apiBase = import.meta.env.VITE_ApiBase;

const apiObtenerUsuarios = `${apiBase}/usuarios/`;
const apiObtenerUsuarioPorId = `${apiBase}/usuarios/`;
const apiCrearUsuario = `${apiBase}/usuarios/`;
const apiActualizarUsuario = `${apiBase}/usuarios/`;
const apiEliminarUsuario = `${apiBase}/usuarios/`;
const apiCambiarContrasena = `${apiBase}/usuarios/cambiar-contrasena/`;
const apiBuscarUsuarios = `${apiBase}/usuarios/buscar/?`;

export {
    apiObtenerUsuarios,
    apiObtenerUsuarioPorId,
    apiCrearUsuario,
    apiActualizarUsuario,
    apiEliminarUsuario,
    apiCambiarContrasena,
    apiBuscarUsuarios
};

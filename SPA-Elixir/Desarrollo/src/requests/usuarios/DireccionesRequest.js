const apiBase = import.meta.env.VITE_ApiBase;

const apiObtenerUsuarios = `${apiBase}/Usuario/ObtenerUsuario`;
const apiObtenerUsuarioPorId = `${apiBase}/Usuario/ObtenerUsuarioPorId`;
const apiObtenerUsuarioPorCorreo = `${apiBase}/Usuario/ObtenerUsuarioPorCorreo`;
const apiAgregarUsuario = `${apiBase}/Usuario/AgregarUsuario`;
const apiModificarUsuario = `${apiBase}/Usuario/ModificarUsuario`;
const apiModificarEstadoUsuario = `${apiBase}/Usuario/ModificarEstadoUsuario`;

export {
    apiObtenerUsuarios,
    apiObtenerUsuarioPorId,
    apiObtenerUsuarioPorCorreo,
    apiAgregarUsuario,
    apiModificarUsuario,
    apiModificarEstadoUsuario,
};

const apiBase = import.meta.env.VITE_ApiBase;

const apiGruposProductosPorEmpresa = `${apiBase}/Grupo/ObtenerPorEmpresa/`;
const apiCrearGrupoProducto = `${apiBase}/Grupo/AgregarGrupo`;
const apiActualizarGrupoProducto = `${apiBase}/Grupo/ModificarGrupo`;
const apiCambiarEstadoGrupoProducto = `${apiBase}/Grupo/`;

export {
    apiGruposProductosPorEmpresa,
    apiCrearGrupoProducto,
    apiActualizarGrupoProducto,
    apiCambiarEstadoGrupoProducto
};

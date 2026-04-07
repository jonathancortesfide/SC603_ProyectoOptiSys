const apiBase = import.meta.env.VITE_ApiBase;

const apiGruposProductos = `${apiBase}/gruposproductos/`;
const apiGrupoProductoPorId = `${apiBase}/gruposproductos/`;
const apiCrearGrupoProducto = `${apiBase}/gruposproductos/`;
const apiActualizarGrupoProducto = `${apiBase}/gruposproductos/`;
const apiEliminarGrupoProducto = `${apiBase}/gruposproductos/`;

export {
    apiGruposProductos,
    apiGrupoProductoPorId,
    apiCrearGrupoProducto,
    apiActualizarGrupoProducto,
    apiEliminarGrupoProducto
};

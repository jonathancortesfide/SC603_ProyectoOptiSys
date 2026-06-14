const apiBase = import.meta.env.VITE_ApiBase;

const apiObtenerProductos = `${apiBase}/productos/`;
const apiAgregarProducto = `${apiBase}/productos/`;
const apiEliminarProducto = `${apiBase}/productos/`;

export { apiObtenerProductos, apiAgregarProducto, apiEliminarProducto };

const apiBase = import.meta.env.VITE_ApiBase;

const apiObtenerProductos = `${apiBase}/Productos/`;
const apiAgregarProducto = `${apiBase}/Productos/`;
const apiActualizarProducto = `${apiBase}/Productos/`;
const apiEliminarProducto = `${apiBase}/Productos/`;

export { apiObtenerProductos, apiAgregarProducto, apiActualizarProducto, apiEliminarProducto };

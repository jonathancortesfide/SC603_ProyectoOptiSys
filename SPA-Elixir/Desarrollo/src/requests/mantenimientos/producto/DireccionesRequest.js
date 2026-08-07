const apiBase = import.meta.env.VITE_ApiBase;

// Endpoints base
const apiObtenerProductos = `${apiBase}/productos/ObtenerProducto`;
const apiObtenerProductoPorId = `${apiBase}/productos/ObtenerProductoPorId`;
const apiAgregarProducto = `${apiBase}/productos/AgregarProducto`;
const apiModificarProducto = `${apiBase}/productos/ModificarProducto`;
const apiModificarEstadoProducto = `${apiBase}/productos/ModificarEstadoProducto`;
const apiEliminarProducto = `${apiBase}/productos/`;
const apiObtenerProductosMT = `${apiBase}/productos/ObtenerProductosMT`;
const apiObtenerProductosAR = `${apiBase}/productos/ObtenerProductosAR`;

export {
  apiObtenerProductos,
  apiObtenerProductoPorId,
  apiAgregarProducto,
  apiModificarProducto,
  apiModificarEstadoProducto,
  apiEliminarProducto,
  apiObtenerProductosMT,
  apiObtenerProductosAR,
};

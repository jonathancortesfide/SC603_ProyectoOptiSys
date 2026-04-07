const apiBase = import.meta.env.VITE_ApiBase;

const apiListasPrecios = `${apiBase}/ListaPrecio/`;
const apiListaPrecioPorId = `${apiBase}/ListaPrecio/`;
const apiCrearListaPrecio = `${apiBase}/ListaPrecio/Agregar`;
const apiActualizarListaPrecio = `${apiBase}/ListaPrecio/`;
const apiEliminarListaPrecio = `${apiBase}/ListaPrecio/`;
const apiListasPreciosPorMoneda = `${apiBase}/ListaPrecio/Obtener?id_moneda=`;
const apiModificarEstadoListaPrecio = `${apiBase}/ListaPrecio/ModificarEstado/`;

export {
  apiListasPrecios,
  apiListaPrecioPorId,
  apiCrearListaPrecio,
  apiActualizarListaPrecio,
  apiEliminarListaPrecio,
  apiListasPreciosPorMoneda,
  apiModificarEstadoListaPrecio
};

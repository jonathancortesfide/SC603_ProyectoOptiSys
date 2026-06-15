const apiBase = import.meta.env.VITE_ApiBase;

const apiListasPrecios = `${apiBase}/ListaPrecio/`;
const apiListaPrecioPorId = `${apiBase}/ListaPrecio/`;
const apiCrearListaPrecio = `${apiBase}/ListaPrecio/Agregar`;
const apiActualizarListaPrecio = `${apiBase}/ListaPrecio/Modificar`;
const apiListasPreciosPorDescripcion = `${apiBase}/ListaPrecio/Obtener?descripcion=`;
const apiModificarEstadoListaPrecio = `${apiBase}/ListaPrecio/ModificarEstado/`;

export {
  apiListasPrecios,
  apiListaPrecioPorId,
  apiCrearListaPrecio,
  apiActualizarListaPrecio,
  apiListasPreciosPorDescripcion,
  apiModificarEstadoListaPrecio
};

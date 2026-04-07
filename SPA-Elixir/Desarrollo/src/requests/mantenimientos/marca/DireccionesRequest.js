const apiBase = import.meta.env.VITE_ApiBase;

const apiMarcas = `${apiBase}/marcas/`;
const apiMarcaPorId = `${apiBase}/marcas/`;
const apiCrearMarca = `${apiBase}/marcas/`;
const apiActualizarMarca = `${apiBase}/marcas/`;
const apiEliminarMarca = `${apiBase}/marcas/`;

export {
    apiMarcas,
    apiMarcaPorId,
    apiCrearMarca,
    apiActualizarMarca,
    apiEliminarMarca
};

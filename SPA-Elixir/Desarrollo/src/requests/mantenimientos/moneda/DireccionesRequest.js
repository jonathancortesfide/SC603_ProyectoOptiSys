// VITE_ApiBase en .env controla el host del API (ej: https://localhost:7159/api)
const apiBase = import.meta.env.VITE_ApiBase;

const apiMonedas = `${apiBase}/monedas`;
const apiMonedaPorId = `${apiBase}/monedas/`;          // + {idMoneda}
const apiCrearMoneda = `${apiBase}/monedas`;
const apiCambiarEstadoMoneda = `${apiBase}/monedas/`;  // + {idMoneda}/estado

export {
    apiMonedas,
    apiMonedaPorId,
    apiCrearMoneda,
    apiCambiarEstadoMoneda,
};

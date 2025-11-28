const apiBase = import.meta.env.VITE_ApiBase;

const apiMonedas = `${apiBase}/monedas/`;
const apiMonedaPorId = `${apiBase}/monedas/`;
const apiCrearMoneda = `${apiBase}/monedas/`;
const apiActualizarMoneda = `${apiBase}/monedas/`;
const apiEliminarMoneda = `${apiBase}/monedas/`;

export {
    apiMonedas,
    apiMonedaPorId,
    apiCrearMoneda,
    apiActualizarMoneda,
    apiEliminarMoneda
};

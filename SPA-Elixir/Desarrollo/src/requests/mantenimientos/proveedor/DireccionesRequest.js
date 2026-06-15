// VITE_ApiBase en .env (ej. /api con proxy en vite.config, o https://host/api)
const normalizarBase = (v) => {
    const s = (v == null || v === '') ? '/api' : String(v).trim().replace(/^["']|["']$/g, '');
    const out = s.replace(/\/$/, '');
    return out || '/api';
};

const apiBase = normalizarBase(import.meta.env.VITE_ApiBase);

const apiProveedores = `${apiBase}/Proveedores`;

/** Opcional: ruta exacta si difiere (copiar desde Swagger), ej. /api/Proveedores/ModificaEstadoProveedor */
const apiModificarEstadoProveedor = import.meta.env.VITE_ApiModificarEstadoProveedor;

export {
    apiBase,
    apiProveedores,
    apiModificarEstadoProveedor,
};

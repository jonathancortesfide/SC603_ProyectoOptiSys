const normalizarBase = (v) => {
    const s = (v == null || v === '') ? '/api' : String(v).trim().replace(/^["']|["']$/g, '');
    const out = s.replace(/\/$/, '');
    return out || '/api';
};

const apiBase = normalizarBase(import.meta.env.VITE_ApiBase);

const apiMarcas = `${apiBase}/Marcas`;

/** Opcional: ruta exacta si difiere del convenio `{apiMarcas}/ModificaEstadoMarca` */
const apiModificaEstadoMarca = import.meta.env.VITE_ApiModificaEstadoMarca;

export {
    apiBase,
    apiMarcas,
    apiModificaEstadoMarca,
};

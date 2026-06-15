const STORAGE_NO_EMPRESA = 'noEmpresaSeleccionada';
const STORAGE_NOMBRE_EMPRESA = 'nombreEmpresaSesion';

const parseOptionalInt = (value) => {
    if (value === undefined || value === null) return undefined;

    const normalized = String(value).trim().replace(/^["']|["']$/g, '');
    if (!normalized) return undefined;

    const parsed = Number.parseInt(normalized, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
};

/** Persiste la empresa elegida (selección explícita o única empresa detectada). */
export const setNoEmpresaSeleccionada = (noEmpresa) => {
    const n = Number.parseInt(String(noEmpresa), 10);
    if (!Number.isFinite(n)) return;
    window.localStorage.setItem(STORAGE_NO_EMPRESA, String(n));
};

/** Nombre mostrado en la cabecera (texto plano). */
export const setNombreEmpresaSesion = (nombre) => {
    const t = nombre == null ? '' : String(nombre).trim();
    if (t) window.localStorage.setItem(STORAGE_NOMBRE_EMPRESA, t);
    else window.localStorage.removeItem(STORAGE_NOMBRE_EMPRESA);
};

export const getNombreEmpresaSesion = () => {
    const t = window.localStorage.getItem(STORAGE_NOMBRE_EMPRESA);
    return t && String(t).trim() ? String(t).trim() : '';
};

export const clearNoEmpresaSeleccionada = () => {
    window.localStorage.removeItem(STORAGE_NO_EMPRESA);
    window.localStorage.removeItem(STORAGE_NOMBRE_EMPRESA);
};

/**
 * True si hay empresa en sesión (localStorage). Sustituye el uso de `VITE_NO_EMPRESA`.
 */
export const hasEmpresaElegidaParaAcceso = () =>
    parseOptionalInt(window.localStorage.getItem(STORAGE_NO_EMPRESA)) !== undefined;

/**
 * `NoEmpresa` para APIs de catálogo. Valor guardado al elegir empresa (o única empresa).
 */
export const getNoEmpresa = () => {
    const fromSeleccion = parseOptionalInt(window.localStorage.getItem(STORAGE_NO_EMPRESA));
    if (fromSeleccion !== undefined) return fromSeleccion;
    return 7;
};

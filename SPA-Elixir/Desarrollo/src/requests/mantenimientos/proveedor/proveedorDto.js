/**
 * Cuerpo JSON alineado al ProveedorDto del API (propiedades en PascalCase).
 */

/** ISO 8601 desde valor de <input type="datetime-local"> (YYYY-MM-DDTHH:mm) */
export const fechaIsoDesdeLocal = (fechaLocal) => {
    if (!fechaLocal) return new Date().toISOString();
    const fp = fechaLocal.length === 16 ? `${fechaLocal}:00` : fechaLocal;
    const d = new Date(fp);
    return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};

/**
 * @param {object} p
 * @param {number} p.noProveedor
 * @param {number} p.identificador
 * @param {string} p.nombre
 * @param {string} p.cedula
 * @param {string} [p.direccion]
 * @param {string} [p.notas]
 * @param {string} p.fechaRegistroIso
 * @param {number} p.plazo
 * @param {string} [p.email]
 * @param {number} p.noNacionalidad
 * @param {boolean} p.esActivo
 * @param {number} p.limiteCredito
 * @param {number} p.noMoneda idMoneda (MonedaSucursal), no el número de catálogo
 * @param {number} p.saldo
 * @param {string} [p.telefono1]
 * @param {string} [p.telefono2]
 * @param {boolean} p.esLaboratorio
 * @param {string} p.usuario
 */
export const construirProveedorDto = (p) => ({
    NoProveedor: Number.parseInt(String(p.noProveedor), 10) || 0,
    Identificador: Number.parseInt(String(p.identificador), 10) || 0,
    Nombre: p.nombre ?? '',
    Cedula: p.cedula ?? '',
    Direccion: p.direccion != null ? String(p.direccion) : '',
    Notas: p.notas != null ? String(p.notas) : '',
    FechaRegistro: p.fechaRegistroIso,
    Plazo: Number.parseInt(String(p.plazo), 10) || 0,
    Email: p.email != null ? String(p.email) : '',
    NoNacionalidad: Number.parseInt(String(p.noNacionalidad), 10) || 0,
    EsActivo: !!p.esActivo,
    LimiteCredito: Number(p.limiteCredito),
    NoMoneda: Number.parseInt(String(p.noMoneda), 10) || 0,
    Saldo: Number(p.saldo),
    Telefono1: p.telefono1 != null ? String(p.telefono1) : '',
    Telefono2: p.telefono2 != null ? String(p.telefono2) : '',
    EsLaboratorio: !!p.esLaboratorio,
    Usuario: p.usuario ?? '',
});

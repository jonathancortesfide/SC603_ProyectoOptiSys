/**
 * Formas de trabajo del motor de documentos comerciales (factura, cotización, NC, etc.).
 * Sin API: valores locales y IDs temporales en cliente.
 */

export const CONDICION_VENTA = {
  CONTADO: 'CONTADO',
  CREDITO: 'CREDITO',
};

let lineIdSeq = 0;
const nextLineId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  lineIdSeq += 1;
  return `line-${Date.now()}-${lineIdSeq}`;
};

let pagoIdSeq = 0;
const nextPagoId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  pagoIdSeq += 1;
  return `pago-${Date.now()}-${pagoIdSeq}`;
};

export const fechaLocalIsoSlice = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

export const fechaSoloFechaIso = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

/**
 * Encabezado tipo FacturaMaestro (campos extensibles según backend).
 */
export function createMaestroInicial(overrides = {}) {
  return {
    id: null,
    serie: 'F',
    numero: '',
    fechaEmision: fechaLocalIsoSlice(),
    fechaVencimiento: '',
    plazoDias: 0,
    condicionVenta: CONDICION_VENTA.CONTADO,
    monedaCodigo: 'CRC',
    tipoCambio: 1,
    observaciones: '',
    estado: 'BORRADOR',
    pacienteId: null,
    pacienteCuentaId: null,
    vendedorId: null,
    cajaId: null,
    cierreCajaId: null,
    ...overrides,
  };
}

/**
 * Línea de detalle alineada a FacturaDetalle + Producto embebido para UI.
 */
export function createLineaVacia(overrides = {}) {
  return {
    id: nextLineId(),
    orden: 0,
    productoId: null,
    producto: null,
    cantidad: 1,
    precioUnitario: 0,
    descuentoPct: 0,
    tasaImpuesto: 13,
    ...overrides,
  };
}

export function createFacturaFormaPagoVacia(formaPagoId = null, overrides = {}) {
  return {
    id: nextPagoId(),
    formaPagoId,
    formaPago: null,
    monto: 0,
    monedaCodigoPago: '',
    tipoCambio: 1,
    referencia: '',
    notas: '',
    ...overrides,
  };
}

export { nextLineId, nextPagoId };

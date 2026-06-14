/**
 * Catálogos locales hasta conectar API. Sustituir por llamadas en useFactura o capa de datos.
 */

export const MOCK_PACIENTES = [
  { id: 1, nombre: 'María González', documentoIdentidad: '1-2345-6789', telefono: '8888-1111', email: 'maria@ejemplo.com' },
  { id: 2, nombre: 'Carlos Jiménez', documentoIdentidad: '2-0456-7890', telefono: '8888-2222', email: 'carlos@ejemplo.com' },
  { id: 3, nombre: 'Ana Solís', documentoIdentidad: '3-1567-8901', telefono: '8888-3333', email: 'ana@ejemplo.com' },
];

export const MOCK_VENDEDORES = [
  { id: 1, nombre: 'Laura Méndez' },
  { id: 2, nombre: 'Roberto Vega' },
  { id: 3, nombre: 'Mostrador' },
];

export const MOCK_PRODUCTOS = [
  { id: 101, codigoInterno: 'LENT-001', nombre: 'Lente monofocal estándar', precioReferencia: 45000, tasaImpuesto: 13 },
  { id: 102, codigoInterno: 'LENT-002', nombre: 'Lente bifocal', precioReferencia: 62000, tasaImpuesto: 13 },
  { id: 103, codigoInterno: 'ACC-010', nombre: 'Estuche rígido', precioReferencia: 3500, tasaImpuesto: 13 },
  { id: 104, codigoInterno: 'SER-020', nombre: 'Consulta optometría', precioReferencia: 25000, tasaImpuesto: 13 },
];

export const MOCK_FORMAS_PAGO = [
  { id: 1, nombre: 'Efectivo' },
  { id: 2, nombre: 'Tarjeta' },
  { id: 3, nombre: 'Transferencia SINPE' },
  { id: 4, nombre: 'Cheque' },
];

export const MOCK_MONEDAS_SUCURSAL = [
  { id: 1, monedaCodigo: 'CRC', identificador: 'CRC', activo: true, tasaCambio: 1 },
  { id: 2, monedaCodigo: 'USD', identificador: 'USD', activo: true, tasaCambio: 520.35 },
];

export const MOCK_CAJAS = [
  { id: 1, noCaja: 'CAJA-01', usuario: 'mostrador', estado: 'ABIERTA' },
  { id: 2, noCaja: 'CAJA-02', usuario: 'caja2', estado: 'CERRADA' },
];

export const MOCK_CIERRES_CAJA = [
  {
    id: 101,
    noCaja: 'CAJA-01',
    noCierre: 'CIERRE-00045',
    usuario: 'mostrador',
    estado: 'ABIERTO',
    fechaApertura: '2026-05-06 08:00',
    fechaCierre: null,
  },
  {
    id: 102,
    noCaja: 'CAJA-02',
    noCierre: 'CIERRE-00044',
    usuario: 'caja2',
    estado: 'CERRADO',
    fechaApertura: '2026-05-05 08:00',
    fechaCierre: '2026-05-05 18:00',
  },
];

/**
 * Cuentas del paciente (PacienteCuenta) para prototipo.
 * En backend normalmente se filtra por pacienteId.
 */
export const MOCK_PACIENTE_CUENTAS = [
  { id: 201, pacienteId: 1, noCuenta: 'CTA-0001', idMoneda: 1, saldo: 0 },
  { id: 202, pacienteId: 1, noCuenta: 'CTA-0002', idMoneda: 2, saldo: 35.5 },
  { id: 203, pacienteId: 2, noCuenta: 'CTA-0003', idMoneda: 1, saldo: 12000 },
  { id: 204, pacienteId: 3, noCuenta: 'CTA-0004', idMoneda: 1, saldo: 0 },
];

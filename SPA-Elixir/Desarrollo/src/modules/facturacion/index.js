/** Motor de facturación / documentos comerciales (UI + estado local). */

export { useFactura } from './hooks/useFactura';

export {
  default as FacturaHeader,
  FacturaEncabezadoPrincipal,
  FacturaEncabezadoOpcional,
} from './components/FacturaHeader';
export { default as ClienteSelector } from './components/ClienteSelector';
export { default as VendedorSelector } from './components/VendedorSelector';
export { default as PacienteCuentaSelector } from './components/PacienteCuentaSelector';
export { default as ContextoCajaFactura } from './components/ContextoCajaFactura';
export { default as FacturaDetalle } from './components/FacturaDetalle';
export { default as FacturaTotales } from './components/FacturaTotales';
export { default as FacturaPagos } from './components/FacturaPagos';

export {
  CONDICION_VENTA,
  createMaestroInicial,
  createLineaVacia,
  createFacturaFormaPagoVacia,
  fechaLocalIsoSlice,
  fechaSoloFechaIso,
} from './domain/facturaModel';

export { calcularTotalesFactura, calcularLineaImportes } from './domain/calcularTotalesFactura';
export { formatMonto } from './utils/formatMoneda';

/**
 * Cálculo puro de totales a partir del detalle (sin redondeo fiscal específico aún).
 * @param {Array<import('./facturaTypes').FacturaDetalle & {
 *   cantidad: number,
 *   precioUnitario: number,
 *   descuentoPct: number,
 *   tasaImpuesto: number
 * }>} lineas
 */
export function calcularLineaImportes(linea) {
  const cantidad = Number(linea.cantidad) || 0;
  const precio = Number(linea.precioUnitario) || 0;
  const pctDto = Number(linea.descuentoPct) || 0;
  const tasa = Number(linea.tasaImpuesto) || 0;

  const bruto = cantidad * precio;
  const descuentoMonto = bruto * (pctDto / 100);
  const baseImponible = Math.max(0, bruto - descuentoMonto);
  const impuestoMonto = baseImponible * (tasa / 100);
  const totalLinea = baseImponible + impuestoMonto;

  return {
    bruto,
    descuentoMonto,
    baseImponible,
    impuestoMonto,
    totalLinea,
  };
}

export function calcularTotalesFactura(lineas) {
  const detalleConImportes = (lineas || []).map((linea, index) => {
    const importes = calcularLineaImportes(linea);
    return { ...linea, orden: index + 1, importes };
  });

  let subtotalBruto = 0;
  let totalDescuentos = 0;
  let totalImpuestos = 0;
  let totalDocumento = 0;

  detalleConImportes.forEach(({ importes }) => {
    subtotalBruto += importes.bruto;
    totalDescuentos += importes.descuentoMonto;
    totalImpuestos += importes.impuestoMonto;
    totalDocumento += importes.totalLinea;
  });

  const subtotalNeto = subtotalBruto - totalDescuentos;

  return {
    detalleConImportes,
    subtotalBruto,
    totalDescuentos,
    subtotalNeto,
    totalImpuestos,
    totalDocumento,
  };
}

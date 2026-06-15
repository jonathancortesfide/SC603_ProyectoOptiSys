export function formatMonto(valor, codigoMoneda = 'CRC') {
  const n = Number(valor);
  if (Number.isNaN(n)) return '—';
  try {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: codigoMoneda,
      minimumFractionDigits: 2,
    }).format(n);
  } catch {
    return n.toFixed(2);
  }
}

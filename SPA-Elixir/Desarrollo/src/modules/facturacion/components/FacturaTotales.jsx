import PropTypes from 'prop-types';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { formatMonto } from '../utils/formatMoneda';

const Row = ({ label, value, emphasize }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={2}>
    <Typography variant="body2" color={emphasize ? 'textPrimary' : 'textSecondary'}>
      {label}
    </Typography>
    <Typography variant={emphasize ? 'h6' : 'body2'} fontWeight={emphasize ? 700 : 400}>
      {value}
    </Typography>
  </Stack>
);

Row.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  emphasize: PropTypes.bool,
};

const FacturaTotales = ({ totales, monedaCodigo, totalPagos, diferenciaPagoVsTotal }) => {
  return (
    <Box>
      <Stack spacing={1}>
        <Row
          label="Subtotal bruto"
          value={formatMonto(totales.subtotalBruto, monedaCodigo)}
        />
        <Row
          label="Descuentos"
          value={`− ${formatMonto(totales.totalDescuentos, monedaCodigo)}`}
        />
        <Row
          label="Subtotal neto"
          value={formatMonto(totales.subtotalNeto, monedaCodigo)}
        />
        <Row
          label="Impuestos"
          value={formatMonto(totales.totalImpuestos, monedaCodigo)}
        />
        <Divider sx={{ my: 1 }} />
        <Row label="Total documento" value={formatMonto(totales.totalDocumento, monedaCodigo)} emphasize />
        <Divider sx={{ my: 1 }} />
        <Row label="Total pagos (referencia)" value={formatMonto(totalPagos, monedaCodigo)} />
        <Row
          label="Diferencia"
          value={formatMonto(diferenciaPagoVsTotal, monedaCodigo)}
          emphasize={Math.abs(diferenciaPagoVsTotal) > 0.01}
        />
      </Stack>
      {Math.abs(diferenciaPagoVsTotal) > 0.01 && (
        <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
          Los pagos no cuadran con el total del documento (solo referencia en borrador).
        </Typography>
      )}
    </Box>
  );
};

FacturaTotales.propTypes = {
  totales: PropTypes.shape({
    subtotalBruto: PropTypes.number,
    totalDescuentos: PropTypes.number,
    subtotalNeto: PropTypes.number,
    totalImpuestos: PropTypes.number,
    totalDocumento: PropTypes.number,
  }).isRequired,
  monedaCodigo: PropTypes.string,
  totalPagos: PropTypes.number,
  diferenciaPagoVsTotal: PropTypes.number,
};

FacturaTotales.defaultProps = {
  monedaCodigo: 'CRC',
  totalPagos: 0,
  diferenciaPagoVsTotal: 0,
};

export default FacturaTotales;

import PropTypes from 'prop-types';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { IconPlus, IconTrash } from '@tabler/icons';

const FacturaPagos = ({
  pagos,
  formasPago,
  monedaCodigoDocumento,
  tipoCambioSugerido,
  monedasSucursal,
  addPago,
  updatePago,
  removePago,
  aplicarFormaPago,
}) => {
  const handleNum =
    (id, field) =>
    (e) => {
      const raw = e.target.value;
      const n = raw === '' ? 0 : parseFloat(raw);
      updatePago(id, { [field]: Number.isNaN(n) ? 0 : n });
    };

  return (
    <Box>
      <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
        <Table
          size="small"
          sx={{
            tableLayout: 'fixed',
            width: '100%',
            minWidth: 0,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '34%', minWidth: 96, maxWidth: 180, py: 1 }}>
                Forma de pago
              </TableCell>
              <TableCell sx={{ width: 76, minWidth: 76, maxWidth: 76, py: 1 }}>Moneda</TableCell>
              <TableCell align="right" sx={{ width: 112, minWidth: 100, py: 1 }}>
                Monto
              </TableCell>
              <TableCell align="right" sx={{ width: 104, minWidth: 96, py: 1 }}>
                Tipo cambio
              </TableCell>
              <TableCell align="center" sx={{ width: 44, minWidth: 44, py: 1 }}>
                {' '}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagos.map((pago) => (
              <TableRow key={pago.id} hover>
                <TableCell sx={{ py: 1, verticalAlign: 'middle' }}>
                  <Autocomplete
                    size="small"
                    options={formasPago}
                    value={pago.formaPago}
                    onChange={(_, forma) => aplicarFormaPago(pago.id, forma)}
                    getOptionLabel={(f) => (f?.nombre ? f.nombre : '')}
                    isOptionEqualToValue={(a, b) => a?.id === b?.id}
                    sx={{ minWidth: 0, '& .MuiAutocomplete-inputRoot': { minWidth: 0 } }}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Forma…" />
                    )}
                  />
                </TableCell>
                <TableCell sx={{ py: 1, verticalAlign: 'middle', px: 0.75 }}>
                  <TextField
                    size="small"
                    select
                    fullWidth
                    label=""
                    value={pago.monedaCodigoPago ?? ''}
                    onChange={(e) => updatePago(pago.id, { monedaCodigoPago: e.target.value })}
                  >
                    <MenuItem value="">—</MenuItem>
                    {(monedasSucursal || [])
                      .filter((m) => m.activo !== false)
                      .map((m) => (
                        <MenuItem key={m.id} value={m.monedaCodigo}>
                          {m.monedaCodigo}
                        </MenuItem>
                      ))}
                    {/* fallback si no hay catálogo */}
                    {(!monedasSucursal || monedasSucursal.length === 0) && (
                      <>
                        <MenuItem value="CRC">CRC</MenuItem>
                        <MenuItem value="USD">USD</MenuItem>
                      </>
                    )}
                  </TextField>
                </TableCell>
                <TableCell align="right" sx={{ py: 1, verticalAlign: 'middle' }}>
                  <TextField
                    size="small"
                    type="number"
                    inputProps={{ step: 0.01, min: 0 }}
                    value={pago.monto}
                    onChange={handleNum(pago.id, 'monto')}
                    sx={{ maxWidth: '100%', width: '100%' }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ py: 1, verticalAlign: 'middle' }}>
                  {(() => {
                    const monPago = pago.monedaCodigoPago || monedaCodigoDocumento || 'CRC';
                    const disabled = monPago === 'CRC';
                    const value =
                      pago.tipoCambio !== undefined && pago.tipoCambio !== null
                        ? pago.tipoCambio
                        : tipoCambioSugerido;
                    return (
                      <TextField
                        size="small"
                        type="number"
                        inputProps={{ step: 0.0001, min: 0 }}
                        value={value}
                        onChange={handleNum(pago.id, 'tipoCambio')}
                        disabled={disabled}
                        sx={{ maxWidth: '100%', width: '100%' }}
                      />
                    );
                  })()}
                </TableCell>
                <TableCell align="center" sx={{ py: 0.5, verticalAlign: 'middle' }}>
                  <Tooltip title="Eliminar pago">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removePago(pago.id)}
                      aria-label="Eliminar pago"
                    >
                      <IconTrash size={18} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<IconPlus size={18} />}
          onClick={addPago}
        >
          Agregar forma de pago
        </Button>
      </Box>
    </Box>
  );
};

FacturaPagos.propTypes = {
  pagos: PropTypes.array.isRequired,
  formasPago: PropTypes.array.isRequired,
  monedaCodigoDocumento: PropTypes.string,
  tipoCambioSugerido: PropTypes.number,
  monedasSucursal: PropTypes.array,
  addPago: PropTypes.func.isRequired,
  updatePago: PropTypes.func.isRequired,
  removePago: PropTypes.func.isRequired,
  aplicarFormaPago: PropTypes.func.isRequired,
};

FacturaPagos.defaultProps = {
  monedaCodigoDocumento: 'CRC',
  tipoCambioSugerido: 1,
  monedasSucursal: [],
};

export default FacturaPagos;

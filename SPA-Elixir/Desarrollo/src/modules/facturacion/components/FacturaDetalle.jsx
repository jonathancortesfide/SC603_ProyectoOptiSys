import { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Stack,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { IconPlus, IconTrash } from '@tabler/icons';
import { formatMonto } from '../utils/formatMoneda';

const FacturaDetalle = ({
  detalle,
  detalleConImportes,
  productos,
  monedaCodigo,
  addLinea,
  updateLinea,
  removeLinea,
  aplicarProductoALinea,
}) => {
  const importesPorId = useMemo(() => {
    const m = new Map();
    (detalleConImportes || []).forEach((row) => {
      m.set(row.id, row.importes);
    });
    return m;
  }, [detalleConImportes]);

  const handleNum =
    (id, field) =>
    (e) => {
      const raw = e.target.value;
      const n = raw === '' ? 0 : parseFloat(raw);
      updateLinea(id, { [field]: Number.isNaN(n) ? 0 : n });
    };

  return (
    <Box>
      <Stack direction="row" spacing={1.5} justifyContent="space-between" alignItems="center" mb={1.5}>
        <Typography variant="body2" color="textSecondary">
          Agrega productos y ajusta cantidades, precios y descuentos. Los totales se recalculan en tiempo real.
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<IconPlus size={18} />}
          onClick={addLinea}
        >
          Agregar línea
        </Button>
      </Stack>

      <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'hidden' }}>
        <Table
          size="small"
          sx={{
            tableLayout: 'fixed',
            width: 1080,
            '& th, & td': { py: 0.5, px: 1 },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 320 }}>
                Producto
              </TableCell>
              <TableCell align="right" width={76}>
                Cant.
              </TableCell>
              <TableCell align="right" width={96}>
                Precio u.
              </TableCell>
              <TableCell align="right" width={72}>
                % Desc.
              </TableCell>
              <TableCell align="right" width={68}>
                % IVA
              </TableCell>
              <TableCell align="right" width={106}>
                Subtotal
              </TableCell>
              <TableCell align="right" width={98}>
                Impuesto
              </TableCell>
              <TableCell align="right" width={112}>
                Total
              </TableCell>
              <TableCell align="center" width={44}>
                {' '}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detalle.map((linea) => {
              const imp = importesPorId.get(linea.id);
              return (
                <TableRow key={linea.id} hover>
                  <TableCell sx={{ overflow: 'hidden' }}>
                    <Autocomplete
                      size="small"
                      options={productos}
                      value={linea.producto}
                      onChange={(_, p) => aplicarProductoALinea(linea.id, p)}
                      getOptionLabel={(p) =>
                        p ? `${p.codigoInterno ? `${p.codigoInterno} — ` : ''}${p.nombre}` : ''
                      }
                      isOptionEqualToValue={(a, b) => a?.id === b?.id}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Buscar producto…" />
                      )}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      size="small"
                      type="number"
                      inputProps={{ step: 0.01, min: 0 }}
                      value={linea.cantidad}
                      onChange={handleNum(linea.id, 'cantidad')}
                      sx={{ maxWidth: 76, ml: 'auto' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      size="small"
                      type="number"
                      inputProps={{ step: 0.01, min: 0 }}
                      value={linea.precioUnitario}
                      onChange={handleNum(linea.id, 'precioUnitario')}
                      sx={{ maxWidth: 96, ml: 'auto' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      size="small"
                      type="number"
                      inputProps={{ step: 0.01, min: 0, max: 100 }}
                      value={linea.descuentoPct}
                      onChange={handleNum(linea.id, 'descuentoPct')}
                      sx={{ maxWidth: 72, ml: 'auto' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      size="small"
                      type="number"
                      inputProps={{ step: 0.01, min: 0, max: 100 }}
                      value={linea.tasaImpuesto}
                      onChange={handleNum(linea.id, 'tasaImpuesto')}
                      sx={{ maxWidth: 68, ml: 'auto' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {imp ? formatMonto(imp.baseImponible, monedaCodigo) : '—'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {imp ? formatMonto(imp.impuestoMonto, monedaCodigo) : '—'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600}>
                      {imp ? formatMonto(imp.totalLinea, monedaCodigo) : '—'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Eliminar línea">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeLinea(linea.id)}
                        aria-label="Eliminar línea"
                      >
                        <IconTrash size={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

FacturaDetalle.propTypes = {
  detalle: PropTypes.array.isRequired,
  detalleConImportes: PropTypes.array,
  productos: PropTypes.array.isRequired,
  monedaCodigo: PropTypes.string,
  addLinea: PropTypes.func.isRequired,
  updateLinea: PropTypes.func.isRequired,
  removeLinea: PropTypes.func.isRequired,
  aplicarProductoALinea: PropTypes.func.isRequired,
};

FacturaDetalle.defaultProps = {
  detalleConImportes: [],
  monedaCodigo: 'CRC',
};

export default FacturaDetalle;

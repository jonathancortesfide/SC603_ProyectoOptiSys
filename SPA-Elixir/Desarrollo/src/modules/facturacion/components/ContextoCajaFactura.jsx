import PropTypes from 'prop-types';
import {
  Box,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

const ContextoCajaFactura = ({
  maestro,
  updateMaestro,
  cajas,
  cierresCaja,
  monedasSucursal,
  mostrarResumen,
}) => {
  const handle =
    (field) =>
    (e) => {
      updateMaestro({ [field]: e.target.value });
    };

  const cajaActiva = (cajas || []).find((c) => String(c.id) === String(maestro.cajaId));
  const cierreActivo = (cierresCaja || []).find((c) => String(c.id) === String(maestro.cierreCajaId));
  const moneda = (monedasSucursal || []).find((m) => m.monedaCodigo === maestro.monedaCodigo);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Caja"
            size="small"
            fullWidth
            select
            value={maestro.cajaId ?? ''}
            onChange={handle('cajaId')}
          >
            <MenuItem value="">—</MenuItem>
            {(cajas || []).map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.noCaja} · {c.estado}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={8}>
          <TextField
            label="Cierre de caja"
            size="small"
            fullWidth
            select
            value={maestro.cierreCajaId ?? ''}
            onChange={handle('cierreCajaId')}
          >
            <MenuItem value="">—</MenuItem>
            {(cierresCaja || []).map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.noCierre} · {c.noCaja} · {c.estado}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {mostrarResumen ? (
        <Box mt={1.5}>
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
            Contexto (prototipo)
          </Typography>
          <Typography variant="body2">
            Caja: <b>{cajaActiva ? `${cajaActiva.noCaja} (${cajaActiva.estado})` : '—'}</b>{' '}
            · Cierre:{' '}
            <b>{cierreActivo ? `${cierreActivo.noCierre} (${cierreActivo.estado})` : '—'}</b>{' '}
            · Moneda:{' '}
            <b>{maestro.monedaCodigo}</b>{' '}
            {moneda?.tasaCambio ? (
              <span style={{ color: 'rgba(0,0,0,0.6)' }}>
                · Ref TC: {Number(moneda.tasaCambio).toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </span>
            ) : null}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};

ContextoCajaFactura.propTypes = {
  maestro: PropTypes.object.isRequired,
  updateMaestro: PropTypes.func.isRequired,
  cajas: PropTypes.array,
  cierresCaja: PropTypes.array,
  monedasSucursal: PropTypes.array,
  mostrarResumen: PropTypes.bool,
};

ContextoCajaFactura.defaultProps = {
  cajas: [],
  cierresCaja: [],
  monedasSucursal: [],
  mostrarResumen: true,
};

export default ContextoCajaFactura;


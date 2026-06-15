import { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Divider,
  Stack,
  Typography,
  TextField,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

const PacienteCuentaSelector = ({
  paciente,
  cuenta,
  onChange,
  cuentasDisponibles,
  monedasSucursal,
  monedaCodigoDocumento,
  disabled = false,
}) => {
  const monedasPorId = useMemo(() => {
    const m = new Map();
    (monedasSucursal || []).forEach((x) => m.set(x.id, x));
    return m;
  }, [monedasSucursal]);

  const etiquetaCuenta = (c) => {
    if (!c) return '';
    const mon = monedasPorId.get(c.idMoneda);
    const cod = mon?.monedaCodigo || '—';
    return `${c.noCuenta || `Cuenta ${c.id}`} — ${cod}`;
  };

  const saldoTexto = useMemo(() => {
    if (!cuenta) return '—';
    const mon = monedasPorId.get(cuenta.idMoneda);
    const cod = mon?.monedaCodigo || '—';
    const saldo = Number(cuenta.saldo) || 0;
    return `${saldo.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${cod}`;
  }, [cuenta, monedasPorId]);

  const monedaCuenta = useMemo(() => {
    if (!cuenta) return null;
    const mon = monedasPorId.get(cuenta.idMoneda);
    return mon?.monedaCodigo || null;
  }, [cuenta, monedasPorId]);

  const warningMoneda =
    Boolean(monedaCuenta) &&
    Boolean(monedaCodigoDocumento) &&
    monedaCuenta !== monedaCodigoDocumento;

  return (
    <Box>
      <Stack spacing={1.5}>
        <Autocomplete
          size="small"
          options={cuentasDisponibles}
          value={cuenta}
          onChange={(_, c) => onChange(c)}
          disabled={disabled || !paciente}
          getOptionLabel={(c) => etiquetaCuenta(c)}
          isOptionEqualToValue={(a, b) => a?.id === b?.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cuenta del paciente"
              placeholder={paciente ? 'Seleccionar cuenta…' : 'Seleccione paciente primero…'}
            />
          )}
          renderOption={(props, option) => {
            const mon = monedasPorId.get(option.idMoneda);
            const cod = mon?.monedaCodigo || '—';
            const saldo = Number(option.saldo) || 0;
            return (
              <li {...props} key={option.id}>
                <Box>
                  <Typography variant="body2">
                    {option.noCuenta || `Cuenta ${option.id}`} · {cod}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Saldo: {saldo.toLocaleString(undefined, { maximumFractionDigits: 2 })} {cod}
                  </Typography>
                </Box>
              </li>
            );
          }}
        />

        <Divider />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
          <Box>
            <Typography variant="caption" color="textSecondary">
              Paciente
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {paciente?.nombre || '—'}
            </Typography>
          </Box>
          <Box textAlign={{ xs: 'left', sm: 'right' }}>
            <Typography variant="caption" color="textSecondary">
              Saldo cuenta
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {saldoTexto}
            </Typography>
          </Box>
        </Stack>

        {warningMoneda && (
          <Typography variant="caption" color="warning.main">
            La moneda de la cuenta ({monedaCuenta}) no coincide con la del documento ({monedaCodigoDocumento}).
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

PacienteCuentaSelector.propTypes = {
  paciente: PropTypes.object,
  cuenta: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  cuentasDisponibles: PropTypes.array,
  monedasSucursal: PropTypes.array,
  monedaCodigoDocumento: PropTypes.string,
  disabled: PropTypes.bool,
};

PacienteCuentaSelector.defaultProps = {
  cuentasDisponibles: [],
  monedasSucursal: [],
  monedaCodigoDocumento: 'CRC',
  disabled: false,
};

export default PacienteCuentaSelector;


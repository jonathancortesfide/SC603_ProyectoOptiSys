import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Alert,
} from '@mui/material';
import { IconTrash, IconPlus } from '@tabler/icons';

const CuentasTab = ({ paciente, onUpdate, hideGuardarButton = false }) => {
  const [cuentas, setCuentas] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [monedaNacional, setMonedaNacional] = useState('CRC');
  const [nuevaMoneda, setNuevaMoneda] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    cargarMonedas();
    cargarParametroMonedaNacional();
    if (paciente) {
      cargarCuentasPaciente();
    }
  }, [paciente]);

  const cargarMonedas = async () => {
    // Mock - En producción llamar al API de tabla Moneda
    setMonedas([
      { codigo: 'CRC', nombre: 'Colones' },
      { codigo: 'USD', nombre: 'Dólares' },
      { codigo: 'EUR', nombre: 'Euros' },
    ]);
  };

  const cargarParametroMonedaNacional = async () => {
    // Mock - En producción llamar al API de tabla Parametro
    // WHERE no_parametro = 2 AND identificador = [identificador_sistema]
    // El valor retornado es el código de moneda nacional
    setMonedaNacional('CRC');
  };

  const cargarCuentasPaciente = async () => {
    // Mock - En producción llamar al API para obtener cuentas del paciente
    if (paciente.cuentas && paciente.cuentas.length > 0) {
      setCuentas(paciente.cuentas);
    } else {
      // Si es nuevo paciente, agregar automáticamente la moneda nacional
      setCuentas([
        {
          moneda: monedaNacional,
          esNacional: true,
        },
      ]);
    }
  };

  const handleAgregarCuenta = () => {
    setError('');
    
    if (!nuevaMoneda) {
      setError('Seleccione una moneda');
      return;
    }

    if (cuentas.some((c) => c.moneda === nuevaMoneda)) {
      setError('Ya existe una cuenta con esta moneda');
      return;
    }

    const saldo = parseFloat(nuevoSaldo) || 0;
    setCuentas([
      ...cuentas,
      {
        moneda: nuevaMoneda,
        esNacional: false,
      },
    ]);

    setNuevaMoneda('');
    setSuccess('Cuenta agregada correctamente');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEliminarCuenta = (index) => {
    const cuenta = cuentas[index];
    
    // No permitir eliminar la moneda nacional
    if (cuenta.moneda === monedaNacional || cuenta.esNacional) {
      setError('No se puede eliminar la cuenta en moneda nacional');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setCuentas(cuentas.filter((_, i) => i !== index));
    setSuccess('Cuenta eliminada correctamente');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleGuardar = async () => {
    // Aquí se debe llamar al API para guardar las cuentas
    setSuccess('Cuentas guardadas correctamente');
    setTimeout(() => setSuccess(''), 3000);
    if (onUpdate) onUpdate();
  };

  const monedasDisponibles = monedas.filter(
    (m) => !cuentas.some((c) => c.moneda === m.codigo)
  );

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Typography variant="h6" gutterBottom>
        Cuentas por Moneda
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        La cuenta en moneda nacional ({monedaNacional}) es obligatoria y no se puede eliminar.
      </Typography>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Moneda</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cuentas.length > 0 ? (
              cuentas.map((cuenta, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {cuenta.moneda}
                    {(cuenta.esNacional || cuenta.moneda === monedaNacional) && (
                      <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                        (Nacional)
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleEliminarCuenta(index)}
                      disabled={cuenta.esNacional || cuenta.moneda === monedaNacional}
                    >
                      <IconTrash size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No hay cuentas registradas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {monedasDisponibles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Agregar Nueva Cuenta
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Moneda</InputLabel>
                <Select
                  value={nuevaMoneda}
                  label="Moneda"
                  onChange={(e) => setNuevaMoneda(e.target.value)}
                >
                  <MenuItem value="">Seleccione</MenuItem>
                  {monedasDisponibles.map((moneda) => (
                    <MenuItem key={moneda.codigo} value={moneda.codigo}>
                      {moneda.codigo} - {moneda.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<IconPlus />}
                onClick={handleAgregarCuenta}
              >
                Agregar
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {!hideGuardarButton && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleGuardar}>
            Guardar Cuentas
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CuentasTab;

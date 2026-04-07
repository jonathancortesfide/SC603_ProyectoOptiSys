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
import { obtenerCuentasDePaciente } from '../../../requests/pacientes/RequestsPacientes';
import { obtenerListaDeMonedas } from '../../../requests/mantenimientos/moneda/RequestsMonedas';

const CuentasTab = ({ paciente, onUpdate, onChange, hideGuardarButton = false }) => {
  const [cuentas, setCuentas] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [monedaNacional, setMonedaNacional] = useState('CRC');
  const [nuevaMoneda, setNuevaMoneda] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    cargarMonedas();
  }, []);

  useEffect(() => {
    if (paciente) {
      cargarCuentasPaciente();
    }
  }, [paciente?.numeroDePaciente, paciente?.id, monedaNacional]);

  const cargarMonedas = async () => {
    const data = await obtenerListaDeMonedas();
    const lista = Array.isArray(data) ? data : (data?.laListaDeMonedas || []);
    const monedasApi = lista.map((item) => ({
      codigo: item.codigoIso || item.codigo_iso || item.codigo || item.moneda || item.descripcion,
      nombre: item.descripcion || item.nombre || item.codigoIso || item.codigo,
      esNacional: item.esNacional || item.es_nacional || false,
    })).filter((item) => item.codigo);

    if (monedasApi.length > 0) {
      setMonedas(monedasApi);
      const monedaDefault = monedasApi.find((item) => item.esNacional)?.codigo || monedasApi.find((item) => item.codigo === 'CRC')?.codigo || monedasApi[0].codigo;
      setMonedaNacional(monedaDefault);
      return;
    }

    setMonedas([]);
    setMonedaNacional('CRC');
  };

  const cargarCuentasPaciente = async () => {
    if (paciente?.numeroDePaciente) {
      const data = await obtenerCuentasDePaciente(paciente.numeroDePaciente);
      if (Array.isArray(data) && data.length > 0) {
        setCuentas(data);
        onChange?.({ cuentas: data });
        return;
      }
    }

    if (paciente?.cuentas && paciente.cuentas.length > 0) {
      setCuentas(paciente.cuentas);
    } else {
      const cuentasIniciales = [
        {
          moneda: monedaNacional,
          esNacional: true,
        },
      ];
      setCuentas(cuentasIniciales);
      onChange?.({ cuentas: cuentasIniciales });
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

    const nuevasCuentas = [
      ...cuentas,
      {
        moneda: nuevaMoneda,
        esNacional: false,
      },
    ];

    setCuentas(nuevasCuentas);
    onChange?.({ cuentas: nuevasCuentas });

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

    const nuevasCuentas = cuentas.filter((_, i) => i !== index);
    setCuentas(nuevasCuentas);
    onChange?.({ cuentas: nuevasCuentas });
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

import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Box,
  Alert,
  FormControlLabel,
  Checkbox,
  Typography,
  Autocomplete,
} from '@mui/material';
import { obtenerListaDeListasPrecios } from '../../../requests/mantenimientos/ListaPrecio/RequestsListaPrecio';
import { obtenerListaDeClasificacionesPacientes } from '../../../requests/mantenimientos/clasificacionPacientes/RequestsClasificacionPacientes';

const InformacionAdicional = ({ paciente, onUpdate, onChange, hideGuardarButton = false }) => {
  const [form, setForm] = useState({
    listaPrecio: '',
    clasificacion: '',
    clienteActivo: true,
    observaciones: '',
    plazo: '',
    limiteCredito: '',
    bloqueoFacturasCredito: false,
    bloqueoFacturasContado: false,
    permitirFacturasSaldoVencido: false,
    enviaCumpleanos: false,
    formatoFacturaEspecial: false,
  });

  const [listasPrecios, setListasPrecios] = useState([]);
  const [clasificaciones, setClasificaciones] = useState([]);
  const [success, setSuccess] = useState('');

  const mapFormToPaciente = (nextForm) => ({
    listaPrecio: nextForm.listaPrecio,
    clasificacion: nextForm.clasificacion,
    clienteActivo: nextForm.clienteActivo,
    esActivo: nextForm.clienteActivo,
    observaciones: nextForm.observaciones,
    plazo: nextForm.plazo,
    limiteCredito: nextForm.limiteCredito,
    bloqueoFacturasCredito: nextForm.bloqueoFacturasCredito,
    bloqueoFacturasContado: nextForm.bloqueoFacturasContado,
    permitirFacturasSaldoVencido: nextForm.permitirFacturasSaldoVencido,
    enviaCumpleanos: nextForm.enviaCumpleanos,
    formatoFacturaEspecial: nextForm.formatoFacturaEspecial,
  });

  const updateForm = (changes) => {
    setForm((prev) => {
      const next = { ...prev, ...changes };
      onChange?.(mapFormToPaciente(next));
      return next;
    });
  };

  useEffect(() => {
    if (paciente) {
      setForm({
        listaPrecio: paciente.listaPrecio || '',
        clasificacion: paciente.clasificacion || '',
        clienteActivo: paciente.clienteActivo !== false,
        observaciones: paciente.observaciones || '',
        plazo: paciente.plazo || '',
        limiteCredito: paciente.limiteCredito || '',
        bloqueoFacturasCredito: paciente.bloqueoFacturasCredito || false,
        bloqueoFacturasContado: paciente.bloqueoFacturasContado || false,
        permitirFacturasSaldoVencido: paciente.permitirFacturasSaldoVencido || false,
        enviaCumpleanos: paciente.enviaCumpleanos || false,
        formatoFacturaEspecial: paciente.formatoFacturaEspecial || false,
      });
    }
    cargarListasPrecios();
    cargarClasificaciones();
  }, [paciente?.numeroDePaciente, paciente?.id]);

  const cargarListasPrecios = async () => {
    const data = await obtenerListaDeListasPrecios();
    if (data && Array.isArray(data) && data.length > 0) {
      setListasPrecios(data.map((item) => ({ id: item.id, nombre: item.nombre || item.descripcion || item.Nombre })));
    } else {
      setListasPrecios([
        { id: 1, nombre: 'Estándar' },
        { id: 2, nombre: 'Premium' },
        { id: 3, nombre: 'Mayoreo' },
        { id: 4, nombre: 'VIP' },
      ]);
    }
  };

  const cargarClasificaciones = async () => {
    const data = await obtenerListaDeClasificacionesPacientes();
    if (data && Array.isArray(data) && data.length > 0) {
      setClasificaciones(data.map((item) => ({ id: item.id, nombre: item.nombre || item.descripcion })));
      return;
    }

    setClasificaciones([]);
  };

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    updateForm({ [field]: value });
  };

  const handleGuardar = async () => {
    // Aquí se debe llamar al API para actualizar
    setSuccess('Información adicional actualizada correctamente');
    setTimeout(() => setSuccess(''), 3000);
    if (onUpdate) onUpdate();
  };

  return (
    <Box>
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Datos de Crédito
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            freeSolo
            size="small"
            options={listasPrecios.map((lista) => lista.nombre)}
            value={form.listaPrecio || ''}
            onChange={(event, newValue) => {
              updateForm({ listaPrecio: newValue || '' });
            }}
            inputValue={form.listaPrecio}
            onInputChange={(event, newInputValue) => {
              updateForm({ listaPrecio: newInputValue });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Lista de Precio"
                placeholder="Escriba o seleccione..."
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            freeSolo
            size="small"
            options={clasificaciones.map((clasificacion) => clasificacion.nombre)}
            value={form.clasificacion || ''}
            onChange={(event, newValue) => {
              updateForm({ clasificacion: newValue || '' });
            }}
            inputValue={form.clasificacion}
            onInputChange={(event, newInputValue) => {
              updateForm({ clasificacion: newInputValue });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Clasificación del Paciente"
                placeholder="Escriba o seleccione..."
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.clienteActivo}
                onChange={handleChange('clienteActivo')}
              />
            }
            label="Cliente Activo"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2, mb: 2 }}>
            Datos de Crédito
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Plazo (días)"
            value={form.plazo}
            onChange={handleChange('plazo')}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Límite de Crédito"
            value={form.limiteCredito}
            onChange={handleChange('limiteCredito')}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
            Opciones de Facturación
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.bloqueoFacturasCredito}
                onChange={handleChange('bloqueoFacturasCredito')}
              />
            }
            label="Bloqueo de facturas a crédito"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.bloqueoFacturasContado}
                onChange={handleChange('bloqueoFacturasContado')}
              />
            }
            label="Bloqueo de facturas al contado"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.permitirFacturasSaldoVencido}
                onChange={handleChange('permitirFacturasSaldoVencido')}
              />
            }
            label="Permitir facturas con saldo vencido"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
            Observaciones
          </Typography>
          <TextField
            fullWidth
            size="small"
            label="Observaciones"
            value={form.observaciones}
            onChange={handleChange('observaciones')}
            multiline
            rows={4}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.enviaCumpleanos}
                onChange={handleChange('enviaCumpleanos')}
              />
            }
            label="Envía mensaje de cumpleaños"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.formatoFacturaEspecial}
                onChange={handleChange('formatoFacturaEspecial')}
              />
            }
            label="Formato de factura especial"
          />
        </Grid>

        {!hideGuardarButton && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button variant="contained" onClick={handleGuardar}>
                Guardar Cambios
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default InformacionAdicional;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { IconChevronDown } from '@tabler/icons';
import { AgregarPaciente, obtenerCuentasDePaciente } from '../../requests/pacientes/RequestsPacientes';

const tiposIdentificacion = [
  { value: 'fisica', label: 'Cédula física' },
  { value: 'juridica', label: 'Cédula jurídica' },
  { value: 'pasaporte', label: 'Pasaporte' },
];

const FormularioPaciente = ({ paciente, modoEdicion, onGuardar, onCancel }) => {
  const [form, setForm] = useState({
    tipoIdentificacion: 'fisica',
    identificacion: '',
    nombre: '',
    nombreComercial: '',
    direccion: '',
    fechaNacimiento: '',
    email1: '',
    email2: '',
    telefono1: '',
    telefono2: '',
    sexo: '',
    esEmpadronado: false,
    listaPrecio: '',
    esActivo: true,
    // fiscal
    codigoActividadEconomica: '',
    esValidadoHacienda: false,
    noEnviaFacturaElectronica: false,
    // credito
    plazo: 0,
    limiteCredito: 0,
    bloqueoFacturasCredito: false,
    permitirFacturasSaldoVencido: false,
    // cuentas multi-moneda
    cuentas: [],
    // emergencia
    contactoEmergenciaNombre: '',
    contactoEmergenciaTelefono: '',
    // especiales
    observaciones: '',
    bloqueoFacturasContado: false,
    clasificacion: '',
    nacionalidad: '',
    formatoFacturaEspecial: false,
    enviaCumpleanos: true,
  });

  useEffect(() => {
    if (paciente) {
      setForm((prev) => ({ ...prev, ...paciente }));
      // Prefill cuentas: if paciente object didn't include cuentas, try fetching them
      (async () => {
        try {
          if (paciente.id && (!paciente.cuentas || paciente.cuentas.length === 0)) {
            const cuentas = await obtenerCuentasDePaciente(paciente.id);
            if (cuentas && cuentas.length) {
              setForm((prev) => ({ ...prev, cuentas }));
            }
          }
        } catch (err) {
          console.warn('No se pudieron obtener cuentas de paciente', err);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paciente]);

  const handleChange = (key) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [key]: value }));
  };

  const monedaOptions = [
    { value: 'CRC', label: 'Colones (CRC)' },
    { value: 'USD', label: 'Dólares (USD)' },
    { value: 'EUR', label: 'Euros (EUR)' },
  ];

  const handleAddCuenta = () => {
    setForm((s) => ({ ...s, cuentas: [...(s.cuentas || []), { moneda: 'CRC', saldo: 0 }] }));
  };

  

  const handleRemoveCuenta = (index) => () => {
    setForm((s) => ({ ...s, cuentas: (s.cuentas || []).filter((_, i) => i !== index) }));
  };

  const handleCuentaChange = (index, key) => (e) => {
    const value = e?.target?.type === 'number' ? (e.target.value === '' ? '' : parseFloat(e.target.value)) : e.target.value;
    setForm((s) => {
      const cuentas = [...(s.cuentas || [])];
      cuentas[index] = { ...cuentas[index], [key]: value };
      return { ...s, cuentas };
    });
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!form.identificacion || !form.nombre) {
      alert('Identificación y nombre son obligatorios');
      return;
    }

    // CUENTAS validations: unique currency and saldo >= 0
    const errores = [];
    if (form.cuentas && form.cuentas.length) {
      const seen = new Set();
      form.cuentas.forEach((c, idx) => {
        if (!c || !c.moneda) errores.push(`Cuenta #${idx + 1}: moneda es obligatoria`);
        if (c && (c.saldo === '' || c.saldo === null || isNaN(Number(c.saldo)))) errores.push(`Cuenta #${idx + 1}: saldo inválido`);
        if (c && Number(c.saldo) < 0) errores.push(`Cuenta #${idx + 1}: saldo no puede ser negativo`);
        if (c && c.moneda) {
          if (seen.has(c.moneda)) errores.push(`Cuenta #${idx + 1}: moneda '${c.moneda}' duplicada`);
          seen.add(c.moneda);
        }
      });
    }

    if (errores.length) {
      alert('Errores en cuentas:\n' + errores.join('\n'));
      return;
    }

    // For now use AgregarPaciente for both create and edit if API supports upsert
    const payload = { ...form };
    try {
      const res = await AgregarPaciente(payload);
      if (res && res.EsCorrecto !== false) {
        onGuardar && onGuardar();
      } else {
        alert(res?.Mensaje || 'Error al guardar paciente');
      }
    } catch (err) {
      console.error(err);
      alert('Error al guardar paciente');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {modoEdicion ? 'Editar paciente' : 'Crear nuevo paciente'}
      </Typography>

      {/* DATOS GENERALES */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<IconChevronDown />}>
          <Typography variant="subtitle1" fontWeight={500}>Datos generales</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField 
                select 
                label="Tipo identificación *" 
                fullWidth 
                size="small" 
                value={form.tipoIdentificacion} 
                onChange={handleChange('tipoIdentificacion')}
              >
                {tiposIdentificacion.map((t) => (
                  <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField 
                label="Identificación *" 
                fullWidth 
                size="small" 
                value={form.identificacion} 
                onChange={handleChange('identificacion')} 
              />
            </Grid>

            <Grid item xs={12} sm={form.tipoIdentificacion === 'juridica' ? 6 : 12}>
              <TextField 
                label="Nombre *" 
                fullWidth 
                size="small" 
                value={form.nombre} 
                onChange={handleChange('nombre')} 
              />
            </Grid>
            {form.tipoIdentificacion === 'juridica' && (
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Nombre comercial" 
                  fullWidth 
                  size="small" 
                  value={form.nombreComercial} 
                  onChange={handleChange('nombreComercial')} 
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField 
                label="Dirección" 
                fullWidth 
                size="small" 
                value={form.direccion} 
                onChange={handleChange('direccion')} 
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField 
                label="Fecha de nacimiento" 
                type="date" 
                fullWidth 
                size="small" 
                InputLabelProps={{ shrink: true }} 
                value={form.fechaNacimiento} 
                onChange={handleChange('fechaNacimiento')} 
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField 
                label="Edad" 
                fullWidth 
                size="small" 
                value={form.fechaNacimiento ? Math.max(0, new Date().getFullYear() - new Date(form.fechaNacimiento).getFullYear()) : ''} 
                disabled 
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField 
                label="Sexo" 
                select
                fullWidth 
                size="small" 
                value={form.sexo} 
                onChange={handleChange('sexo')}
              >
                <MenuItem value="M">Masculino</MenuItem>
                <MenuItem value="F">Femenino</MenuItem>
                <MenuItem value="">No especifica</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField 
                label="Nacionalidad" 
                fullWidth 
                size="small" 
                value={form.nacionalidad} 
                onChange={handleChange('nacionalidad')} 
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* CUENTAS MULTI-MONEDA */}
      <Accordion>
        <AccordionSummary expandIcon={<IconChevronDown />}>
          <Typography variant="subtitle1" fontWeight={500}>Cuentas (multimoneda)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {(form.cuentas || []).map((c, idx) => (
              <Grid container item spacing={1} key={idx} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    label={`Moneda #${idx + 1}`}
                    fullWidth
                    size="small"
                    value={c.moneda || ''}
                    onChange={handleCuentaChange(idx, 'moneda')}
                  >
                    {monedaOptions.map((m) => (
                      <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Saldo"
                    type="number"
                    fullWidth
                    size="small"
                    value={c.saldo === '' ? '' : c.saldo}
                    onChange={handleCuentaChange(idx, 'saldo')}
                    inputProps={{ min: 0, step: '0.01' }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button variant="outlined" color="error" size="small" onClick={handleRemoveCuenta(idx)}>
                    Eliminar
                  </Button>
                </Grid>
              </Grid>
            ))}

            <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" color="primary" onClick={handleAddCuenta}>
                Agregar cuenta
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      

      {/* DATOS DE CONTACTO */}
      <Accordion>
        <AccordionSummary expandIcon={<IconChevronDown />}>
          <Typography variant="subtitle1" fontWeight={500}>Datos de contacto</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="Email principal" 
                type="email"
                fullWidth 
                size="small" 
                value={form.email1} 
                onChange={handleChange('email1')} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="Email secundario" 
                type="email"
                fullWidth 
                size="small" 
                value={form.email2} 
                onChange={handleChange('email2')} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="Teléfono principal" 
                fullWidth 
                size="small" 
                value={form.telefono1} 
                onChange={handleChange('telefono1')} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="Teléfono secundario" 
                fullWidth 
                size="small" 
                value={form.telefono2} 
                onChange={handleChange('telefono2')} 
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* DATOS COMERCIALES */}
      <Accordion>
        <AccordionSummary expandIcon={<IconChevronDown />}>
          <Typography variant="subtitle1" fontWeight={500}>Datos comerciales</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="Lista de precio" 
                fullWidth 
                size="small" 
                value={form.listaPrecio} 
                onChange={handleChange('listaPrecio')} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="Clasificación del paciente" 
                fullWidth 
                size="small" 
                value={form.clasificacion} 
                onChange={handleChange('clasificacion')} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel 
                control={<Checkbox checked={form.esEmpadronado} onChange={handleChange('esEmpadronado')} />} 
                label="Es empadronado" 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel 
                control={<Checkbox checked={form.esActivo} onChange={handleChange('esActivo')} />} 
                label="Paciente activo" 
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* DATOS FISCALES */}
      <Accordion>
        <AccordionSummary expandIcon={<IconChevronDown />}>
          <Typography variant="subtitle1" fontWeight={500}>Datos fiscales</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="Código actividad económica" 
                fullWidth 
                size="small" 
                value={form.codigoActividadEconomica} 
                onChange={handleChange('codigoActividadEconomica')} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel 
                control={<Checkbox checked={form.esValidadoHacienda} onChange={handleChange('esValidadoHacienda')} />} 
                label="Validado por Hacienda" 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel 
                control={<Checkbox checked={form.noEnviaFacturaElectronica} onChange={handleChange('noEnviaFacturaElectronica')} />} 
                label="No envía factura electrónica" 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel 
                control={<Checkbox checked={form.formatoFacturaEspecial} onChange={handleChange('formatoFacturaEspecial')} />} 
                label="Formato de factura especial" 
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* DATOS DE CRÉDITO */}
      <Accordion>
        <AccordionSummary expandIcon={<IconChevronDown />}>
          <Typography variant="subtitle1" fontWeight={500}>Datos de crédito</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="Plazo (días)" 
                type="number" 
                fullWidth 
                size="small" 
                value={form.plazo} 
                onChange={handleChange('plazo')} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="Límite de crédito" 
                type="number" 
                fullWidth 
                size="small" 
                value={form.limiteCredito} 
                onChange={handleChange('limiteCredito')} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel 
                control={<Checkbox checked={form.bloqueoFacturasCredito} onChange={handleChange('bloqueoFacturasCredito')} />} 
                label="Bloqueo facturas de crédito" 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel 
                control={<Checkbox checked={form.permitirFacturasSaldoVencido} onChange={handleChange('permitirFacturasSaldoVencido')} />} 
                label="Permitir facturas con saldo vencido" 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel 
                control={<Checkbox checked={form.bloqueoFacturasContado} onChange={handleChange('bloqueoFacturasContado')} />} 
                label="Bloqueo facturas de contado" 
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* CONTACTO DE EMERGENCIA */}
      <Accordion>
        <AccordionSummary expandIcon={<IconChevronDown />}>
          <Typography variant="subtitle1" fontWeight={500}>Contacto en caso de emergencia</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="Nombre del contacto" 
                fullWidth 
                size="small" 
                value={form.contactoEmergenciaNombre} 
                onChange={handleChange('contactoEmergenciaNombre')} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="Teléfono del contacto" 
                fullWidth 
                size="small" 
                value={form.contactoEmergenciaTelefono} 
                onChange={handleChange('contactoEmergenciaTelefono')} 
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* DATOS ESPECIALES */}
      <Accordion>
        <AccordionSummary expandIcon={<IconChevronDown />}>
          <Typography variant="subtitle1" fontWeight={500}>Datos especiales</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                label="Observaciones" 
                fullWidth 
                multiline 
                rows={3} 
                size="small" 
                value={form.observaciones} 
                onChange={handleChange('observaciones')} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel 
                control={<Checkbox checked={form.enviaCumpleanos} onChange={handleChange('enviaCumpleanos')} />} 
                label="Envía mensaje de cumpleaños" 
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* BOTONES DE ACCIÓN */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {modoEdicion ? 'Guardar cambios' : 'Crear paciente'}
        </Button>
      </Box>
    </Box>
  );
};

export default FormularioPaciente;

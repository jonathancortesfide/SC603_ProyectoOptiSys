import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Alert,
  FormControlLabel,
  Checkbox,
  Autocomplete,
} from '@mui/material';

const TIPOS_IDENTIFICACION = [
  { value: 'fisica', label: 'Cédula física' },
  { value: 'juridica', label: 'Cédula jurídica' },
  { value: 'dimex', label: 'DIMEX' },
  { value: 'nite', label: 'NITE' },
  { value: 'pasaporte', label: 'Pasaporte' },
];

const SEXOS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'O', label: 'Otro' },
];

const InformacionBasica = ({ paciente, onUpdate, onChange, hideGuardarButton = false }) => {
  const [form, setForm] = useState({
    tipoIdentificacion: 'fisica',
    identificacion: '',
    nombre: '',
    direccion: '',
    fechaNacimiento: '',
    sexo: '',
    telefono1: '',
    telefono2: '',
    email1: '',
    nacionalidad: '',
    contactoEmergenciaNombre: '',
    contactoEmergenciaTelefono: '',
    noEnviaFacturaElectronica: false,
  });

  const [nacionalidades, setNacionalidades] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [edad, setEdad] = useState('');

  const mapFormToPaciente = (nextForm) => ({
    tipoIdentificacion: nextForm.tipoIdentificacion,
    identificacion: nextForm.identificacion,
    cedula: nextForm.identificacion,
    nombre: nextForm.nombre,
    direccion: nextForm.direccion,
    fechaNacimiento: nextForm.fechaNacimiento,
    sexo: nextForm.sexo,
    telefono1: nextForm.telefono1,
    telefono2: nextForm.telefono2,
    email1: nextForm.email1,
    email: nextForm.email1,
    nacionalidad: nextForm.nacionalidad,
    contactoEmergenciaNombre: nextForm.contactoEmergenciaNombre,
    contactoEmergenciaTelefono: nextForm.contactoEmergenciaTelefono,
    noEnviaFacturaElectronica: nextForm.noEnviaFacturaElectronica,
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
      const fechaNac = paciente.fechaNacimiento || '';
      setForm({
        tipoIdentificacion: paciente.tipoIdentificacion || 'fisica',
        identificacion: paciente.identificacion || paciente.cedula || '',
        nombre: paciente.nombre || '',
        direccion: paciente.direccion || '',
        fechaNacimiento: fechaNac,
        sexo: paciente.sexo || '',
        telefono1: paciente.telefono1 || '',
        telefono2: paciente.telefono2 || '',
        email1: paciente.email1 || paciente.email || '',
        nacionalidad: paciente.nacionalidad || '',
        contactoEmergenciaNombre: paciente.contactoEmergenciaNombre || '',
        contactoEmergenciaTelefono: paciente.contactoEmergenciaTelefono || '',
        noEnviaFacturaElectronica: paciente.noEnviaFacturaElectronica || false,
      });
      if (fechaNac) {
        calcularEdad(fechaNac);
      }
    }
    cargarNacionalidades();
  }, [paciente?.numeroDePaciente, paciente?.id]);

  const cargarNacionalidades = async () => {
    // Mock data - En producción debe llamar al API de tabla Pais
    setNacionalidades([
      { id: 1, nombre: 'Costarricense' },
      { id: 2, nombre: 'Nicaragüense' },
      { id: 3, nombre: 'Panameño' },
      { id: 4, nombre: 'Colombiano' },
      { id: 5, nombre: 'Venezolano' },
      { id: 6, nombre: 'Estadounidense' },
      { id: 7, nombre: 'Otro' },
    ]);
  };

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    updateForm({ [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }

    // Calcular edad si el campo es fechaNacimiento
    if (field === 'fechaNacimiento' && value) {
      calcularEdad(value);
    }
  };

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edadCalculada = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edadCalculada--;
    }
    
    setEdad(edadCalculada.toString());
  };

  const handleGuardar = async () => {
    const newErrors = {};
    if (!form.identificacion) newErrors.identificacion = 'Identificación es obligatoria';
    if (!form.nombre) newErrors.nombre = 'Nombre es obligatorio';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Aquí se debe llamar al API para actualizar
    setSuccess('Información actualizada correctamente');
    setTimeout(() => setSuccess(''), 3000);
    if (onUpdate) onUpdate();
  };

  return (
    <Box>
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Tipo Identificación *</InputLabel>
            <Select
              value={form.tipoIdentificacion}
              label="Tipo Identificación *"
              onChange={handleChange('tipoIdentificacion')}
            >
              {TIPOS_IDENTIFICACION.map((tipo) => (
                <MenuItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            label="Identificación *"
            value={form.identificacion}
            onChange={handleChange('identificacion')}
            error={!!errors.identificacion}
            helperText={errors.identificacion}
          />
        </Grid>

        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            size="small"
            label="Nombre *"
            value={form.nombre}
            onChange={handleChange('nombre')}
            error={!!errors.nombre}
            helperText={errors.nombre}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            label="Dirección"
            value={form.direccion}
            onChange={handleChange('direccion')}
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            label="Fecha de Nacimiento"
            type="date"
            value={form.fechaNacimiento}
            onChange={handleChange('fechaNacimiento')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            label="Edad"
            value={edad}
            InputProps={{ readOnly: true }}
            disabled
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Sexo</InputLabel>
            <Select
              value={form.sexo}
              label="Sexo"
              onChange={handleChange('sexo')}
            >
              <MenuItem value="">Seleccione</MenuItem>
              {SEXOS.map((sexo) => (
                <MenuItem key={sexo.value} value={sexo.value}>
                  {sexo.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            freeSolo
            size="small"
            options={nacionalidades.map((nac) => nac.nombre)}
            value={form.nacionalidad || ''}
            onChange={(event, newValue) => {
              updateForm({ nacionalidad: newValue || '' });
            }}
            inputValue={form.nacionalidad}
            onInputChange={(event, newInputValue) => {
              updateForm({ nacionalidad: newInputValue });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Nacionalidad"
                placeholder="Escriba o seleccione..."
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Teléfono principal"
            value={form.telefono1}
            onChange={handleChange('telefono1')}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Teléfono secundario"
            value={form.telefono2}
            onChange={handleChange('telefono2')}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Email principal"
            type="email"
            value={form.email1}
            onChange={handleChange('email1')}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Nombre del Contacto"
            value={form.contactoEmergenciaNombre}
            onChange={handleChange('contactoEmergenciaNombre')}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Teléfono del Contacto"
            value={form.contactoEmergenciaTelefono}
            onChange={handleChange('contactoEmergenciaTelefono')}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.noEnviaFacturaElectronica}
                onChange={handleChange('noEnviaFacturaElectronica')}
              />
            }
            label="Cliente no envía factura electrónica"
          />
        </Grid>

        {!hideGuardarButton && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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

export default InformacionBasica;

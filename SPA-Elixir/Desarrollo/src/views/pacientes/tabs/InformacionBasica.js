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
  Typography,
} from '@mui/material';
import { obtenerTiposIdentificacion, normalizarTipoIdentificacion } from '../../../requests/pacientes/RequestsTipoIdentificacion';

const TIPO_IDENTIFICACION_FISICA_ID = 1;
const TIPO_IDENTIFICACION_JURIDICA_ID = 2;

const toTipoIdentificacionId = (value) => {
  if (value === null || value === undefined || value === '') return TIPO_IDENTIFICACION_FISICA_ID;

  const numericValue = Number(value);
  if (Number.isFinite(numericValue) && numericValue > 0) return numericValue;

  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'juridica' || normalized === '02' || normalized === 'j') {
    return TIPO_IDENTIFICACION_JURIDICA_ID;
  }

  return TIPO_IDENTIFICACION_FISICA_ID;
};

const SEXOS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'O', label: 'Otro' },
];

const InformacionBasica = ({ paciente, onUpdate, hideGuardarButton = false, onFormChange }) => {
  const [form, setForm] = useState({
    numeroDePaciente: '',
    tipoIdentificacion: 'fisica',
    identificacion: '',
    nombre: '',
    nombreComercial: '',
    direccion: '',
    fechaNacimiento: '',
    sexo: '',
    telefono1: '',
    email1: '',
    contactoEmergenciaNombre: '',
    contactoEmergenciaTelefono: '',
  });

  const [tiposIdentificacion, setTiposIdentificacion] = useState([
    { idTipoIdentificacion: TIPO_IDENTIFICACION_FISICA_ID, codigo: 'FISICA', nombre: 'Cédula Física' },
    { idTipoIdentificacion: TIPO_IDENTIFICACION_JURIDICA_ID, codigo: 'JURIDICA', nombre: 'Cédula Jurídica' },
  ]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [edad, setEdad] = useState('');

  const esJuridica = Number(form.tipoIdentificacion) === TIPO_IDENTIFICACION_JURIDICA_ID;

  useEffect(() => {
    cargarTiposIdentificacion();

    if (paciente) {
      const fechaNac = paciente.fechaNacimiento || '';
      const tipoPaciente = toTipoIdentificacionId(
        paciente.idTipoIdentificacion
          ?? paciente.id_tipo_identificacion
          ?? paciente.tipoIdentificacion,
      );
      const nuevoForm = {
        numeroDePaciente: paciente.noPaciente || paciente.numeroDePaciente || '',
        tipoIdentificacion: Number.isFinite(tipoPaciente) && tipoPaciente > 0
          ? tipoPaciente
          : TIPO_IDENTIFICACION_FISICA_ID,
        identificacion: paciente.cedula || paciente.identificacion || '',
        nombre: paciente.nombre || '',
        nombreComercial: paciente.nombreComercial || '',
        direccion: paciente.direccion || '',
        fechaNacimiento: fechaNac ? fechaNac.substring(0, 10) : '',
        sexo: paciente.sexo || '',
        telefono1: paciente.telefono1 || '',
        email1: paciente.email || paciente.email1 || '',
        contactoEmergenciaNombre: paciente.nombreContactoEmergencia || paciente.contactoEmergenciaNombre || '',
        contactoEmergenciaTelefono: paciente.telefonoContactoEmergencia || paciente.contactoEmergenciaTelefono || '',
      };
      setForm(nuevoForm);
      if (onFormChange) onFormChange(nuevoForm);
      if (fechaNac) {
        calcularEdad(fechaNac);
      } else {
        setEdad('0');
      }
    }
  }, [paciente]);

  const cargarTiposIdentificacion = async () => {
    try {
      const lista = await obtenerTiposIdentificacion();
      const normalizada = (Array.isArray(lista) ? lista : []).map(normalizarTipoIdentificacion);
      if (normalizada.length > 0) {
        setTiposIdentificacion(normalizada);
      }
    } catch {
      setTiposIdentificacion([
        { idTipoIdentificacion: TIPO_IDENTIFICACION_FISICA_ID, codigo: 'FISICA', nombre: 'Cédula Física' },
        { idTipoIdentificacion: TIPO_IDENTIFICACION_JURIDICA_ID, codigo: 'JURIDICA', nombre: 'Cédula Jurídica' },
      ]);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onlyNumbers = (value) => {
    return value.replace(/[^0-9]/g, '');
  };

  const handleChange = (field) => (event) => {
    let value = event.target.value;

    if (field === 'tipoIdentificacion') {
      value = Number(value);
    }
    
    // Validar campos numéricos
    if (['identificacion', 'telefono1', 'contactoEmergenciaTelefono'].includes(field)) {
      value = onlyNumbers(value);
    }

    // Validar email
    if (field === 'email1') {
      // Permitir escribir, pero no lo validaremos hasta blur o submit
    }

    const nuevoForm = { ...form, [field]: value };
    setForm(nuevoForm);
    if (onFormChange) onFormChange(nuevoForm);
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
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
    
    // Validaciones requeridas
    if (!form.tipoIdentificacion) {
      newErrors.tipoIdentificacion = 'Tipo de identificación es obligatorio';
    }
    if (!form.identificacion) {
      newErrors.identificacion = 'Identificación es obligatoria';
    }
    if (!form.fechaNacimiento) {
      newErrors.fechaNacimiento = 'Fecha de nacimiento es obligatoria';
    }
    if (!form.sexo) {
      newErrors.sexo = 'Sexo es obligatorio';
    }
    if (!form.telefono1) {
      newErrors.telefono1 = 'Teléfono principal es obligatorio';
    }
    if (!form.email1) {
      newErrors.email1 = 'Email principal es obligatorio';
    } else if (!isValidEmail(form.email1)) {
      newErrors.email1 = 'Email inválido';
    }
    
    // Validar nombre o nombre comercial según tipo de identificación
    if (Number(form.tipoIdentificacion) === TIPO_IDENTIFICACION_JURIDICA_ID) {
      if (!form.nombreComercial) {
        newErrors.nombreComercial = 'Nombre comercial es obligatorio para cédula jurídica';
      }
    } else {
      if (!form.nombre) {
        newErrors.nombre = 'Nombre es obligatorio';
      }
    }

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
          <FormControl fullWidth size="small" error={!!errors.tipoIdentificacion}>
            <InputLabel>Tipo Identificación *</InputLabel>
            <Select
              value={form.tipoIdentificacion}
              label="Tipo Identificación *"
              onChange={handleChange('tipoIdentificacion')}
            >
              {tiposIdentificacion.map((tipo) => (
                <MenuItem key={tipo.idTipoIdentificacion} value={tipo.idTipoIdentificacion}>
                  {tipo.nombre}
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
            inputProps={{ inputMode: 'numeric' }}
          />
        </Grid>

        <Grid item xs={12} sm={4} />

        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            size="small"
            label={esJuridica ? 'Nombre Comercial *' : 'Nombre *'}
            value={esJuridica ? form.nombreComercial : form.nombre}
            onChange={handleChange(esJuridica ? 'nombreComercial' : 'nombre')}
            error={esJuridica ? !!errors.nombreComercial : !!errors.nombre}
            helperText={esJuridica ? errors.nombreComercial : errors.nombre}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            label="Nombre Comercial"
            value={form.nombreComercial}
            onChange={handleChange('nombreComercial')}
            disabled={!esJuridica}
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
            label="Fecha de Nacimiento *"
            type="date"
            value={form.fechaNacimiento}
            onChange={handleChange('fechaNacimiento')}
            error={!!errors.fechaNacimiento}
            helperText={errors.fechaNacimiento}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: new Date().toISOString().split('T')[0] }}
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
          <FormControl fullWidth size="small" error={!!errors.sexo}>
            <InputLabel>Sexo *</InputLabel>
            <Select
              value={form.sexo}
              label="Sexo *"
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

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            label="Teléfono principal *"
            value={form.telefono1}
            onChange={handleChange('telefono1')}
            error={!!errors.telefono1}
            helperText={errors.telefono1}
            inputProps={{ inputMode: 'numeric' }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            label="Email principal *"
            type="email"
            value={form.email1}
            onChange={handleChange('email1')}
            error={!!errors.email1}
            helperText={errors.email1}
          />
        </Grid>
        <Grid item xs={12} sm={4} />
        <Grid item xs={12} sm={4} />

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Contacto de Emergencia
          </Typography>
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
            inputProps={{ inputMode: 'numeric' }}
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

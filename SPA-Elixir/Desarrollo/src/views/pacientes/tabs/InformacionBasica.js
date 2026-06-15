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
  Typography,
  IconButton,
  Autocomplete,
} from '@mui/material';
import { IconSearch } from '@tabler/icons';

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

const InformacionBasica = ({ paciente, onUpdate, hideGuardarButton = false }) => {
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
    telefono2: '',
    email1: '',
    email2: '',
    empadronado: false,
    nacionalidad: '',
    actividadEconomicaCodigo: '',
    actividadEconomicaNombre: '',
    contactoEmergenciaNombre: '',
    contactoEmergenciaTelefono: '',
    noEnviaFacturaElectronica: false,
  });

  const [nacionalidades, setNacionalidades] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loadingPadron, setLoadingPadron] = useState(false);
  const [edad, setEdad] = useState('');

  useEffect(() => {
    if (paciente) {
      const fechaNac = paciente.fechaNacimiento || '';
      setForm({
        numeroDePaciente: paciente.numeroDePaciente || '',
        tipoIdentificacion: paciente.tipoIdentificacion || 'fisica',
        identificacion: paciente.identificacion || paciente.cedula || '',
        nombre: paciente.nombre || '',
        nombreComercial: paciente.nombreComercial || '',
        direccion: paciente.direccion || '',
        fechaNacimiento: fechaNac,
        sexo: paciente.sexo || '',
        telefono1: paciente.telefono1 || '',
        telefono2: paciente.telefono2 || '',
        email1: paciente.email1 || paciente.email || '',
        email2: paciente.email2 || '',
        empadronado: paciente.esEmpadronado || false,
        nacionalidad: paciente.nacionalidad || '',
        actividadEconomicaCodigo: paciente.codigoActividadEconomica || '',
        actividadEconomicaNombre: '',
        contactoEmergenciaNombre: paciente.contactoEmergenciaNombre || '',
        contactoEmergenciaTelefono: paciente.contactoEmergenciaTelefono || '',
        noEnviaFacturaElectronica: paciente.noEnviaFacturaElectronica || false,
      });
      if (fechaNac) {
        calcularEdad(fechaNac);
      }
    }
    cargarNacionalidades();
  }, [paciente]);

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
    const value = event.target.value;
    setForm({ ...form, [field]: value });
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

  const handleBuscarActividadEconomica = async () => {
    // Mock - En producción debe buscar en tabla ActividadEconomicaHacienda
    if (!form.actividadEconomicaCodigo) {
      alert('Ingrese un código de actividad económica');
      return;
    }

    // Simulación de búsqueda
    const mockActividades = {
      '4774': 'Venta al por menor de productos farmacéuticos y medicinales',
      '6201': 'Actividades de programación informática',
      '8621': 'Actividades de la práctica médica',
    };

    const nombre = mockActividades[form.actividadEconomicaCodigo];
    if (nombre) {
      setForm({ ...form, actividadEconomicaNombre: nombre });
      setSuccess('Actividad económica encontrada');
    } else {
      setErrors({ actividadEconomicaCodigo: 'Código no encontrado' });
    }
  };

  const handleBuscarEnPadron = async () => {
    if (!form.identificacion) {
      setErrors({ identificacion: 'Ingrese una identificación para buscar en el padrón' });
      return;
    }

    setLoadingPadron(true);
    setErrors({});

    try {
      // Mock data - En producción debe llamar al API del padrón nacional
      const mockPadronData = {
        '3010000001': {
          nombre: 'JUAN PÉREZ GARCÍA',
          fechaNacimiento: '1980-05-15',
          sexo: 'M',
          empadronado: true,
        },
        '3010000002': {
          nombre: 'MARÍA GARCÍA RODRÍGUEZ',
          fechaNacimiento: '1985-08-22',
          sexo: 'F',
          empadronado: true,
        },
        '3010000003': {
          nombre: 'CARLOS SMITH JOHNSON',
          fechaNacimiento: '1975-03-10',
          sexo: 'M',
          empadronado: false,
        },
      };

      // Simular delay de búsqueda
      await new Promise((resolve) => setTimeout(resolve, 500));

      const resultado = mockPadronData[form.identificacion];

      if (resultado) {
        setForm({
          ...form,
          nombre: resultado.nombre,
          fechaNacimiento: resultado.fechaNacimiento,
          sexo: resultado.sexo,
          empadronado: resultado.empadronado,
          nacionalidad: 'Costarricense', // Auto-asignado por búsqueda en padrón
        });
        setSuccess('Datos encontrados en el padrón nacional');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setErrors({
          identificacion: 'Identificación no encontrada en el padrón nacional',
        });
      }
    } catch (error) {
      setErrors({
        identificacion: 'Error al buscar en el padrón nacional',
      });
    } finally {
      setLoadingPadron(false);
    }
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

        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={handleBuscarEnPadron}
            disabled={loadingPadron}
            sx={{ height: '36px', minHeight: '36px' }}
          >
            {loadingPadron ? 'Buscando...' : 'Buscar en Padrón'}
          </Button>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.empadronado}
                disabled
              />
            }
            label="Empadronado"
            sx={{ mt: 0 }}
          />
        </Grid>

        <Grid item xs={12} sm={4} />

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

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            label="Nombre Comercial"
            value={form.nombreComercial}
            onChange={handleChange('nombreComercial')}
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

        <Grid item xs={12} sm={4}>
          <Autocomplete
            freeSolo
            size="small"
            options={nacionalidades.map((nac) => nac.nombre)}
            value={form.nacionalidad || ''}
            onChange={(event, newValue) => {
              setForm({ ...form, nacionalidad: newValue || '' });
            }}
            inputValue={form.nacionalidad}
            onInputChange={(event, newInputValue) => {
              setForm({ ...form, nacionalidad: newInputValue });
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

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            label="Teléfono principal"
            value={form.telefono1}
            onChange={handleChange('telefono1')}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            label="Teléfono secundario"
            value={form.telefono2}
            onChange={handleChange('telefono2')}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            label="Email principal"
            type="email"
            value={form.email1}
            onChange={handleChange('email1')}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            label="Email secundario"
            type="email"
            value={form.email2}
            onChange={handleChange('email2')}
          />
        </Grid>

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
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Código Actividad Económica"
            value={form.actividadEconomicaCodigo}
            onChange={handleChange('actividadEconomicaCodigo')}
            error={!!errors.actividadEconomicaCodigo}
            helperText={errors.actividadEconomicaCodigo}
            InputProps={{
              endAdornment: (
                <IconButton size="small" onClick={handleBuscarActividadEconomica}>
                  <IconSearch size={18} />
                </IconButton>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Actividad Económica"
            value={form.actividadEconomicaNombre}
            InputProps={{ readOnly: true }}
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

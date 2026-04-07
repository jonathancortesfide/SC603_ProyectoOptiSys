import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import ParentCard from '../../components/shared/ParendCard';
import { obtenerListaDePacientes, AgregarPaciente, ActualizarPaciente } from '../../requests/pacientes/RequestsPacientes';
import InformacionBasica from './tabs/InformacionBasica';

const BCrumb = [{ title: 'Gestión de Pacientes' }];

const crearPacienteVacio = () => ({
  nombre: '',
  cedula: '',
  identificacion: '',
  email: '',
  email1: '',
  telefono1: '',
  telefono2: '',
  direccion: '',
  tipoIdentificacion: 'fisica',
  sexo: '',
  fechaNacimiento: '',
  nacionalidad: '',
  noEnviaFacturaElectronica: false,
  contactoEmergenciaNombre: '',
  contactoEmergenciaTelefono: '',
  esActivo: true,
});

const normalizarPacientePayload = (paciente) => ({
  tipoIdentificacion: paciente.tipoIdentificacion || 'fisica',
  identificacion: paciente.identificacion || paciente.cedula || '',
  cedula: paciente.cedula || paciente.identificacion || '',
  nombre: paciente.nombre || '',
  direccion: paciente.direccion || '',
  fechaNacimiento: paciente.fechaNacimiento || null,
  sexo: paciente.sexo || '',
  telefono1: paciente.telefono1 || '',
  telefono2: paciente.telefono2 || '',
  email1: paciente.email1 || paciente.email || '',
  nacionalidad: paciente.nacionalidad || '',
  noEnviaFacturaElectronica: Boolean(paciente.noEnviaFacturaElectronica),
  contactoEmergenciaNombre: paciente.contactoEmergenciaNombre || '',
  contactoEmergenciaTelefono: paciente.contactoEmergenciaTelefono || '',
  esActivo: paciente.esActivo !== false,
});

const PacientesUnificado = () => {
  const [listaDePacientes, setListaDePacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [modoCreacion, setModoCreacion] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarPacientes();
  }, []);

  const cargarPacientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerListaDePacientes();
      setListaDePacientes(data || []);
      if (data && data.length > 0) {
        setPacienteSeleccionado(data[0]);
      }
    } catch (err) {
      setError('No se pudieron cargar los pacientes');
    }
    setLoading(false);
  };

  const pacientesFiltrados = listaDePacientes.filter((p) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      p.nombre?.toLowerCase().includes(term) ||
      p.cedula?.toLowerCase().includes(term) ||
      p.identificacion?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.email1?.toLowerCase().includes(term)
    );
  });

  const actualizarPacienteSeleccionado = (changes) => {
    setPacienteSeleccionado((prev) => ({ ...(prev || {}), ...changes }));
  };

  const handleSeleccionarPaciente = (paciente) => {
    setPacienteSeleccionado(paciente);
    setModoCreacion(false);
  };

  const handleAgregarPaciente = () => {
    setPacienteSeleccionado(crearPacienteVacio());
    setModoCreacion(true);
  };

  const handleCancelarCreacion = () => {
    setModoCreacion(false);
    if (listaDePacientes.length > 0) {
      setPacienteSeleccionado(listaDePacientes[0]);
    } else {
      setPacienteSeleccionado(null);
    }
  };

  const handleGuardarCambios = async () => {
    if (!pacienteSeleccionado) return;
    if (!String(pacienteSeleccionado.identificacion || pacienteSeleccionado.cedula || '').trim()) {
      alert('La identificación es obligatoria');
      return;
    }
    if (!String(pacienteSeleccionado.nombre || '').trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    
    setGuardando(true);
    try {
      const payload = normalizarPacientePayload(pacienteSeleccionado);
      const respuesta = modoCreacion
        ? await AgregarPaciente(payload)
        : await ActualizarPaciente(pacienteSeleccionado.numeroDePaciente || pacienteSeleccionado.id, payload);

      if (!respuesta?.EsCorrecto) {
        throw new Error(respuesta?.Mensaje || 'No se pudo guardar el paciente');
      }
      
      if (modoCreacion) {
        alert('Paciente creado correctamente');
        setModoCreacion(false);
      } else {
        alert('Cambios guardados correctamente');
      }
      
      await cargarPacientes();
    } catch (err) {
      alert(err?.message || (modoCreacion ? 'Error al crear el paciente' : 'Error al guardar los cambios'));
    } finally {
      setGuardando(false);
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordions((prev) => ({
      ...prev,
      [panel]: isExpanded,
    }));
  };

  if (loading) {
    return (
      <PageContainer title="Gestión de Pacientes" description="Gestión de pacientes">
        <Breadcrumb title="Gestión de Pacientes" items={BCrumb} />
        <ParentCard title="Gestión de Pacientes">
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        </ParentCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Gestión de Pacientes" description="Gestión de pacientes">
      <ParentCard title="">
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={2}>
          {/* Panel izquierdo - Listado de pacientes */}
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Buscar paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleAgregarPaciente}
                >
                  Agregar Paciente
                </Button>
              </Box>
              <Divider />
              <List sx={{ flex: 1, overflow: 'auto' }}>
                {pacientesFiltrados.length > 0 ? (
                  pacientesFiltrados.map((paciente) => (
                    <ListItem key={paciente.id || paciente.numeroDePaciente} disablePadding>
                      <ListItemButton
                        selected={(pacienteSeleccionado?.id && pacienteSeleccionado?.id === paciente.id) || (pacienteSeleccionado?.numeroDePaciente && pacienteSeleccionado?.numeroDePaciente === paciente.numeroDePaciente)}
                        onClick={() => handleSeleccionarPaciente(paciente)}
                      >
                        <ListItemText
                          primary={paciente.nombre}
                          secondary={paciente.cedula || paciente.identificacion}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No hay pacientes" />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>

          {/* Panel derecho - Información completa del paciente */}
          <Grid item xs={12} md={8}>
            <Paper variant="outlined" sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
              {pacienteSeleccionado ? (
                <>
                  {/* Header con nombre y botón de acciones */}
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {modoCreacion ? 'Nuevo Paciente' : pacienteSeleccionado.nombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {modoCreacion ? 'Ingrese los datos del nuevo paciente' : (pacienteSeleccionado.cedula || pacienteSeleccionado.identificacion)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {modoCreacion && (
                        <Button size="small" variant="outlined" onClick={handleCancelarCreacion}>
                          Cancelar
                        </Button>
                      )}
                    </Box>
                  </Box>

                  {/* Contenido completo con scroll */}
                  <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Información Básica
                    </Typography>
                    <InformacionBasica paciente={pacienteSeleccionado} onUpdate={cargarPacientes} onChange={actualizarPacienteSeleccionado} hideGuardarButton={true} />
                  </Box>

                  {/* Footer con botón de guardar */}
                  <Box sx={{ borderTop: 1, borderColor: 'divider', p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleGuardarCambios}
                      disabled={guardando}
                    >
                      {guardando ? 'Guardando...' : (modoCreacion ? 'Crear Paciente' : 'Guardar Cambios')}
                    </Button>
                  </Box>

                </>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    Seleccione un paciente
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default PacientesUnificado;

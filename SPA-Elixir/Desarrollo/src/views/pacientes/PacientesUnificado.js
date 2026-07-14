import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Grid,
  Paper,
  Stack,
  Button,
  TextField,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PageContainer from '../../components/container/PageContainer';
import ParentCard from '../../components/shared/ParendCard';
import { obtenerListaDePacientes, AgregarPaciente, ModificarPaciente, ModificarEstadoPaciente } from '../../requests/pacientes/RequestsPacientes';
import InformacionBasica from './tabs/InformacionBasica';

const PacientesUnificado = () => {
  const navigate = useNavigate();
  const [listaDePacientes, setListaDePacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [modoCreacion, setModoCreacion] = useState(false);
  const [anchorElAcciones, setAnchorElAcciones] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [formDataPaciente, setFormDataPaciente] = useState(null);
  const [expandedAccordions, setExpandedAccordions] = useState({
    'informacion-basica': true,
  });
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);

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
        const primerActivo = data.find((p) => p.activo);
        setPacienteSeleccionado(primerActivo || null);
      }
    } catch (err) {
      setError('No se pudieron cargar los pacientes');
    }
    setLoading(false);
  };

  const pacientesFiltrados = listaDePacientes.filter((p) => {
    if (!p.activo) return false;
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      p.nombre?.toLowerCase().includes(term) ||
      p.cedula?.toLowerCase().includes(term) ||
      p.identificacion?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term)
    );
  });

  const handleSeleccionarPaciente = (paciente) => {
    setPacienteSeleccionado(paciente);
    setModoCreacion(false);
    setExpandedAccordions({
      'informacion-basica': true,
    });
  };

  const handleAgregarPaciente = () => {
    setPacienteSeleccionado({
      nombre: '',
      cedula: '',
      identificacion: '',
      email: '',
      telefono: '',
      direccion: '',
    });
    setModoCreacion(true);
    setExpandedAccordions({
      'informacion-basica': true,
    });
  };

  const handleCancelarCreacion = () => {
    setModoCreacion(false);
    if (listaDePacientes.length > 0) {
      setPacienteSeleccionado(listaDePacientes[0]);
    } else {
      setPacienteSeleccionado(null);
    }
    setExpandedAccordions({
      'informacion-basica': true,
    });
  };

  const handleAgregarExamen = () => {
    if (!pacienteSeleccionado) {
      alert('Seleccione un paciente primero');
      return;
    }
    navigate('/crearexamen', { state: { paciente: pacienteSeleccionado } });
  };

  const handleAgregarFactura = () => {
    if (!pacienteSeleccionado) {
      alert('Seleccione un paciente primero');
      return;
    }
    alert(`Agregar factura para ${pacienteSeleccionado.nombre}`);
  };

  const handleAgregarReciboNota = () => {
    if (!pacienteSeleccionado) {
      alert('Seleccione un paciente primero');
      return;
    }
    alert(`Agregar recibo o nota para ${pacienteSeleccionado.nombre}`);
  };

  const handleAbrirExamen = () => {
    if (!pacienteSeleccionado) {
      alert('Seleccione un paciente primero');
      return;
    }
    alert(`Abrir examen para ${pacienteSeleccionado.nombre}`);
  };

  const handleEliminarPaciente = () => {
    setConfirmarEliminar(true);
  };

  const handleConfirmarEliminar = async () => {
    setConfirmarEliminar(false);
    const noPaciente = pacienteSeleccionado?.noPaciente || pacienteSeleccionado?.numeroDePaciente;
    if (!noPaciente) return;

    const identificador = pacienteSeleccionado?.identificador ?? pacienteSeleccionado?.Identificador;

    setGuardando(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const resultado = await ModificarEstadoPaciente(noPaciente, false, identificador);
      if (resultado?.esCorrecto) {
        setSuccessMsg(resultado.mensaje || 'Paciente eliminado correctamente');
        await cargarPacientes();
      } else {
        setError(resultado?.mensaje || 'Error al eliminar el paciente');
      }
    } catch {
      setError('Error al eliminar el paciente');
    } finally {
      setGuardando(false);
    }
  };

  const handleOpenAcciones = (event) => {
    setAnchorElAcciones(event.currentTarget);
  };

  const handleCloseAcciones = () => {
    setAnchorElAcciones(null);
  };

  const handleAccion = (action) => {
    switch (action) {
      case 'agregar_examen':
        handleAgregarExamen();
        break;
      case 'agregar_factura':
        handleAgregarFactura();
        break;
      case 'agregar_recibo_nota':
        handleAgregarReciboNota();
        break;
      case 'abrir_examen':
        handleAbrirExamen();
        break;
      case 'eliminar_paciente':
        handleEliminarPaciente();
        break;
      default:
        break;
    }
    handleCloseAcciones();
  };

  const handleGuardarCambios = async () => {
    if (!formDataPaciente || guardando) return;

    const nombre = formDataPaciente.nombre?.trim();
    const nombreComercial = formDataPaciente.nombreComercial?.trim();
    const cedula = formDataPaciente.identificacion?.trim();
    const email = formDataPaciente.email1?.trim();
    const telefono = formDataPaciente.telefono1?.trim();
    const fechaNacimiento = formDataPaciente.fechaNacimiento?.trim();
    const sexo = formDataPaciente.sexo?.trim();
    const tipoId = formDataPaciente.tipoIdentificacion?.trim();

    // Validar email
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    // Validaciones requeridas
    if (!tipoId) {
      setError('Tipo de Identificación es obligatorio');
      return;
    }
    if (!cedula) {
      setError('Identificación es obligatoria');
      return;
    }
    if (!fechaNacimiento) {
      setError('Fecha de Nacimiento es obligatoria');
      return;
    }
    if (!sexo) {
      setError('Sexo es obligatorio');
      return;
    }
    if (!telefono) {
      setError('Teléfono principal es obligatorio');
      return;
    }
    if (!email) {
      setError('Email principal es obligatorio');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Email principal inválido (debe tener formato: usuario@dominio.com)');
      return;
    }
    if (tipoId === 'juridica') {
      if (!nombreComercial) {
        setError('Nombre Comercial es obligatorio para cédula jurídica');
        return;
      }
    } else {
      if (!nombre) {
        setError('Nombre es obligatorio');
        return;
      }
    }

    setGuardando(true);
    setError(null);
    setSuccessMsg(null);
    try {
      let resultado;
      if (modoCreacion) {
        resultado = await AgregarPaciente(formDataPaciente);
      } else {
        const noPaciente = pacienteSeleccionado?.noPaciente || pacienteSeleccionado?.numeroDePaciente || 0;
        resultado = await ModificarPaciente(formDataPaciente, noPaciente);
      }

      if (resultado?.esCorrecto) {
        setSuccessMsg(resultado.mensaje || (modoCreacion ? 'Paciente creado correctamente' : 'Cambios guardados correctamente'));
        setModoCreacion(false);
        await cargarPacientes();
      } else {
        setError(resultado?.mensaje || 'Error al guardar');
      }
    } catch (err) {
      setError(modoCreacion ? 'Error al crear el paciente' : 'Error al guardar los cambios');
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
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

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
                    <ListItem key={paciente.noPaciente || paciente.numeroDePaciente} disablePadding>
                      <ListItemButton
                        selected={pacienteSeleccionado?.noPaciente === paciente.noPaciente}
                        onClick={() => handleSeleccionarPaciente(paciente)}
                      >
                        <ListItemText
                          primary={paciente.nombre}
                          secondary={paciente.cedula}
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
                      {!modoCreacion && (
                        <Button size="small" variant="contained" endIcon={<ExpandMoreIcon />} onClick={handleOpenAcciones}>
                          Acciones
                        </Button>
                      )}
                    </Box>
                  </Box>

                  {/* Contenido completo con scroll */}
                  <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                    {/* Información Básica - Accordion */}
                    <Accordion 
                      expanded={expandedAccordions['informacion-basica']} 
                      onChange={handleAccordionChange('informacion-basica')}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Información Básica
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <InformacionBasica
                          paciente={pacienteSeleccionado}
                          onUpdate={cargarPacientes}
                          hideGuardarButton={true}
                          onFormChange={setFormDataPaciente}
                        />
                      </AccordionDetails>
                    </Accordion>
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

                  <Menu
                    anchorEl={anchorElAcciones}
                    open={Boolean(anchorElAcciones)}
                    onClose={handleCloseAcciones}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  >
                    <MenuItem onClick={() => handleAccion('agregar_examen')}>Agregar Examen</MenuItem>
                    <MenuItem onClick={() => handleAccion('agregar_factura')}>Agregar Factura</MenuItem>
                    <MenuItem onClick={() => handleAccion('agregar_recibo_nota')}>Agregar Recibo o Nota</MenuItem>
                    <MenuItem onClick={() => handleAccion('abrir_examen')}>Abrir Examen</MenuItem>
                    <Divider />
                    <MenuItem onClick={() => handleAccion('eliminar_paciente')} sx={{ color: 'error.main' }}>
                      Eliminar Paciente
                    </MenuItem>
                  </Menu>
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

      <Dialog open={confirmarEliminar} onClose={() => setConfirmarEliminar(false)}>
        <DialogTitle>Eliminar Paciente</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar al paciente <strong>{pacienteSeleccionado?.nombre}</strong>? Esta acción lo marcará como inactivo en el sistema.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmarEliminar(false)}>Cancelar</Button>
          <Button onClick={handleConfirmarEliminar} color="error" variant="contained" disabled={guardando}>
            {guardando ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default PacientesUnificado;

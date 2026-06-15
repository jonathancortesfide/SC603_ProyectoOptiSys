import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import ParentCard from '../../components/shared/ParendCard';
import { obtenerListaDePacientes } from '../../requests/pacientes/RequestsPacientes';
import InformacionBasica from './tabs/InformacionBasica';
import CuentasTab from './tabs/CuentasTab';
import InformacionAdicional from './tabs/InformacionAdicional';
import InformacionFacturacion from './tabs/InformacionFacturacion';

const BCrumb = [{ title: 'Gestión de Pacientes' }];

const PacientesUnificado = () => {
  const [listaDePacientes, setListaDePacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [modoCreacion, setModoCreacion] = useState(false);
  const [anchorElAcciones, setAnchorElAcciones] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState({
    'informacion-basica': true,
    'cuentas': false,
    'informacion-adicional': false,
    'informacion-facturacion': false,
  });

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
      p.email?.toLowerCase().includes(term)
    );
  });

  const handleSeleccionarPaciente = (paciente) => {
    setPacienteSeleccionado(paciente);
    setModoCreacion(false);
    setExpandedAccordions({
      'informacion-basica': true,
      'cuentas': false,
      'informacion-adicional': false,
      'informacion-facturacion': false,
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
      'cuentas': false,
      'informacion-adicional': false,
      'informacion-facturacion': false,
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
      'cuentas': false,
      'informacion-adicional': false,
      'informacion-facturacion': false,
    });
  };

  const handleAgregarExamen = () => {
    if (!pacienteSeleccionado) {
      alert('Seleccione un paciente primero');
      return;
    }
    alert(`Agregar examen para ${pacienteSeleccionado.nombre}`);
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
      default:
        break;
    }
    handleCloseAcciones();
  };

  const handleGuardarCambios = async () => {
    if (!pacienteSeleccionado) return;
    
    setGuardando(true);
    try {
      // Aquí se debe llamar al API para guardar todos los cambios del paciente
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simular guardado
      
      if (modoCreacion) {
        alert('Paciente creado correctamente');
        setModoCreacion(false);
      } else {
        alert('Cambios guardados correctamente');
      }
      
      await cargarPacientes();
    } catch (err) {
      alert(modoCreacion ? 'Error al crear el paciente' : 'Error al guardar los cambios');
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
                        selected={pacienteSeleccionado?.id === paciente.id}
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
                        <InformacionBasica paciente={pacienteSeleccionado} onUpdate={cargarPacientes} hideGuardarButton={true} />
                      </AccordionDetails>
                    </Accordion>

                    {/* Cuentas - Accordion */}
                    <Accordion 
                      expanded={expandedAccordions['cuentas']} 
                      onChange={handleAccordionChange('cuentas')}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Cuentas
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <CuentasTab paciente={pacienteSeleccionado} onUpdate={cargarPacientes} hideGuardarButton={true} />
                      </AccordionDetails>
                    </Accordion>

                    {/* Información Adicional - Accordion */}
                    <Accordion 
                      expanded={expandedAccordions['informacion-adicional']} 
                      onChange={handleAccordionChange('informacion-adicional')}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Información Adicional
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <InformacionAdicional paciente={pacienteSeleccionado} onUpdate={cargarPacientes} hideGuardarButton={true} />
                      </AccordionDetails>
                    </Accordion>

                    {/* Información de Facturación - Accordion */}
                    <Accordion 
                      expanded={expandedAccordions['informacion-facturacion']} 
                      onChange={handleAccordionChange('informacion-facturacion')}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Información de Facturación
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <InformacionFacturacion paciente={pacienteSeleccionado} onUpdate={cargarPacientes} />
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
    </PageContainer>
  );
};

export default PacientesUnificado;

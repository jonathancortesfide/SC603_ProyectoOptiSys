import React, { useState, useEffect, useMemo } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Stack,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  TablePagination,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';

import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import ParentCard from '../../components/shared/ParendCard';
import { obtenerListaDePacientes } from '../../requests/pacientes/RequestsPacientes';
import FormularioPaciente from './FormularioPaciente';
import CuentasPaciente from './CuentasPaciente';

const BCrumb = [ { title: 'Pacientes' } ];

const Pacientes = () => {
  const [listaDePacientes, setListaDePacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [openCuentas, setOpenCuentas] = useState(false);
  const [anchorElMore, setAnchorElMore] = useState(null);
  const [morePaciente, setMorePaciente] = useState(null);

  useEffect(() => { cargarPacientes(); }, []);

  const cargarPacientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerListaDePacientes();
      setListaDePacientes(data || []);
    } catch (err) {
      setError('No se pudieron cargar los pacientes');
    }
    setLoading(false);
  };

  const pacientesFiltrados = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return listaDePacientes;
    return listaDePacientes.filter(p =>
      p.nombre?.toLowerCase().includes(term) ||
      p.cedula?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term)
    );
  }, [listaDePacientes, searchTerm]);

  const pacientesPaginados = useMemo(() => {
    const start = page * rowsPerPage;
    return pacientesFiltrados.slice(start, start + rowsPerPage);
  }, [pacientesFiltrados, page, rowsPerPage]);

  const handleAbrirFormulario = (paciente = null) => {
    if (paciente) {
      setModoEdicion(true);
      setPacienteSeleccionado(paciente);
    } else {
      setModoEdicion(false);
      setPacienteSeleccionado(null);
    }
    setOpenDialog(true);
  };

  const handleAbrirCuentas = (paciente) => {
    setPacienteSeleccionado(paciente);
    setOpenCuentas(true);
  };

  const handleCerrarCuentas = () => {
    setOpenCuentas(false);
  };

  const handleCerrarFormulario = () => {
    setOpenDialog(false);
    setPacienteSeleccionado(null);
    setModoEdicion(false);
  };

  const handleGuardar = async () => {
    await cargarPacientes();
    handleCerrarFormulario();
  };

  const handleEliminar = (p) => {
    if (!window.confirm(`¿Eliminar paciente ${p.nombre}?`)) return;
    // No delete API implemented: remove locally
    setListaDePacientes(l => l.filter(x => x.id !== p.id && x.numeroDePaciente !== p.numeroDePaciente));
  };

  const handleOpenMore = (event, paciente) => {
    setAnchorElMore(event.currentTarget);
    setMorePaciente(paciente);
  };

  const handleCloseMore = () => {
    setAnchorElMore(null);
    setMorePaciente(null);
  };

  const handleMoreAction = (action) => {
    // Placeholder: currently we just close the menu. Could open dialogs or navigate later.
    console.log(action, morePaciente);
    handleCloseMore();
  };

  if (loading) return (
    <PageContainer title="Pacientes" description="Esta es la vista de pacientes">
      <Breadcrumb title="Pacientes" items={BCrumb} />
      <ParentCard title="Pacientes">
        <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>
      </ParentCard>
    </PageContainer>
  );

  return (
    <PageContainer title="Pacientes" description="Esta es la vista de pacientes">
      <Breadcrumb title="Pacientes" items={BCrumb} />
      <ParentCard title="Pacientes">
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction="row" spacing={2} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <TextField placeholder="Buscar por nombre, cédula o email..." size="small" sx={{ width: 400 }} value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }} />
          <Button variant="contained" color="success" onClick={() => handleAbrirFormulario()} >Crear paciente</Button>
        </Stack>

        <Paper variant="outlined">
          <TableContainer>
            <Table aria-label="Pacientes" sx={{ whiteSpace: 'nowrap' }}>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="h6">Cédula</Typography></TableCell>
                  <TableCell><Typography variant="h6">Nombre</Typography></TableCell>
                  <TableCell><Typography variant="h6">Email</Typography></TableCell>
                  <TableCell align="center"><Typography variant="h6">Activo</Typography></TableCell>
                  <TableCell align="center"><Typography variant="h6">Acciones</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                        {pacientesFiltrados.length > 0 ? (
                  pacientesPaginados.map((paciente) => (
                    <TableRow key={paciente.id || paciente.numeroDePaciente} hover>
                      <TableCell>{paciente.cedula || paciente.identificacion}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>{paciente.nombre}</Typography>
                          <Typography color="textSecondary" variant="caption">{paciente.nombreComercial}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{paciente.email1 || paciente.email}</TableCell>
                      <TableCell align="center">{paciente.esActivo ? 'Sí' : 'No'}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button size="small" onClick={() => handleAbrirCuentas(paciente)}>Ver cuentas</Button>
                          <Button size="small" onClick={() => handleAbrirFormulario(paciente)}>Editar</Button>
                          <Button size="small" color="error" onClick={() => handleEliminar(paciente)}>Eliminar</Button>
                          <IconButton size="small" onClick={(e) => handleOpenMore(e, paciente)} aria-label="more">
                            <span style={{fontSize: 18}}>⋯</span>
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No hay pacientes</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <TablePagination component="div" count={pacientesFiltrados.length} page={page} onPageChange={(e, newPage) => setPage(newPage)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} rowsPerPageOptions={[5,10,25,50]} />

        <Dialog open={openDialog} onClose={handleCerrarFormulario} maxWidth="md" fullWidth>
          <FormularioPaciente paciente={pacienteSeleccionado} modoEdicion={modoEdicion} onGuardar={handleGuardar} onCancel={handleCerrarFormulario} />
        </Dialog>

        <CuentasPaciente open={openCuentas} onClose={handleCerrarCuentas} paciente={pacienteSeleccionado} />
        <Menu
          anchorEl={anchorElMore}
          open={Boolean(anchorElMore)}
          onClose={handleCloseMore}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => handleMoreAction('crear_examen')}>Crear examen</MenuItem>
          <MenuItem onClick={() => handleMoreAction('crear_factura')}>Crear factura</MenuItem>
          <MenuItem onClick={() => handleMoreAction('crear_factura_facil')}>Crear factura fácil</MenuItem>
          <MenuItem onClick={() => handleMoreAction('crear_recibo_o_nota')}>Crear recibo o nota</MenuItem>
          <MenuItem onClick={() => handleMoreAction('abrir_examen')}>Abrir examen</MenuItem>
        </Menu>
      </ParentCard>
    </PageContainer>
  );
};

export default Pacientes;

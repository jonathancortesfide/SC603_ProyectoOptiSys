import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  Switch,
  FormControlLabel,
  TextField,
  Chip,
  Collapse,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { IconPlus, IconEdit, IconToggleLeft, IconToggleRight } from '@tabler/icons';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import FormularioTipoLente from './FormularioTipoLente'; 
import { getNoEmpresa } from '../../../utils/empresa';

import { 
  obtenerTipoLentePorDescripcion,
  modificarEstadoTipoLente
} from '../../../requests/mantenimientos/TipoLente/RequestsTipoLente';

const TipoLente = () => {
  const [descripcion, setDescripcion] = useState('');
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const successTimerRef = useRef(null);
  const [soloActivos, setSoloActivos] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);

  // Dialog cambiar estado
  const [estadoDialog, setEstadoDialog] = useState({ open: false, tipo: null });
  const [loadingEstado, setLoadingEstado] = useState(false);
  const [errorEstado, setErrorEstado] = useState(null);

  const tiposFiltrados = soloActivos ? tipos.filter(t => t.activo === true) : tipos;

  useEffect(() => () => {
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
  handleBuscar();   
}, []);

  
  const showSuccess = (payload) => {
    setSuccess(payload);
    setSuccessOpen(true);

    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    // Close slightly before clearing to allow the collapse animation to play.
    successTimerRef.current = setTimeout(() => setSuccessOpen(false), 3500);
  };

const handleBuscar = async () => {
  setLoading(true);
  setError(null);

  try {
    const identificador = getNoEmpresa();
    const data = await obtenerTipoLentePorDescripcion(
      descripcion.trim(),
      identificador
    ); 

    if (data && Array.isArray(data)) {
      setTipos(data);
      setNoResults(data.length === 0);
    } else {
      setError('No se pudieron cargar los tipos de lente');
      setTipos([]);
      setNoResults(false);
    }
  } catch (err) {
    setError('Error al buscar tipos de lente');
    setTipos([]);
    setNoResults(false);
  }

  setLoading(false);
};

  const handleOpenDialog = () => {
    setModoEdicion(false);
    setTipoSeleccionado(null);
    setOpenDialog(true);
  };

  const handleEdit = (tipo) => {
    setTipoSeleccionado(tipo);
    setModoEdicion(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setModoEdicion(false);
    setTipoSeleccionado(null);
  };

  const handleGuardar = async () => {
    setOpenDialog(false);
    showSuccess({ message: 'Tipo de lente guardado correctamente', severity: 'info' });
    handleCloseDialog();
    // Recargar la tabla
    try {
      await handleBuscar();
    } catch (reloadErr) {
      console.error('Error al recargar la tabla:', reloadErr);
    }
  };

  const handleCambiarEstado = async (tipo) => {
    setEstadoDialog({ open: true, tipo });
    setErrorEstado(null);
  };

  const handleCerrarCambioEstado = () => {
    setEstadoDialog({ open: false, tipo: null });
    setErrorEstado(null);
  };

  const handleConfirmarCambioEstado = async () => {
    const { tipo } = estadoDialog;
    setLoadingEstado(true);
    setErrorEstado(null);

    const nuevoEstado = !tipo.activo;
    const res = await modificarEstadoTipoLente(tipo.no_tipo, nuevoEstado);

    if (res && res.esCorrecto !== false) {
      handleCerrarCambioEstado();
      showSuccess({
        message: `Tipo de lente ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`,
        severity: 'info',
      });
      await handleBuscar();
    } else {
      setErrorEstado(res?.mensaje || 'No se pudo cambiar el estado');
    }
    setLoadingEstado(false);
  };

  return (
    <PageContainer title="Tipo de lente" description="Mantenimiento de tipo de lente">
      <Breadcrumb title="Tipo de lente" items={[{ title: 'Mantenimientos' }, { title: 'Tipo de lente' }]} />
      <ParentCard title="Tipo de lente">
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
        {success && (
          <Collapse
            in={successOpen}
            timeout={250}
            onExited={() => setSuccess(null)}
          >
            <Alert
              severity={success.severity ?? 'success'}
              sx={{ mb: 2 }}
              onClose={() => setSuccessOpen(false)}
            >
              {success.message ?? String(success)}
            </Alert>
          </Collapse>
        )}
        
        <Box>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={2}>
              <TextField
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                 sx={{ flex: 1 }}
              />
              <Button
                variant="contained"
                onClick={handleBuscar}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : 'Buscar'}
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<IconPlus />}
                onClick={handleOpenDialog}
              >
                Agregar
              </Button>
              <FormControlLabel
                control={<Switch checked={soloActivos} onChange={(e) => setSoloActivos(e.target.checked)} />}
                label="Solo activos"
              />
            </Stack>
          </Stack>
        </Box>

        {tipos.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Descripción</strong></TableCell>
                    <TableCell align="center"><strong>Estado</strong></TableCell>
                    <TableCell align="center"><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tiposFiltrados.map((tipo) => (
                    <TableRow key={tipo.no_tipo} hover>
                      <TableCell>{tipo.descripcion}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={tipo.activo ? 'Activo' : 'Inactivo'}
                          color={tipo.activo ? 'success' : 'default'}
                          size="small"
                          variant={tipo.activo ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          color="info"
                          variant={tipo.activo ? 'outlined' : 'contained'}
                          startIcon={tipo.activo ? <IconToggleLeft /> : <IconToggleRight />}
                          onClick={() => handleCambiarEstado(tipo)}
                        >
                          {tipo.activo ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          startIcon={<IconEdit />}
                          onClick={() => handleEdit(tipo)}
                          sx={{ ml: 1 }}
                        >
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {noResults && (
          <Box sx={{ mt: 3 }}>
            <Alert severity="info">No se encontraron tipos de lente.</Alert>
          </Box>
        )}

        {loading && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        )}

        {/* Dialog para agregar/editar tipo de lente */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <FormularioTipoLente
            tipo={tipoSeleccionado}
            modoEdicion={modoEdicion}
            onGuardar={handleGuardar}
            onCancel={handleCloseDialog}
          />
        </Dialog>

        {/* ── Dialog: Cambiar estado ── */}
        <Dialog open={estadoDialog.open} onClose={handleCerrarCambioEstado} maxWidth="xs" fullWidth>
          <DialogTitle>
            {estadoDialog.tipo?.activo ? 'Desactivar tipo de lente' : 'Activar tipo de lente'}
          </DialogTitle>
          <DialogContent>
            {errorEstado && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{errorEstado}</Alert>}
            <Typography variant="body2">
              {estadoDialog.tipo?.activo
                ? `¿Desactivar "${estadoDialog.tipo?.descripcion}"?`
                : `¿Activar "${estadoDialog.tipo?.descripcion}"?`}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCerrarCambioEstado}
              disabled={loadingEstado}
              sx={(theme) => ({
                '&:hover': {
                  borderColor: theme.palette.error.main,
                  color: theme.palette.error.main,
                  backgroundColor: alpha(theme.palette.error.main, 0.06),
                },
              })}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={handleConfirmarCambioEstado}
              disabled={loadingEstado}
            >
              {loadingEstado ? <CircularProgress size={20} color="inherit" /> : 'Confirmar'}
            </Button>
          </DialogActions>
        </Dialog>
      </ParentCard>
    </PageContainer>
  );
};

export default TipoLente;

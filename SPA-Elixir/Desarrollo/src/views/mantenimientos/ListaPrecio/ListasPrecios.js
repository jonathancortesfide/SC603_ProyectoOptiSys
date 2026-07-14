import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Stack,
  TextField,
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
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Collapse,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Switch, FormControlLabel } from '@mui/material';
import { IconPlus, IconEdit, IconToggleLeft, IconToggleRight } from '@tabler/icons';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import { getSucursalIdentificador } from '../../../utils/sucursal';
import FormularioListaPrecio from './FormularioListaPrecio';

import { 
  obtenerListasPreciosPorDescripcion, 
  crearListaPrecio,
  actualizarListaPrecio,
  modificarEstadoListaPrecio
} from '../../../requests/mantenimientos/ListaPrecio/RequestsListaPrecio';

const ListasPrecios = () => {
  const [soloActivos, setSoloActivos] = useState(true);
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const successTimerRef = useRef(null);
  const [listas, setListas] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [listaSeleccionada, setListaSeleccionada] = useState(null);

  // Dialog cambiar estado
  const [estadoDialog, setEstadoDialog] = useState({ open: false, lista: null });
  const [loadingEstado, setLoadingEstado] = useState(false);
  const [errorEstado, setErrorEstado] = useState(null);

  const listasFiltradas = soloActivos
  ? listas.filter(l => l.activo)
  : listas;

  // Dialog para agregar
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    descripcion: '',
    id_moneda: ''
  });
  const [loadingForm, setLoadingForm] = useState(false);
  const [errorForm, setErrorForm] = useState(null);

  useEffect(() => { cargarListas(); }, []);

  useEffect(() => () => {
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (modoEdicion && listaSeleccionada) {
      setFormData({
        descripcion: listaSeleccionada.descripcion || '',
        descripcionMoneda: listaSeleccionada.descripcionMoneda?.trim() || ''
      });
    }
  }, [modoEdicion, listaSeleccionada]);

  const showSuccess = (payload) => {
    setSuccess(payload);
    setSuccessOpen(true);

    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    // Close slightly before clearing to allow the collapse animation to play.
    successTimerRef.current = setTimeout(() => setSuccessOpen(false), 3500);
  };

  const cargarListas = async () => {
  setLoading(true);
  setError(null);

  try {
    const identificador = getSucursalIdentificador(); 

    const data = await obtenerListasPreciosPorDescripcion(
      descripcion.trim(),
      identificador 
    );

    if (data && Array.isArray(data)) {
      setListas(data);
      setNoResults(data.length === 0);
    } else {
      setError('No se pudieron cargar las listas de precios');
      setListas([]);
      setNoResults(false);
    }
  } catch (err) {
    setError('Error al buscar listas de precios');
    setListas([]);
    setNoResults(false);
  }

  setLoading(false);
};

  const handleBuscar = async () => {
    await cargarListas();
  };

  const handleOpenDialog = () => {
    setModoEdicion(false);
    setListaSeleccionada(null);
    setFormData({ descripcion: '', descripcionMoneda: '' });
    setErrorForm(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setModoEdicion(false);
    setListaSeleccionada(null);
    setFormData({ descripcion: '', descripcionMoneda: '' });
    setErrorForm(null);
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGuardar = async () => {
    setErrorForm(null);

    setLoadingForm(true);
    try {
      let res;
      
      if (modoEdicion && listaSeleccionada) {
        // Actualizar lista de precio
        res = await actualizarListaPrecio(formData);
        
        if (res && res.EsCorrecto !== false) {
          showSuccess({
            message: 'Lista de precio actualizada exitosamente',
            severity: 'info',
          });
          handleCloseDialog();
          // Recargar la tabla
          try {
            await handleBuscar();
          } catch (reloadErr) {
            console.error('Error al recargar la tabla:', reloadErr);
          }
        } else {
          setErrorForm(res?.Mensaje || 'Error al actualizar la lista de precio');
        }
      } else {
        // Crear lista de precio
        const datosEnvio = {
          descripcion: formData.descripcion.trim(),
          id_moneda: formData.id_moneda.trim()
        };
        res = await crearListaPrecio(datosEnvio);
        
        if (res && res.EsCorrecto !== false) {
          showSuccess({
            message: 'Lista de precio creada exitosamente',
            severity: 'info',
          });
          handleCloseDialog();
          // Recargar la tabla
          try {
            await handleBuscar();
          } catch (reloadErr) {
            console.error('Error al recargar la tabla:', reloadErr);
          }
        } else {
          setErrorForm(res?.Mensaje || 'Error al crear la lista de precio');
        }
      }
    } catch (err) {
      setErrorForm('Error en la operación');
    }
    setLoadingForm(false);
  };

  // ── Cambiar estado ───────────────────────────────────────
  const handleAbrirCambioEstado = (lista) => {
    setEstadoDialog({ open: true, lista });
    setErrorEstado(null);
  };

  const handleCerrarCambioEstado = () => {
    setEstadoDialog({ open: false, lista: null });
    setErrorEstado(null);
  };

  const handleConfirmarCambioEstado = async () => {
    const { lista } = estadoDialog;
    setLoadingEstado(true);
    setErrorEstado(null);

    const nuevoEstado = !lista.activo;
    const res = await modificarEstadoListaPrecio(lista.no_lista, nuevoEstado);

    if (res && res.EsCorrecto !== false) {
      handleCerrarCambioEstado();
      showSuccess({
        message: `Lista de precio ${nuevoEstado ? 'activada' : 'desactivada'} correctamente`,
        severity: 'info',
      });
      await cargarListas();
    } else {
      setErrorEstado(res?.Mensaje || 'No se pudo cambiar el estado');
    }
    setLoadingEstado(false);
  };

  return (
    <PageContainer title="Listas de precio" description="Mantenimiento de listas de precios">
      <ParentCard title="Listas de precio">
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
                label="Descripción"
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
                control={
                  <Switch
                    checked={soloActivos}
                    onChange={(e) => setSoloActivos(e.target.checked)}
                  />
                  }
                 label="Solo activos"
  />
  
            </Stack>
          </Stack>
        </Box>

        {listas.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Descripción</strong></TableCell>
                    <TableCell><strong>Moneda</strong></TableCell>
                    <TableCell align="center"><strong>Estado</strong></TableCell>
                    <TableCell align="center"><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listasFiltradas.map((lista) => (
                    <TableRow key={lista.no_lista} hover>
                      <TableCell>{lista.descripcion}</TableCell>
                      <TableCell>{lista.descripcionMoneda}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={lista.activo ? 'Activo' : 'Inactivo'}
                          color={lista.activo ? 'success' : 'default'}
                          size="small"
                          variant={lista.activo ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          color="info"
                          variant={lista.activo ? 'outlined' : 'contained'}
                          startIcon={lista.activo ? <IconToggleLeft /> : <IconToggleRight />}
                          onClick={() => handleAbrirCambioEstado(lista)}
                        >
                          {lista.activo ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          startIcon={<IconEdit />}
                          onClick={() => {
                            setListaSeleccionada(lista);
                            setModoEdicion(true);
                            setOpenDialog(true);
                          }}
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
            <Alert severity="info">No se encontraron listas de precios para la descripción especificada.</Alert>
          </Box>
        )}
{/* Dialog para agregar/editar lista de precio */}
<Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
  <FormularioListaPrecio
    lista={listaSeleccionada}
    modoEdicion={modoEdicion}
    onGuardar={async () => {
      handleCloseDialog();
      await cargarListas();
    }}
    onCancel={handleCloseDialog}
  />
</Dialog>

{/* ── Dialog: Cambiar estado ── */}
<Dialog open={estadoDialog.open} onClose={handleCerrarCambioEstado} maxWidth="xs" fullWidth>
  <DialogTitle>
    {estadoDialog.lista?.activo ? 'Desactivar lista de precio' : 'Activar lista de precio'}
  </DialogTitle>

  <DialogContent>
    {errorEstado && (
      <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
        {errorEstado}
      </Alert>
    )}

    <Typography variant="body2">
      {estadoDialog.lista?.activo
        ? `¿Desactivar "${estadoDialog.lista?.descripcion}"?`
        : `¿Activar "${estadoDialog.lista?.descripcion}"?`}
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
      {loadingEstado ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        'Confirmar'
      )}
    </Button>
  </DialogActions>
</Dialog>
      </ParentCard>
    </PageContainer>
  );
};

export default ListasPrecios;

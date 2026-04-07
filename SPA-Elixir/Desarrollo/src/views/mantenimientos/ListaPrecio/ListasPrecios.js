import React, { useState, useEffect } from 'react';
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
  DialogActions
} from '@mui/material';
import { Switch, FormControlLabel } from '@mui/material';
import { IconPlus, IconEdit, IconCheck, IconX } from '@tabler/icons';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import { 
  obtenerListasPreciosPorMoneda, 
  crearListaPrecio,
  actualizarListaPrecio,
  modificarEstadoListaPrecio
} from '../../../requests/mantenimientos/ListaPrecio/RequestsListaPrecio';

const ListasPrecios = () => {
  const [soloActivos, setSoloActivos] = useState(true);
  const [idMoneda, setIdMoneda] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [listas, setListas] = useState([]);
  const [noResults, setNoResults] = useState(false);


  const [modoEdicion, setModoEdicion] = useState(false);
  const [listaSeleccionada, setListaSeleccionada] = useState(null);
  const [cambiandoEstado, setCambiandoEstado] = useState(null);

  const listasFiltradas = soloActivos
  ? listas.filter(l => l.activo)
  : listas;

  // Dialog para agregar
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    descripcion: ''
  });
  const [loadingForm, setLoadingForm] = useState(false);
  const [errorForm, setErrorForm] = useState(null);

  useEffect(() => {
    if (modoEdicion && listaSeleccionada) {
      setFormData({
        descripcion: listaSeleccionada.descripcion || ''
      });
    }
  }, [modoEdicion, listaSeleccionada]);

  const handleBuscar = async () => {
    if (!idMoneda.trim()) {
      setError('El ID de moneda es obligatorio');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await obtenerListasPreciosPorMoneda(idMoneda.trim());
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

  const handleOpenDialog = () => {
    setModoEdicion(false);
    setListaSeleccionada(null);
    setFormData({ descripcion: '', identificador: '', usuario: '' });
    setErrorForm(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setModoEdicion(false);
    setListaSeleccionada(null);
    setFormData({ descripcion: '', identificador: '', usuario: '' });
    setErrorForm(null);
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGuardar = async () => {
    setErrorForm(null);

    if (!formData.descripcion.trim()) {
      setErrorForm('La descripción es obligatoria');
      return;
    }

    setLoadingForm(true);
    try {
      let res;
      
      if (modoEdicion && listaSeleccionada) {
        // Actualizar lista de precio
        const datosEnvio = {
          descripcion: formData.descripcion.trim(),
          id_moneda: parseInt(idMoneda)
        };
        res = await actualizarListaPrecio(listaSeleccionada.no_lista, datosEnvio);
        
        if (res && res.EsCorrecto !== false) {
          setSuccess('Lista de precio actualizada exitosamente');
          setTimeout(() => setSuccess(null), 3000);
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
          id_moneda: parseInt(idMoneda)
        };
        res = await crearListaPrecio(datosEnvio);
        
        if (res && res.EsCorrecto !== false) {
          setSuccess('Lista de precio creada exitosamente');
          setTimeout(() => setSuccess(null), 3000);
          handleCloseDialog();
          // Recargar la tabla
          try {
            await handleBuscar();
          } catch (reloadErr) {
            console.error('Error al recargar la tabla:', reloadErr);
            // No mostrar error al usuario, ya que la creación fue exitosa
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

  const handleCambiarEstado = async (lista) => {
    setCambiandoEstado(lista.no_lista);
    try {
      const nuevoEstado = !lista.activo;
      const response = await modificarEstadoListaPrecio(lista.no_lista, nuevoEstado);
      console.log('Respuesta al cambiar estado:', response);
      
      if (response && response.EsCorrecto !== false) {
        setSuccess(`Estado actualizado a ${nuevoEstado ? 'Activo' : 'Inactivo'}`);
        setTimeout(() => setSuccess(null), 3000);
        // Recargar la tabla
        await handleBuscar();
      } else {
        setError(response?.Mensaje || 'Error al cambiar el estado');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      setError('Error al cambiar el estado de la lista de precio');
      setTimeout(() => setError(null), 3000);
    } finally {
      setCambiandoEstado(null);
    }
  };

  return (
    <PageContainer title="Listas de precio" description="Mantenimiento de listas de precios">
      <Breadcrumb title="Listas de precio" items={[{ title: 'Mantenimientos' }, { title: 'Listas de precio' }]} />
      <ParentCard title="Listas de precio">
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Box>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="ID Moneda"
                value={idMoneda}
                onChange={(e) => setIdMoneda(e.target.value)}
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
                disabled={!idMoneda.trim()}
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
                    <TableCell>No. Lista</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>ID Moneda</TableCell>
                    <TableCell>Activo</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listasFiltradas.map((lista) => (
                    <TableRow key={lista.no_lista}>
                      <TableCell>{lista.no_lista}</TableCell>
                      <TableCell>{lista.descripcion}</TableCell>
                      <TableCell>{lista.id_moneda}</TableCell>
                      <TableCell>{lista.activo ? 'Sí' : 'No'}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            startIcon={<IconEdit />}
                            onClick={() => {
                              setListaSeleccionada(lista);
                              setModoEdicion(true);
                              setOpenDialog(true);
                            }}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant={lista.activo ? "outlined" : "contained"}
                            color={lista.activo ? "error" : "success"}
                            size="small" 
                            startIcon={lista.activo ? <IconX /> : <IconCheck />}
                            onClick={() => handleCambiarEstado(lista)}
                            disabled={cambiandoEstado === lista.no_lista}
                          >
                            {cambiandoEstado === lista.no_lista ? '...' : (lista.activo ? 'Desactivar' : 'Activar')}
                          </Button>
                        </Stack>
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
            <Alert severity="info">No se encontraron listas de precios para el ID de moneda especificado.</Alert>
          </Box>
        )}

        {/* Dialog para agregar/editar lista de precio */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{modoEdicion ? 'Editar Lista de Precio' : 'Agregar Lista de Precio'}</DialogTitle>
          <DialogContent>
            {errorForm && <Alert severity="error" sx={{ mb: 2 }}>{errorForm}</Alert>}
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChangeForm}
                fullWidth
                autoFocus
              />
              <TextField
                label="ID Moneda"
                value={idMoneda}
                disabled
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={loadingForm}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleGuardar}
              disabled={loadingForm}
            >
              {loadingForm ? <CircularProgress size={20} /> : 'Guardar'}
            </Button>
          </DialogActions>
        </Dialog>
      </ParentCard>
    </PageContainer>
  );
};

export default ListasPrecios;

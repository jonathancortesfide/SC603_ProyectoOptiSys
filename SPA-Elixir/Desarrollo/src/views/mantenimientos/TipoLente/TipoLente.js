import React, { useState, useEffect } from 'react';
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
  TextField
} from '@mui/material';
import { IconPlus, IconEdit, IconCheck, IconX } from '@tabler/icons';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import FormularioTipoLente from './FormularioTipoLente';
import { 
  obtenerTipoLente,
  modificarEstadoTipoLente
} from '../../../requests/mantenimientos/TipoLente/RequestsTipoLente';
import { getSucursalIdentificador } from '../../../utils/sucursal';

const TipoLente = () => {
  const noEmpresaPorDefecto = String(getSucursalIdentificador() ?? '').trim();
  const [noEmpresa] = useState(noEmpresaPorDefecto);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [soloActivos, setSoloActivos] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [cambiandoEstado, setCambiandoEstado] = useState(null);

  const tiposFiltrados = soloActivos ? tipos.filter(t => t.activo === true) : tipos;

  const handleBuscar = async (empresa = noEmpresa) => {
    const empresaActual = String(empresa ?? '').trim();

    if (!empresaActual) {
      setError('No se encontro VITE_SUCURSAL_IDENTIFICADOR para cargar los tipos de lente');
      setTipos([]);
      setNoResults(false);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const data = await obtenerTipoLente(empresaActual);
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

  useEffect(() => {
    handleBuscar(noEmpresaPorDefecto);
  }, [noEmpresaPorDefecto]);

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
    setSuccess('Operación completada exitosamente');
    handleCloseDialog();
    setTimeout(() => setSuccess(null), 3000);
    // Recargar la tabla
    try {
      await handleBuscar();
    } catch (reloadErr) {
      console.error('Error al recargar la tabla:', reloadErr);
    }
  };

  const handleCambiarEstado = async (tipo) => {
    setCambiandoEstado(tipo.no_tipo);
    try {
      const nuevoEstado = !tipo.activo;
      const response = await modificarEstadoTipoLente(tipo.no_tipo, nuevoEstado);
      console.log('Respuesta al cambiar estado:', response);
      
      if (response && response.esCorrecto !== false) {
        setSuccess(`Estado actualizado a ${nuevoEstado ? 'Activo' : 'Inactivo'}`);
        setTimeout(() => setSuccess(null), 3000);
        // Recargar la tabla
        await handleBuscar();
      } else {
        setError(response?.mensaje || 'Error al cambiar el estado');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      setError('Error al cambiar el estado del tipo de lente');
      setTimeout(() => setError(null), 3000);
    } finally {
      setCambiandoEstado(null);
    }
  };

  return (
    <PageContainer title="Tipo de lente" description="Mantenimiento de tipo de lente">
      <Breadcrumb title="Tipo de lente" items={[{ title: 'Mantenimientos' }, { title: 'Tipo de lente' }]} />
      <ParentCard title="Tipo de lente">
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Box>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Button
                variant="contained"
                onClick={handleBuscar}
                disabled={loading}
              >
                Recargar
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<IconPlus />}
                onClick={handleOpenDialog}
                disabled={tipos.length === 0}
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
                    <TableCell>Descripción</TableCell>
                    <TableCell>Activo</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tiposFiltrados.map((tipo) => (
                    <TableRow key={tipo.no_tipo}>
                      <TableCell>{tipo.descripcion}</TableCell>
                      <TableCell>{tipo.activo ? 'Sí' : 'No'}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            startIcon={<IconEdit />}
                            onClick={() => handleEdit(tipo)}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant={tipo.activo ? "outlined" : "contained"}
                            color={tipo.activo ? "error" : "success"}
                            size="small" 
                            startIcon={tipo.activo ? <IconX /> : <IconCheck />}
                            onClick={() => handleCambiarEstado(tipo)}
                            disabled={cambiandoEstado === tipo.no_tipo}
                          >
                            {cambiandoEstado === tipo.no_tipo ? '...' : (tipo.activo ? 'Desactivar' : 'Activar')}
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
            noEmpresa={noEmpresa}
          />
        </Dialog>
      </ParentCard>
    </PageContainer>
  );
};

export default TipoLente;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  Stack,
  TextField,
  CircularProgress,
  Alert,
  TablePagination,
  Chip,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconAlertCircle,
} from '@tabler/icons';
import PageContainer from '../../components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import FormularioProducto from './FormularioProducto';
import useProductos from '../../hooks/useProductos';
import { getCurrentUsername } from '../../utils/session';

/**
 * Componente principal para listar y gestionar productos
 * Integrado completamente con Redux y validaciones
 */
const Productos = () => {
  const {
    productos,
    loading,
    error,
    successMessage,
    paginaActual,
    itemsPorPagina,
    totalItems,
    cargarProductos,
    cambiarEstado,
    eliminar,
    limpiarError,
    limpiarExito,
    setPaginaActual,
    setItemsPorPagina,
  } = useProductos();

  // Estado local
  const [openDialog, setOpenDialog] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Columnas para búsqueda
  const columnasBusqueda = [
    'codigo',
    'codigoInterno',
    'nombre',
    'descripcion',
    'tipoArticulo',
    'codigoCabys',
    'grupo',
    'marca',
  ];

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================

  const obtenerValorBusqueda = (producto, columna) => {
    if (columna === 'esActivo' || columna === 'activo') {
      return producto.esActivo || producto.activo ? 'activo' : 'inactivo';
    }

    let valor = producto[columna];

    if (valor === null || valor === undefined) return '';

    if (typeof valor === 'object') {
      if (valor.nombre) return String(valor.nombre);
      if (valor.descripcion) return String(valor.descripcion);
      try {
        return JSON.stringify(valor);
      } catch {
        return '';
      }
    }

    return String(valor);
  };

  // Filtrar productos
  const productosFiltrados = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return productos;

    return productos.filter((p) =>
      columnasBusqueda.some((col) =>
        obtenerValorBusqueda(p, col).toLowerCase().includes(term)
      )
    );
  }, [productos, searchTerm]);

  // ============================================
  // EFECTOS
  // ============================================

  useEffect(() => {
    cargarProductos(1, '');
  }, [cargarProductos]);

  // Limpiar error después de 5 segundos
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        limpiarError();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [error, limpiarError]);

  // Limpiar éxito después de 3 segundos
  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        limpiarExito();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage, limpiarExito]);

  // ============================================
  // MANEJADORES DE EVENTOS
  // ============================================

  const handleBusqueda = useCallback(
    (e) => {
      const valor = e.target.value;
      setSearchTerm(valor);

      // Limpiar timeout anterior
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Establecer nueva búsqueda con debounce
      const nuevoTimeout = setTimeout(() => {
        if (valor.trim()) {
          cargarProductos(1, valor);
        } else {
          cargarProductos(1, '');
        }
      }, 500);

      setTimeoutId(nuevoTimeout);
    },
    [cargarProductos, timeoutId]
  );

  const handleAbrirFormulario = useCallback((producto = null) => {
    if (producto) {
      setModoEdicion(true);
      setProductoSeleccionado(producto);
    } else {
      setModoEdicion(false);
      setProductoSeleccionado(null);
    }
    setOpenDialog(true);
  }, []);

  const handleCerrarFormulario = useCallback(() => {
    setOpenDialog(false);
    setProductoSeleccionado(null);
    setModoEdicion(false);
  }, []);

  const handleGuardar = useCallback(async () => {
    await cargarProductos(1, searchTerm);
    handleCerrarFormulario();
  }, [cargarProductos, searchTerm, handleCerrarFormulario]);

  const handleEliminar = useCallback((producto) => {
    setConfirmDelete(producto);
  }, []);

  const confirmarEliminacion = useCallback(async () => {
    if (confirmDelete) {
      try {
        await eliminar(confirmDelete.id || confirmDelete.idProducto);
      } catch (err) {
        console.error('Error al eliminar:', err);
      }
      setConfirmDelete(null);
    }
  }, [confirmDelete, eliminar]);

  const handleCambiarEstado = useCallback(
    async (producto) => {
      const nuevoEstado = !(producto.esActivo || producto.activo);
      const usuarioActual = getCurrentUsername();
      try {
        await cambiarEstado(
          producto.id || producto.idProducto,
          nuevoEstado,
          usuarioActual || 'sistema',
          1
        );
      } catch (err) {
        console.error('Error al cambiar estado:', err);
      }
    },
    [cambiarEstado]
  );

  const handleRefrescar = useCallback(() => {
    cargarProductos(1, searchTerm);
  }, [cargarProductos, searchTerm]);

  const handleChangePagina = useCallback(
    (event, newPage) => {
      setPaginaActual(newPage);
    },
    [setPaginaActual]
  );

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      setItemsPorPagina(parseInt(event.target.value, 10));
      setPaginaActual(0);
    },
    [setItemsPorPagina, setPaginaActual]
  );

  // ============================================
  // RENDERIZADO
  // ============================================

  if (loading && productos.length === 0) {
    return (
      <ParentCard title="Productos">
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      </ParentCard>
    );
  }

  const inicio = paginaActual * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  const productosMostrados = productosFiltrados.slice(inicio, fin);

  return (
    <PageContainer title="Productos" description="Gestión de catálogo de productos">
      <ParentCard title="Productos">
        {/* Mensajes */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={limpiarError}>
            <strong>Error:</strong> {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={limpiarExito}>
            {successMessage}
          </Alert>
        )}

        {/* Estadísticas */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1976d2' }}>
                    {totalItems}
                  </Box>
                  <Box sx={{ fontSize: '0.875rem', color: '#666' }}>
                    Total de productos
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                    {productos.filter((p) => p.esActivo || p.activo).length}
                  </Box>
                  <Box sx={{ fontSize: '0.875rem', color: '#666' }}>
                    Activos
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545' }}>
                    {productos.filter((p) => !(p.esActivo || p.activo)).length}
                  </Box>
                  <Box sx={{ fontSize: '0.875rem', color: '#666' }}>
                    Inactivos
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Controles */}
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }} spacing={1}>
          <TextField
            placeholder="Buscar por código, nombre, descripción..."
            size="small"
            sx={{ width: { xs: '100%', sm: 400 } }}
            value={searchTerm}
            onChange={handleBusqueda}
            InputProps={{
              startAdornment: <IconSearch size={18} style={{ marginRight: 8 }} />,
            }}
          />
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refrescar">
              <IconButton color="primary" onClick={handleRefrescar} disabled={loading}>
                <IconRefresh size={20} />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<IconPlus size={20} />}
              onClick={() => handleAbrirFormulario()}
            >
              Nuevo Producto
            </Button>
          </Stack>
        </Stack>

        {/* Tabla */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Código</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Costo</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Costo Final</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Existencia</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                  Estado
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                  Mínimo
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productosMostrados.length > 0 ? (
                productosMostrados.map((producto) => (
                  <TableRow key={producto.id || producto.idProducto} hover>
                    <TableCell>{producto.codigo || producto.codigoInterno}</TableCell>
                    <TableCell>{producto.descripcion || '-'}</TableCell>
                    <TableCell>{producto.costoPromedio ? `₡${producto.costoPromedio.toFixed(2)}` : '-'}</TableCell>
                    <TableCell>{producto.ultimoPrecioCosto ? `₡${producto.ultimoPrecioCosto.toFixed(2)}` : '-'}</TableCell>
                    <TableCell align="right">{producto.existencia || 0}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={
                          producto.esActivo || producto.activo
                            ? 'Activo'
                            : 'Inactivo'
                        }
                        color={
                          producto.esActivo || producto.activo
                            ? 'success'
                            : 'error'
                        }
                        size="small"
                        onClick={() => handleCambiarEstado(producto)}
                        clickable
                      />
                    </TableCell>
                    <TableCell align="center">{producto.minimo || '-'}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleAbrirFormulario(producto)}
                          >
                            <IconEdit size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleEliminar(producto)}
                          >
                            <IconTrash size={18} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <IconAlertCircle size={20} />
                      <span>
                        {searchTerm
                          ? 'No se encontraron productos'
                          : 'No hay productos disponibles'}
                      </span>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        <TablePagination
          component="div"
          count={productosFiltrados.length}
          page={paginaActual}
          onPageChange={handleChangePagina}
          rowsPerPage={itemsPorPagina}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />

        {/* Diálogo de formulario */}
        <Dialog open={openDialog} onClose={handleCerrarFormulario} maxWidth="lg" fullWidth>
          <FormularioProducto
            producto={productoSeleccionado}
            modoEdicion={modoEdicion}
            onGuardar={handleGuardar}
            onCancel={handleCerrarFormulario}
          />
        </Dialog>

        {/* Confirmación de eliminación */}
        <Dialog open={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)}>
          <Box sx={{ p: 3, minWidth: 400 }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconAlertCircle size={24} color="red" />
              <Box sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                Confirmar eliminación
              </Box>
            </Box>
            <Box sx={{ mb: 3, color: '#666' }}>
              ¿Está seguro que desea eliminar el producto "
              <strong>{confirmDelete?.nombre || confirmDelete?.codigoInterno}</strong>"?
              Esta acción no se puede deshacer.
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => setConfirmDelete(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={confirmarEliminacion}
              >
                Eliminar
              </Button>
            </Stack>
          </Box>
        </Dialog>
      </ParentCard>
    </PageContainer>
  );
};

export default Productos;

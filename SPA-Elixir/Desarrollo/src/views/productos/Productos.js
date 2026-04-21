import React, { useState, useEffect, useMemo } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, Stack, TextField, CircularProgress, Alert, TablePagination } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../components/shared/ParentCard';
import FormularioProducto from './FormularioProducto';
import { obtenerListaDeProductos, actualizarProducto } from '../../requests/mantenimientos/producto/RequestsProductos';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons';

const columnasBusqueda = ['codigoInterno','nombre','tipoArticulo','codigoCabys','codigoAuxiliar','activo','unidadMedida','existencia'];

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  // Filtro para mostrar productos activos/inactivos
  const [mostrarSoloActivos, setMostrarSoloActivos] = useState(true);

  const getSearchableString = (p, col) => {
    if (col === 'activo') return p && p.activo ? 'sí' : 'no';
    const val = p ? p[col] : undefined;
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') {
      if (val.nombre) return String(val.nombre);
      if (val.descripcion) return String(val.descripcion);
      try { return JSON.stringify(val); } catch (e) { return '';} 
    }
    return String(val);
  };


  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let prods = productos;
    // Filtro de activos/desactivados
    prods = mostrarSoloActivos ? prods.filter(p => p.activo) : prods.filter(p => !p.activo);
    if (!term) return prods;
    return prods.filter(p => columnasBusqueda.some(col => getSearchableString(p, col).toLowerCase().includes(term)));
  }, [productos, searchTerm, mostrarSoloActivos]);

  useEffect(() => { cargarProductos(); }, []);

  const cargarProductos = async () => {
    setLoading(true); setError(null);
    const data = await obtenerListaDeProductos();
    if (data && Array.isArray(data)) setProductos(data);
    else setError('No se pudieron cargar los productos');
    setLoading(false);
  };

  const handleAbrirFormulario = (p = null) => { if (p) { setModoEdicion(true); setProductoSeleccionado(p); } else { setModoEdicion(false); setProductoSeleccionado(null); } setOpenDialog(true); };
  const handleCerrarFormulario = () => { setOpenDialog(false); setProductoSeleccionado(null); setModoEdicion(false); };
  const handleGuardar = async () => { await cargarProductos(); handleCerrarFormulario(); };

  // Cambiar estado activo/inactivo
  const handleToggleActivo = async (p) => {
    setError(null);
    const res = await actualizarProducto(p.noProducto || p.id, { ...p, activo: !p.activo });
    // Forzar recarga sin cache
    await cargarProductos();
    // Solo mostrar error si la respuesta trae mensaje de error real
  };

  if (loading) return (
    <ParentCard title="Productos"><Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box></ParentCard>
  );

  return (
    <PageContainer title="Productos" description="Listado de productos">
      <Breadcrumb title="Productos" items={[{ title: 'Mantenimientos' }, { title: 'Productos' }]} />
      <ParentCard title="Productos">
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField placeholder="Buscar..." size="small" sx={{ width: 400 }} value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }} />
            <Button variant={mostrarSoloActivos ? "outlined" : "contained"} color="secondary" onClick={() => setMostrarSoloActivos(!mostrarSoloActivos)}>
              {mostrarSoloActivos ? "Ver desactivados" : "Ver activos"}
            </Button>
          </Stack>
          <Button variant="contained" startIcon={<IconPlus />} onClick={() => handleAbrirFormulario()}>Nuevo Producto</Button>
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código interno</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Tipo artículo</TableCell>
                <TableCell>Código CABYS</TableCell>
                <TableCell>Código auxiliar</TableCell>
                <TableCell>Activo</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell align="right">Existencia</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(p => (
                  <TableRow key={p.noProducto || p.id} hover>
                    <TableCell>{p.codigoInterno}</TableCell>
                    <TableCell>{p.nombre}</TableCell>
                    <TableCell>{p.tipoArticulo}</TableCell>
                    <TableCell>{p.codigoCabys}</TableCell>
                    <TableCell>{p.codigoAuxiliar}</TableCell>
                    <TableCell>
                      <Button size="small" color={p.activo ? "success" : "error"} onClick={() => handleToggleActivo(p)}>
                        {p.activo ? "Activo" : "Desactivado"}
                      </Button>
                    </TableCell>
                    <TableCell>{p.unidadMedida}</TableCell>
                    <TableCell align="right">{p.existencia}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button size="small" color="primary" onClick={() => handleAbrirFormulario(p)} startIcon={<IconEdit />}>Editar</Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={9} align="center">No hay productos</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination component="div" count={filteredProducts.length} page={page} onPageChange={(e, newPage) => setPage(newPage)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} rowsPerPageOptions={[5,10,25,50]} />

        <Dialog open={openDialog} onClose={handleCerrarFormulario} maxWidth="lg" fullWidth>
          <FormularioProducto producto={productoSeleccionado} modoEdicion={modoEdicion} onGuardar={handleGuardar} onCancel={handleCerrarFormulario} />
        </Dialog>
      </ParentCard>
    </PageContainer>
  );
};

export default Productos;

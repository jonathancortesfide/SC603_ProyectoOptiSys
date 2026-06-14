import React, { useState, useEffect } from 'react';
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
    TablePagination
} from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import FormularioGrupoProductos from './FormularioGrupoProductos';
import {
    obtenerListaDeGruposProductos,
    eliminarGrupoProducto
} from '../../../requests/mantenimientos/grupoProductos/RequestsGrupoProductos';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons';

const GrupoProductos = () => {
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => { cargarGrupos(); }, []);

    const cargarGrupos = async () => {
        setLoading(true);
        setError(null);
        const data = await obtenerListaDeGruposProductos();
        if (data && data.length >= 0) {
            setGrupos(data);
        } else {
            setError('No se pudieron cargar los grupos de productos');
        }
        setLoading(false);
    };

    const handleAbrirFormulario = (g = null) => {
        if (g) { setModoEdicion(true); setGrupoSeleccionado(g); }
        else { setModoEdicion(false); setGrupoSeleccionado(null); }
        setOpenDialog(true);
    };
    const handleCerrarFormulario = () => { setOpenDialog(false); setGrupoSeleccionado(null); setModoEdicion(false); };
    const handleGuardar = async () => { await cargarGrupos(); handleCerrarFormulario(); };

    const handleEliminar = async (g) => {
        if (!window.confirm(`¿Eliminar ${g.descripcion}?`)) return;
        const res = await eliminarGrupoProducto(g.id);
        if (res && res.EsCorrecto) {
            setGrupos(grupos.filter(x => x.id !== g.id));
        } else {
            setError('No se pudo eliminar el grupo de productos');
        }
    };

    if (loading) return (
        <ParentCard title="Grupos de productos">
            <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>
        </ParentCard>
    );

    const term = searchTerm.trim().toLowerCase();
    const filtered = term ? grupos.filter(x => x.descripcion?.toLowerCase().includes(term)) : grupos;
    const start = page * rowsPerPage;

    return (
        <PageContainer title="Grupos de productos" description="Mantenimiento de grupos de productos">
            <Breadcrumb title="Grupos de productos" items={[{ title: 'Mantenimientos' }, { title: 'Grupos de productos' }]} />
            <ParentCard title="Grupos de productos">
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                    <TextField
                        placeholder="Buscar..."
                        size="small"
                        sx={{ width: 300 }}
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                    />
                    <Button variant="contained" startIcon={<IconPlus />} onClick={() => handleAbrirFormulario()}>
                        Crear grupo
                    </Button>
                </Stack>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Descripción</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.length > 0 ? (
                                filtered.slice(start, start + rowsPerPage).map(g => (
                                    <TableRow key={g.id} hover>
                                        <TableCell>{g.descripcion}</TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Button size="small" color="primary" onClick={() => handleAbrirFormulario(g)} startIcon={<IconEdit />}>
                                                    Editar
                                                </Button>
                                                <Button size="small" color="error" onClick={() => handleEliminar(g)} startIcon={<IconTrash />}>
                                                    Eliminar
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} align="center">No hay grupos</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={filtered.length}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />

                <Dialog open={openDialog} onClose={handleCerrarFormulario} maxWidth="sm" fullWidth>
                    <FormularioGrupoProductos
                        grupo={grupoSeleccionado}
                        modoEdicion={modoEdicion}
                        onGuardar={handleGuardar}
                        onCancel={handleCerrarFormulario}
                    />
                </Dialog>
            </ParentCard>
        </PageContainer>
    );
};

export default GrupoProductos;

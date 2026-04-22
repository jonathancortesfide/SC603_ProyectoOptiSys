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
    TablePagination,
    Chip
} from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import FormularioGrupoProductos from './FormularioGrupoProductos';
import {
    obtenerListaDeGruposProductos,
    cambiarEstadoGrupoProducto
} from '../../../requests/mantenimientos/grupoProductos/RequestsGrupoProductos';
import { IconEdit, IconPlus, IconToggleLeft, IconToggleRight } from '@tabler/icons';
import { getSucursalIdentificador } from '../../../utils/sucursal';
import { getCurrentUsername } from '../../../utils/auth';

const GrupoProductos = () => {
    const noEmpresaPorDefecto = String(getSucursalIdentificador() ?? '').trim();
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => { cargarGrupos(); }, [noEmpresaPorDefecto]);

    const cargarGrupos = async () => {
        if (!noEmpresaPorDefecto) {
            setError('No se encontró la empresa para cargar los grupos');
            setGrupos([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        const data = await obtenerListaDeGruposProductos(noEmpresaPorDefecto);
        if (data && Array.isArray(data.laListaDeGrupos)) {
            setGrupos(data.laListaDeGrupos);
            if (data.esCorrecto === false) {
                setError(data.mensaje || 'No se pudieron cargar los grupos de productos');
            }
        } else {
            setError('No se pudieron cargar los grupos de productos');
            setGrupos([]);
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

    const handleCambiarEstado = async (grupo) => {
        const nuevoEstado = !grupo.activo;
        const accion = nuevoEstado ? 'activar' : 'desactivar';
        if (!window.confirm(`¿Desea ${accion} ${grupo.descripcion}?`)) return;

        const res = await cambiarEstadoGrupoProducto(
            grupo.no_grupo,
            nuevoEstado,
            getCurrentUsername()
        );

        if (res && res.esCorrecto !== false) {
            await cargarGrupos();
        } else {
            setError(res?.mensaje || 'No se pudo cambiar el estado del grupo de productos');
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
                                <TableCell align="center">Estado</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.length > 0 ? (
                                filtered.slice(start, start + rowsPerPage).map(g => (
                                    <TableRow key={g.no_grupo} hover>
                                        <TableCell>{g.descripcion}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={g.activo ? 'Activo' : 'Inactivo'}
                                                color={g.activo ? 'success' : 'default'}
                                                size="small"
                                                variant={g.activo ? 'filled' : 'outlined'}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Button size="small" color="primary" onClick={() => handleAbrirFormulario(g)} startIcon={<IconEdit />}>
                                                    Editar
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color={g.activo ? 'error' : 'success'}
                                                    variant={g.activo ? 'outlined' : 'contained'}
                                                    onClick={() => handleCambiarEstado(g)}
                                                    startIcon={g.activo ? <IconToggleLeft /> : <IconToggleRight />}
                                                >
                                                    {g.activo ? 'Desactivar' : 'Activar'}
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">No hay grupos</TableCell>
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
                        noEmpresa={noEmpresaPorDefecto}
                    />
                </Dialog>
            </ParentCard>
        </PageContainer>
    );
};

export default GrupoProductos;

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
import FormularioClasificacionPacientes from './FormularioClasificacionPacientes';
import {
    obtenerListaDeClasificacionesPacientes,
    eliminarClasificacionPaciente
} from '../../../requests/mantenimientos/clasificacionPacientes/RequestsClasificacionPacientes';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons';

const ClasificacionPacientes = () => {
    const [clasificaciones, setClasificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [clasificacionSeleccionada, setClasificacionSeleccionada] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => { cargarClasificaciones(); }, []);

    const cargarClasificaciones = async () => {
        setLoading(true);
        setError(null);
        const data = await obtenerListaDeClasificacionesPacientes();
        if (data && data.length >= 0) {
            setClasificaciones(data);
        } else {
            setError('No se pudieron cargar las clasificaciones de pacientes');
        }
        setLoading(false);
    };

    const handleAbrirFormulario = (c = null) => {
        if (c) { setModoEdicion(true); setClasificacionSeleccionada(c); }
        else { setModoEdicion(false); setClasificacionSeleccionada(null); }
        setOpenDialog(true);
    };
    const handleCerrarFormulario = () => { setOpenDialog(false); setClasificacionSeleccionada(null); setModoEdicion(false); };
    const handleGuardar = async () => { await cargarClasificaciones(); handleCerrarFormulario(); };

    const handleEliminar = async (c) => {
        if (!window.confirm(`¿Eliminar ${c.descripcion}?`)) return;
        const res = await eliminarClasificacionPaciente(c.id);
        if (res && res.EsCorrecto) {
            setClasificaciones(clasificaciones.filter(x => x.id !== c.id));
        } else {
            setError('No se pudo eliminar la clasificación de pacientes');
        }
    };

    if (loading) return (
        <ParentCard title="Clasificación de pacientes">
            <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>
        </ParentCard>
    );

    const term = searchTerm.trim().toLowerCase();
    const filtered = term ? clasificaciones.filter(x => x.descripcion?.toLowerCase().includes(term)) : clasificaciones;
    const start = page * rowsPerPage;

    return (
        <PageContainer title="Clasificación de pacientes" description="Mantenimiento de clasificación de pacientes">
            <Breadcrumb title="Clasificación de pacientes" items={[{ title: 'Mantenimientos' }, { title: 'Clasificación de pacientes' }]} />
            <ParentCard title="Clasificación de pacientes">
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
                        Crear clasificación
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
                                filtered.slice(start, start + rowsPerPage).map(c => (
                                    <TableRow key={c.id} hover>
                                        <TableCell>{c.descripcion}</TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Button size="small" color="primary" onClick={() => handleAbrirFormulario(c)} startIcon={<IconEdit />}>
                                                    Editar
                                                </Button>
                                                <Button size="small" color="error" onClick={() => handleEliminar(c)} startIcon={<IconTrash />}>
                                                    Eliminar
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} align="center">No hay clasificaciones</TableCell>
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
                    <FormularioClasificacionPacientes
                        clasificacion={clasificacionSeleccionada}
                        modoEdicion={modoEdicion}
                        onGuardar={handleGuardar}
                        onCancel={handleCerrarFormulario}
                    />
                </Dialog>
            </ParentCard>
        </PageContainer>
    );
};

export default ClasificacionPacientes;

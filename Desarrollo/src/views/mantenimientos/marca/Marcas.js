import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, Stack, TextField, CircularProgress, Alert } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import FormularioMarca from './FormularioMarca';
import { obtenerListaDeMarcas, eliminarMarca } from '../../../requests/mantenimientos/marca/RequestsMarcas';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons';

const Marcas = () => {
    const [marcas, setMarcas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);

    useEffect(() => { cargarMarcas(); }, []);

    const cargarMarcas = async () => {
        setLoading(true);
        setError(null);
        const data = await obtenerListaDeMarcas();
        if (data && data.length >= 0) {
            setMarcas(data);
        } else {
            setError('No se pudieron cargar las marcas');
        }
        setLoading(false);
    };

    const handleAbrirFormulario = (m = null) => {
        if (m) { setModoEdicion(true); setMarcaSeleccionada(m); }
        else { setModoEdicion(false); setMarcaSeleccionada(null); }
        setOpenDialog(true);
    };
    const handleCerrarFormulario = () => { setOpenDialog(false); setMarcaSeleccionada(null); setModoEdicion(false); };
    const handleGuardar = async () => { await cargarMarcas(); handleCerrarFormulario(); };

    const handleEliminar = async (m) => {
        if (!window.confirm(`¿Eliminar ${m.descripcion}?`)) return;
        const res = await eliminarMarca(m.id);
        if (res && res.EsCorrecto) {
            setMarcas(marcas.filter(x => x.id !== m.id));
        } else {
            setError('No se pudo eliminar la marca');
        }
    };

    if (loading) return (
        <ParentCard title="Marcas">
            <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>
        </ParentCard>
    );

    return (
        <PageContainer title="Marcas" description="Mantenimiento de marcas">
            <Breadcrumb title="Marcas" items={[{ title: 'Mantenimientos' }, { title: 'Marcas' }]} />
            <ParentCard title="Marcas">
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                    <TextField placeholder="Buscar..." size="small" sx={{ width: 300 }} />
                    <Button variant="contained" startIcon={<IconPlus />} onClick={() => handleAbrirFormulario()}>Crear Marca</Button>
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
                            {marcas.length > 0 ? marcas.map(m => (
                                <TableRow key={m.id} hover>
                                    <TableCell>{m.descripcion}</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Button size="small" color="primary" onClick={() => handleAbrirFormulario(m)} startIcon={<IconEdit />}>Editar</Button>
                                            <Button size="small" color="error" onClick={() => handleEliminar(m)} startIcon={<IconTrash />}>Eliminar</Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={2} align="center">No hay marcas</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={openDialog} onClose={handleCerrarFormulario} maxWidth="sm" fullWidth>
                    <FormularioMarca marca={marcaSeleccionada} modoEdicion={modoEdicion} onGuardar={handleGuardar} onCancel={handleCerrarFormulario} />
                </Dialog>
            </ParentCard>
        </PageContainer>
    );
};

export default Marcas;

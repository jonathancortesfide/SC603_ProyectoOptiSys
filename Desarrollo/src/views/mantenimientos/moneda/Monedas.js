import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, Stack, TextField, CircularProgress, Alert } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import FormularioMoneda from './FormularioMoneda';
import { obtenerListaDeMonedas, eliminarMoneda } from '../../../requests/mantenimientos/moneda/RequestsMonedas';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons';

const Monedas = () => {
    const [monedas, setMonedas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [monedaSeleccionada, setMonedaSeleccionada] = useState(null);

    useEffect(() => { cargarMonedas(); }, []);

    const cargarMonedas = async () => {
        setLoading(true);
        setError(null);
        const data = await obtenerListaDeMonedas();
        if (data && data.length >= 0) {
            setMonedas(data);
        } else {
            setError('No se pudieron cargar las monedas');
        }
        setLoading(false);
    };

    const handleAbrirFormulario = (m = null) => {
        if (m) { setModoEdicion(true); setMonedaSeleccionada(m); }
        else { setModoEdicion(false); setMonedaSeleccionada(null); }
        setOpenDialog(true);
    };
    const handleCerrarFormulario = () => { setOpenDialog(false); setMonedaSeleccionada(null); setModoEdicion(false); };
    const handleGuardar = async () => { await cargarMonedas(); handleCerrarFormulario(); };

    const handleEliminar = async (m) => {
        if (!window.confirm(`¿Eliminar ${m.descripcion}?`)) return;
        const res = await eliminarMoneda(m.id);
        if (res && res.EsCorrecto) {
            setMonedas(monedas.filter(x => x.id !== m.id));
        } else {
            setError('No se pudo eliminar la moneda');
        }
    };

    if (loading) return (
        <ParentCard title="Monedas">
            <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>
        </ParentCard>
    );

    return (
        <PageContainer title="Monedas" description="Mantenimiento de monedas">
            <Breadcrumb title="Monedas" items={[{ title: 'Mantenimientos' }, { title: 'Monedas' }]} />
            <ParentCard title="Monedas">
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                    <TextField placeholder="Buscar..." size="small" sx={{ width: 300 }} />
                    <Button variant="contained" startIcon={<IconPlus />} onClick={() => handleAbrirFormulario()}>Crear Moneda</Button>
                </Stack>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Signo</TableCell>
                                <TableCell>Abreviatura</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {monedas.length > 0 ? monedas.map(m => (
                                <TableRow key={m.id} hover>
                                    <TableCell>{m.descripcion}</TableCell>
                                    <TableCell>{m.signo}</TableCell>
                                    <TableCell>{m.abreviatura}</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Button size="small" color="primary" onClick={() => handleAbrirFormulario(m)} startIcon={<IconEdit />}>Editar</Button>
                                            <Button size="small" color="error" onClick={() => handleEliminar(m)} startIcon={<IconTrash />}>Eliminar</Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">No hay monedas</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={openDialog} onClose={handleCerrarFormulario} maxWidth="sm" fullWidth>
                    <FormularioMoneda moneda={monedaSeleccionada} modoEdicion={modoEdicion} onGuardar={handleGuardar} onCancel={handleCerrarFormulario} />
                </Dialog>
            </ParentCard>
        </PageContainer>
    );
};

export default Monedas;

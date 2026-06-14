import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { IconPlus, IconToggleLeft, IconToggleRight } from '@tabler/icons';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import {
    cambiarEstadoEnfermedad,
    obtenerEnfermedadesPorIdentificador,
} from '../../../requests/mantenimientos/enfermedad/RequestsEnfermedades';
import { getCurrentUsername } from '../../../utils/session';
import { getSucursalIdentificador } from '../../../utils/sucursal';
import FormularioEnfermedad from './FormularioEnfermedad';

const Enfermedades = () => {
    const [enfermedades, setEnfermedades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [openAgregar, setOpenAgregar] = useState(false);
    const [estadoDialog, setEstadoDialog] = useState({ open: false, enfermedad: null });
    const [loadingEstado, setLoadingEstado] = useState(false);
    const [errorEstado, setErrorEstado] = useState(null);
    const successTimerRef = useRef(null);

    useEffect(() => {
        cargarEnfermedades();
    }, []);

    useEffect(() => () => {
        if (successTimerRef.current) {
            clearTimeout(successTimerRef.current);
            successTimerRef.current = null;
        }
    }, []);

    const enfermedadesFiltradas = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        const lista = [...enfermedades].sort((a, b) => a.descripcion.localeCompare(b.descripcion));

        if (!term) return lista;

        return lista.filter((item) => (`${item.descripcion} ${item.tipoEnfermedad} ${item.idEnfermedad}`)
            .toLowerCase()
            .includes(term));
    }, [enfermedades, searchTerm]);

    const showSuccess = (payload) => {
        setSuccess(payload);
        setSuccessOpen(true);

        if (successTimerRef.current) clearTimeout(successTimerRef.current);
        successTimerRef.current = setTimeout(() => setSuccessOpen(false), 3500);
    };

    const cargarEnfermedades = async () => {
        setLoading(true);
        setError(null);

        const resp = await obtenerEnfermedadesPorIdentificador(getSucursalIdentificador());

        if (resp?.datos !== undefined) {
            setEnfermedades(resp.datos);
            if (!resp.esCorrecto) setError(resp.mensaje || 'No se pudieron cargar las enfermedades');
        } else {
            setError('No se pudieron cargar las enfermedades');
        }

        setLoading(false);
    };

    const handleAbrirCambioEstado = (enfermedad) => {
        setEstadoDialog({ open: true, enfermedad });
        setErrorEstado(null);
    };

    const handleCerrarCambioEstado = () => {
        setEstadoDialog({ open: false, enfermedad: null });
        setErrorEstado(null);
    };

    const handleConfirmarCambioEstado = async () => {
        const enfermedad = estadoDialog.enfermedad;
        const usuario = getCurrentUsername();
        const nuevoEstado = !enfermedad.activo;

        setLoadingEstado(true);
        setErrorEstado(null);

        const res = await cambiarEstadoEnfermedad(enfermedad.numeroEnfermedad, nuevoEstado, usuario);

        if (res?.esCorrecto) {
            handleCerrarCambioEstado();
            showSuccess({
                message: `Enfermedad ${nuevoEstado ? 'activada' : 'desactivada'} correctamente`,
                severity: 'success',
            });
            await cargarEnfermedades();
        } else {
            setErrorEstado(res?.mensaje || 'No se pudo cambiar el estado');
        }

        setLoadingEstado(false);
    };

    if (loading) {
        return (
            <ParentCard title="Enfermedades">
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                </Box>
            </ParentCard>
        );
    }

    return (
        <PageContainer title="Enfermedades" description="Mantenimiento de enfermedades">
            <Breadcrumb title="Enfermedades" items={[{ title: 'Mantenimientos' }, { title: 'Enfermedades' }]} />
            <ParentCard title="Enfermedades por sucursal">
                {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
                {success && (
                    <Collapse in={successOpen} timeout={250} onExited={() => setSuccess(null)}>
                        <Alert severity={success.severity ?? 'success'} sx={{ mb: 2 }} onClose={() => setSuccessOpen(false)}>
                            {success.message ?? String(success)}
                        </Alert>
                    </Collapse>
                )}

                <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <TextField
                        size="small"
                        label="Buscar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ minWidth: { xs: '100%', md: 320 } }}
                    />

                    <Button variant="contained" startIcon={<IconPlus />} onClick={() => setOpenAgregar(true)}>
                        Agregar enfermedad
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Descripción</strong></TableCell>
                                <TableCell><strong>Tipo</strong></TableCell>
                                <TableCell align="center"><strong>Estado</strong></TableCell>
                                <TableCell align="center"><strong>Acciones</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {enfermedadesFiltradas.length > 0 ? enfermedadesFiltradas.map((item) => (
                                <TableRow key={item.numeroEnfermedad} hover>
                                    <TableCell>{item.descripcion}</TableCell>
                                    <TableCell>{item.tipoEnfermedad}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={item.activo ? 'Activo' : 'Inactivo'}
                                            color={item.activo ? 'success' : 'default'}
                                            size="small"
                                            variant={item.activo ? 'filled' : 'outlined'}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            size="small"
                                            color="info"
                                            variant={item.activo ? 'outlined' : 'contained'}
                                            startIcon={item.activo ? <IconToggleLeft /> : <IconToggleRight />}
                                            onClick={() => handleAbrirCambioEstado(item)}
                                            sx={{ minWidth: 126 }}
                                        >
                                            {item.activo ? 'Desactivar' : 'Activar'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">No hay enfermedades registradas</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={openAgregar} onClose={() => setOpenAgregar(false)} maxWidth="sm" fullWidth>
                    <FormularioEnfermedad
                        onGuardar={async (payload) => {
                            setOpenAgregar(false);
                            showSuccess(payload);
                            await cargarEnfermedades();
                        }}
                        onCancel={() => setOpenAgregar(false)}
                    />
                </Dialog>

                <Dialog open={estadoDialog.open} onClose={handleCerrarCambioEstado} maxWidth="xs" fullWidth>
                    <DialogTitle>
                        {estadoDialog.enfermedad?.activo ? 'Desactivar enfermedad' : 'Activar enfermedad'}
                    </DialogTitle>
                    <DialogContent>
                        {errorEstado && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{errorEstado}</Alert>}
                        <Typography variant="body2">
                            {estadoDialog.enfermedad?.activo
                                ? `¿Desactivar "${estadoDialog.enfermedad?.descripcion}"?`
                                : `¿Activar "${estadoDialog.enfermedad?.descripcion}"?`}
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
                        <Button variant="contained" color="info" onClick={handleConfirmarCambioEstado} disabled={loadingEstado}>
                            {loadingEstado ? <CircularProgress size={20} color="inherit" /> : 'Confirmar'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </ParentCard>
        </PageContainer>
    );
};

export default Enfermedades;
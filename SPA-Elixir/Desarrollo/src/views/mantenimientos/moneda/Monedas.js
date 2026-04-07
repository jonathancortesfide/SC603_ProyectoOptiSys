import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Dialog, CircularProgress, Alert, Chip, Collapse,
    DialogTitle, DialogContent, DialogActions, Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { IconPlus, IconToggleLeft, IconToggleRight } from '@tabler/icons';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import FormularioMoneda from './FormularioMoneda';
import {
    obtenerMonedasPorIdentificador,
    cambiarEstadoMoneda,
} from '../../../requests/mantenimientos/moneda/RequestsMonedas';
import { getSucursalIdentificador } from '../../../utils/sucursal';

// TODO: obtener del usuario loggeado (fallback en utils/sucursal)
const USUARIO = 'jonathan';

const Monedas = () => {
    const [monedas, setMonedas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);
    const successTimerRef = useRef(null);

    const monedasActivas = monedas.filter((m) => m.activo);

    // Dialog agregar
    const [openAgregar, setOpenAgregar] = useState(false);

    // Dialog cambiar estado
    const [estadoDialog, setEstadoDialog] = useState({ open: false, moneda: null });
    const [loadingEstado, setLoadingEstado] = useState(false);
    const [errorEstado, setErrorEstado] = useState(null);

    useEffect(() => { cargarMonedas(); }, []);

    useEffect(() => () => {
        if (successTimerRef.current) {
            clearTimeout(successTimerRef.current);
            successTimerRef.current = null;
        }
    }, []);

    const showSuccess = (payload) => {
        setSuccess(payload);
        setSuccessOpen(true);

        if (successTimerRef.current) clearTimeout(successTimerRef.current);
        // Close slightly before clearing to allow the collapse animation to play.
        successTimerRef.current = setTimeout(() => setSuccessOpen(false), 3500);
    };

    const cargarMonedas = async () => {
        setLoading(true);
        setError(null);
        const resp = await obtenerMonedasPorIdentificador(getSucursalIdentificador());
        if (resp && resp.laListaDeMonedas !== undefined) {
            setMonedas(resp.laListaDeMonedas);
            if (!resp.esCorrecto) setError(resp.mensaje || 'No se pudieron cargar las monedas');
        } else {
            setError('No se pudieron cargar las monedas');
        }
        setLoading(false);
    };

    // ── Agregar ──────────────────────────────────────────────
    const handleGuardar = async () => {
        setOpenAgregar(false);
        showSuccess({ message: 'Moneda agregada correctamente', severity: 'info' });
        await cargarMonedas();
    };

    // ── Cambiar estado ───────────────────────────────────────
    const handleAbrirCambioEstado = (moneda) => {
        setEstadoDialog({ open: true, moneda });
        setErrorEstado(null);
    };

    const handleCerrarCambioEstado = () => {
        setEstadoDialog({ open: false, moneda: null });
        setErrorEstado(null);
    };

    const handleConfirmarCambioEstado = async () => {
        const { moneda } = estadoDialog;
        setLoadingEstado(true);
        setErrorEstado(null);

        const nuevoEstado = !moneda.activo;
        // idMoneda = PK de MonedaSucursal, distinto de numeroDeMoneda (FK hacia catálogo Moneda)
        const res = await cambiarEstadoMoneda(moneda.idMoneda, nuevoEstado, USUARIO);

        if (res && res.esCorrecto) {
            handleCerrarCambioEstado();
            showSuccess({
                message: `Moneda ${nuevoEstado ? 'activada' : 'desactivada'} correctamente`,
                severity: 'info',
            });
            await cargarMonedas();
        } else {
            setErrorEstado(res?.mensaje || 'No se pudo cambiar el estado');
        }
        setLoadingEstado(false);
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
                {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
                {success && (
                    <Collapse
                        in={successOpen}
                        timeout={250}
                        onExited={() => setSuccess(null)}
                    >
                        <Alert
                            severity={success.severity ?? 'success'}
                            sx={{ mb: 2 }}
                            onClose={() => setSuccessOpen(false)}
                        >
                            {success.message ?? String(success)}
                        </Alert>
                    </Collapse>
                )}

                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" startIcon={<IconPlus />} onClick={() => setOpenAgregar(true)}>
                        Agregar moneda
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>#</strong></TableCell>
                                <TableCell><strong>Descripción</strong></TableCell>
                                <TableCell><strong>Signo</strong></TableCell>
                                <TableCell align="center"><strong>Estado</strong></TableCell>
                                <TableCell align="center"><strong>Acciones</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {monedasActivas.length > 0 ? monedasActivas.map((m) => (
                                <TableRow key={m.idMoneda} hover>
                                    <TableCell>{m.numeroDeMoneda}</TableCell>
                                    <TableCell>{m.descripcion}</TableCell>
                                    <TableCell>{m.signo}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={m.activo ? 'Activo' : 'Inactivo'}
                                            color={m.activo ? 'success' : 'default'}
                                            size="small"
                                            variant={m.activo ? 'filled' : 'outlined'}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            size="small"
                                            color="info"
                                            variant={m.activo ? 'outlined' : 'contained'}
                                            startIcon={m.activo ? <IconToggleLeft /> : <IconToggleRight />}
                                            onClick={() => handleAbrirCambioEstado(m)}
                                        >
                                            {m.activo ? 'Desactivar' : 'Activar'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">No hay monedas</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* ── Dialog: Agregar moneda ── */}
                <Dialog open={openAgregar} onClose={() => setOpenAgregar(false)} maxWidth="sm" fullWidth>
                    <FormularioMoneda onGuardar={handleGuardar} onCancel={() => setOpenAgregar(false)} />
                </Dialog>

                {/* ── Dialog: Cambiar estado ── */}
                <Dialog open={estadoDialog.open} onClose={handleCerrarCambioEstado} maxWidth="xs" fullWidth>
                    <DialogTitle>
                        {estadoDialog.moneda?.activo ? 'Desactivar moneda' : 'Activar moneda'}
                    </DialogTitle>
                    <DialogContent>
                        {errorEstado && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{errorEstado}</Alert>}
                        <Typography variant="body2">
                            {estadoDialog.moneda?.activo
                                ? `¿Desactivar "${estadoDialog.moneda?.descripcion}"?`
                                : `¿Activar "${estadoDialog.moneda?.descripcion}"?`}
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
                        <Button
                            variant="contained"
                            color="info"
                            onClick={handleConfirmarCambioEstado}
                            disabled={loadingEstado}
                        >
                            {loadingEstado ? <CircularProgress size={20} color="inherit" /> : 'Confirmar'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </ParentCard>
        </PageContainer>
    );
};

export default Monedas;

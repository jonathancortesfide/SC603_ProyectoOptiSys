import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, Stack, TextField,
    CircularProgress, Alert, TablePagination, Chip, Collapse, DialogTitle, DialogContent, DialogActions, Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import FormularioMarca from './FormularioMarca';
import {
    obtenerMarcas,
    normalizarListaMarcas,
    modificarEstadoMarca,
    noMarcaDe,
    descripcionMarcaDe,
    esActivoMarca,
} from '../../../requests/mantenimientos/marca/RequestsMarcas';
import { getNoEmpresa } from '../../../utils/empresa';
import { getSucursalIdentificador } from '../../../utils/sucursal';
import { IconEdit, IconPlus, IconToggleLeft, IconToggleRight } from '@tabler/icons';

const USUARIO = 'jonathan';

const respuestaOk = (res) => res && (res.esCorrecto === true || res.EsCorrecto === true);

const Marcas = () => {
    const [marcas, setMarcas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);
    const successTimerRef = useRef(null);

    const [openDialog, setOpenDialog] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [estadoDialog, setEstadoDialog] = useState({ open: false, marca: null });
    const [loadingEstado, setLoadingEstado] = useState(false);
    const [errorEstado, setErrorEstado] = useState(null);

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
        successTimerRef.current = setTimeout(() => setSuccessOpen(false), 3500);
    };

    const cargarMarcas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const noEmpresa = getNoEmpresa();
            const resp = await obtenerMarcas(noEmpresa, '');
            const lista = normalizarListaMarcas(resp);
            if (resp && lista !== undefined) {
                setMarcas(lista);
                if (resp.esCorrecto === false || resp.EsCorrecto === false) {
                    setError(resp.mensaje ?? resp.Mensaje ?? 'No se pudieron cargar las marcas');
                } else if (!respuestaOk(resp) && (resp.mensaje || resp.Mensaje)) {
                    setError(resp.mensaje ?? resp.Mensaje);
                }
            } else {
                setError('No se pudieron cargar las marcas');
            }
        } catch (err) {
            console.error('[Marcas]', err);
            setError('No se pudieron cargar las marcas');
            setMarcas([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarMarcas();
    }, [cargarMarcas]);

    const handleAbrirFormulario = (m = null) => {
        if (m) { setModoEdicion(true); setMarcaSeleccionada(m); }
        else { setModoEdicion(false); setMarcaSeleccionada(null); }
        setOpenDialog(true);
    };
    const handleCerrarFormulario = () => { setOpenDialog(false); setMarcaSeleccionada(null); setModoEdicion(false); };
    const handleGuardar = async () => {
        const fueEdicion = modoEdicion;
        handleCerrarFormulario();
        showSuccess({
            message: fueEdicion ? 'Marca actualizada correctamente' : 'Marca agregada correctamente',
            severity: 'info',
        });
        await cargarMarcas();
    };

    const handleAbrirCambioEstado = (marca) => {
        setEstadoDialog({ open: true, marca });
        setErrorEstado(null);
    };

    const handleCerrarCambioEstado = () => {
        setEstadoDialog({ open: false, marca: null });
        setErrorEstado(null);
    };

    const handleConfirmarCambioEstado = async () => {
        const { marca } = estadoDialog;
        if (!marca) return;
        setLoadingEstado(true);
        setErrorEstado(null);

        const nuevoEstado = !esActivoMarca(marca);
        const nm = noMarcaDe(marca);
        const noMarcaNum = Number.parseInt(String(nm), 10);

        const res = await modificarEstadoMarca({
            noMarca: Number.isFinite(noMarcaNum) ? noMarcaNum : 0,
            usuario: USUARIO,
            esActivo: nuevoEstado,
            identificador: getSucursalIdentificador(),
        });

        if (respuestaOk(res)) {
            handleCerrarCambioEstado();
            showSuccess({
                message: `Marca ${nuevoEstado ? 'activada' : 'desactivada'} correctamente`,
                severity: 'info',
            });
            await cargarMarcas();
        } else {
            setErrorEstado(res?.mensaje ?? res?.Mensaje ?? 'No se pudo cambiar el estado');
        }
        setLoadingEstado(false);
    };

    if (loading) return (
        <ParentCard title="Marcas">
            <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>
        </ParentCard>
    );

    const term = searchTerm.trim().toLowerCase();
    const filtered = term
        ? marcas.filter((x) => descripcionMarcaDe(x).toLowerCase().includes(term))
        : marcas;
    const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <PageContainer title="Marcas" description="Mantenimiento de marcas">
            <ParentCard title="Marcas">
                {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
                {success && (
                    <Collapse in={successOpen} timeout={250} onExited={() => setSuccess(null)}>
                        <Alert
                            severity={success.severity ?? 'success'}
                            sx={{ mb: 2 }}
                            onClose={() => setSuccessOpen(false)}
                        >
                            {success.message ?? String(success)}
                        </Alert>
                    </Collapse>
                )}
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                    <TextField
                        placeholder="Buscar..."
                        size="small"
                        sx={{ width: 300 }}
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                    />
                    <Button variant="contained" startIcon={<IconPlus />} onClick={() => handleAbrirFormulario()}>
                        Crear Marca
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
                            {paginated.length > 0 ? (
                                paginated.map((m) => (
                                    <TableRow key={String(noMarcaDe(m))} hover>
                                        <TableCell>{descripcionMarcaDe(m)}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={esActivoMarca(m) ? 'Activo' : 'Inactivo'}
                                                color={esActivoMarca(m) ? 'success' : 'default'}
                                                size="small"
                                                variant={esActivoMarca(m) ? 'filled' : 'outlined'}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                    onClick={() => handleAbrirFormulario(m)}
                                                    startIcon={<IconEdit />}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="info"
                                                    variant={esActivoMarca(m) ? 'outlined' : 'contained'}
                                                    startIcon={esActivoMarca(m) ? <IconToggleLeft /> : <IconToggleRight />}
                                                    onClick={() => handleAbrirCambioEstado(m)}
                                                >
                                                    {esActivoMarca(m) ? 'Desactivar' : 'Activar'}
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">No hay marcas</TableCell>
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
                    labelRowsPerPage="Filas por página"
                />

                <Dialog open={openDialog} onClose={handleCerrarFormulario} maxWidth="sm" fullWidth>
                    <FormularioMarca
                        marca={marcaSeleccionada}
                        modoEdicion={modoEdicion}
                        onGuardar={handleGuardar}
                        onCancel={handleCerrarFormulario}
                    />
                </Dialog>

                <Dialog open={estadoDialog.open} onClose={handleCerrarCambioEstado} maxWidth="xs" fullWidth>
                    <DialogTitle>
                        {esActivoMarca(estadoDialog.marca) ? 'Desactivar marca' : 'Activar marca'}
                    </DialogTitle>
                    <DialogContent>
                        {errorEstado && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{errorEstado}</Alert>}
                        <Typography variant="body2">
                            {esActivoMarca(estadoDialog.marca)
                                ? `¿Desactivar "${descripcionMarcaDe(estadoDialog.marca)}"?`
                                : `¿Activar "${descripcionMarcaDe(estadoDialog.marca)}"?`}
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

export default Marcas;

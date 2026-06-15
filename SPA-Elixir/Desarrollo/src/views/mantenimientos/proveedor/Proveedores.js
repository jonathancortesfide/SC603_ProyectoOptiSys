import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Dialog, CircularProgress, Alert, Chip, Collapse,
    DialogTitle, DialogContent, DialogActions, Typography, Stack, TextField, TablePagination,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { IconPlus, IconToggleLeft, IconToggleRight, IconEdit } from '@tabler/icons';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import FormularioProveedor from './FormularioProveedor';
import {
    obtenerProveedores,
    normalizarListaProveedores,
    modificarEstadoProveedor,
    noProveedorDe,
} from '../../../requests/mantenimientos/proveedor/RequestsProveedores';
import { getSucursalIdentificador } from '../../../utils/sucursal';

// TODO: obtener del usuario loggeado (fallback en utils/sucursal)
const USUARIO = 'jonathan';

const respuestaOk = (res) => res && (res.esCorrecto === true || res.EsCorrecto === true);

const nombreMostrar = (p) => p?.nombre ?? p?.Nombre ?? p?.descripcion ?? p?.Descripcion ?? p?.razonSocial ?? p?.RazonSocial ?? '—';

const cedulaMostrar = (p) => p?.cedula ?? p?.Cedula ?? '—';

const telefonoMostrar = (p) => p?.telefono1 ?? p?.Telefono1 ?? p?.telefono ?? p?.Telefono ?? '—';

const correoMostrar = (p) => p?.email ?? p?.Email ?? p?.correoElectronico ?? p?.CorreoElectronico ?? '—';

const esLaboratorioMostrar = (p) => !!(p?.esLaboratorio ?? p?.EsLaboratorio);

const activoDe = (p) => {
    if (p?.esActivo !== undefined) return !!p.esActivo;
    if (p?.EsActivo !== undefined) return !!p.EsActivo;
    if (p?.activo !== undefined) return !!p.activo;
    if (p?.Activo !== undefined) return !!p.Activo;
    return true;
};

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);
    const successTimerRef = useRef(null);

    const [openFormulario, setOpenFormulario] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [estadoDialog, setEstadoDialog] = useState({ open: false, proveedor: null });
    const [loadingEstado, setLoadingEstado] = useState(false);
    const [errorEstado, setErrorEstado] = useState(null);

    useEffect(() => { cargarProveedores(); }, []);

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

    const cargarProveedores = async () => {
        setLoading(true);
        setError(null);
        const resp = await obtenerProveedores(getSucursalIdentificador());
        const lista = normalizarListaProveedores(resp);
        if (resp && lista !== undefined) {
            setProveedores(lista);
            const ok = respuestaOk(resp);
            if (resp.esCorrecto === false || resp.EsCorrecto === false) {
                setError(resp.mensaje ?? resp.Mensaje ?? 'No se pudieron cargar los proveedores');
            } else if (!ok && resp.mensaje) {
                setError(resp.mensaje);
            }
        } else {
            setError('No se pudieron cargar los proveedores');
        }
        setLoading(false);
    };

    const handleAbrirAgregar = () => {
        setModoEdicion(false);
        setProveedorSeleccionado(null);
        setOpenFormulario(true);
    };

    const handleAbrirEditar = (p) => {
        setModoEdicion(true);
        setProveedorSeleccionado(p);
        setOpenFormulario(true);
    };

    const handleCerrarFormulario = () => {
        setOpenFormulario(false);
        setProveedorSeleccionado(null);
        setModoEdicion(false);
    };

    const handleGuardarFormulario = async () => {
        const fueEdicion = modoEdicion;
        handleCerrarFormulario();
        showSuccess({
            message: fueEdicion ? 'Proveedor actualizado correctamente' : 'Proveedor agregado correctamente',
            severity: 'info',
        });
        await cargarProveedores();
    };

    const handleAbrirCambioEstado = (proveedor) => {
        setEstadoDialog({ open: true, proveedor });
        setErrorEstado(null);
    };

    const handleCerrarCambioEstado = () => {
        setEstadoDialog({ open: false, proveedor: null });
        setErrorEstado(null);
    };

    const handleConfirmarCambioEstado = async () => {
        const { proveedor } = estadoDialog;
        setLoadingEstado(true);
        setErrorEstado(null);

        const nuevoEstado = !activoDe(proveedor);
        const np = noProveedorDe(proveedor);
        const noProveedorNum = Number.parseInt(String(np), 10);

        const res = await modificarEstadoProveedor({
            noProveedor: Number.isFinite(noProveedorNum) ? noProveedorNum : 0,
            usuario: USUARIO,
            esActivo: nuevoEstado,
            identificador: getSucursalIdentificador(),
        });

        if (respuestaOk(res)) {
            handleCerrarCambioEstado();
            showSuccess({
                message: `Proveedor ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`,
                severity: 'info',
            });
            await cargarProveedores();
        } else {
            setErrorEstado(res?.mensaje ?? res?.Mensaje ?? 'No se pudo cambiar el estado');
        }
        setLoadingEstado(false);
    };

    if (loading) return (
        <ParentCard title="Proveedores">
            <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>
        </ParentCard>
    );

    const term = searchTerm.trim().toLowerCase();
    const filtered = term
        ? proveedores.filter((p) => {
            const haystack = [
                cedulaMostrar(p),
                nombreMostrar(p),
                telefonoMostrar(p),
                correoMostrar(p),
            ].join(' ').toLowerCase();
            return haystack.includes(term);
        })
        : proveedores;
    const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <PageContainer title="Proveedores" description="Mantenimiento de proveedores">
            <Breadcrumb title="Proveedores" items={[{ title: 'Mantenimientos' }, { title: 'Proveedores' }]} />
            <ParentCard title="Proveedores">
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

                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                    <TextField
                        placeholder="Buscar..."
                        size="small"
                        sx={{ width: 300 }}
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                    />
                    <Button variant="contained" startIcon={<IconPlus />} onClick={handleAbrirAgregar}>
                        Agregar proveedor
                    </Button>
                </Stack>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Cédula</strong></TableCell>
                                <TableCell><strong>Nombre</strong></TableCell>
                                <TableCell><strong>Tel. 1</strong></TableCell>
                                <TableCell><strong>Correo</strong></TableCell>
                                <TableCell align="center"><strong>Lab.</strong></TableCell>
                                <TableCell align="center"><strong>Estado</strong></TableCell>
                                <TableCell align="center"><strong>Acciones</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginated.length > 0 ? paginated.map((p) => (
                                <TableRow key={noProveedorDe(p)} hover>
                                    <TableCell>{cedulaMostrar(p)}</TableCell>
                                    <TableCell>{nombreMostrar(p)}</TableCell>
                                    <TableCell>{telefonoMostrar(p)}</TableCell>
                                    <TableCell>{correoMostrar(p)}</TableCell>
                                    <TableCell align="center">{esLaboratorioMostrar(p) ? 'Sí' : 'No'}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={activoDe(p) ? 'Activo' : 'Inactivo'}
                                            color={activoDe(p) ? 'success' : 'default'}
                                            size="small"
                                            variant={activoDe(p) ? 'filled' : 'outlined'}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                                            <Button
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                startIcon={<IconEdit />}
                                                onClick={() => handleAbrirEditar(p)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="small"
                                                color="info"
                                                variant={activoDe(p) ? 'outlined' : 'contained'}
                                                startIcon={activoDe(p) ? <IconToggleLeft /> : <IconToggleRight />}
                                                onClick={() => handleAbrirCambioEstado(p)}
                                            >
                                                {activoDe(p) ? 'Desactivar' : 'Activar'}
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">No hay proveedores</TableCell>
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

                <Dialog open={openFormulario} onClose={handleCerrarFormulario} maxWidth="md" fullWidth>
                    <FormularioProveedor
                        proveedor={proveedorSeleccionado}
                        modoEdicion={modoEdicion}
                        onGuardar={handleGuardarFormulario}
                        onCancel={handleCerrarFormulario}
                    />
                </Dialog>

                <Dialog open={estadoDialog.open} onClose={handleCerrarCambioEstado} maxWidth="xs" fullWidth>
                    <DialogTitle>
                        {activoDe(estadoDialog.proveedor) ? 'Desactivar proveedor' : 'Activar proveedor'}
                    </DialogTitle>
                    <DialogContent>
                        {errorEstado && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{errorEstado}</Alert>}
                        <Typography variant="body2">
                            {activoDe(estadoDialog.proveedor)
                                ? `¿Desactivar "${nombreMostrar(estadoDialog.proveedor)}"?`
                                : `¿Activar "${nombreMostrar(estadoDialog.proveedor)}"?`}
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

export default Proveedores;

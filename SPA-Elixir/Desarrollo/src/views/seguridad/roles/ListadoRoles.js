import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    IconButton,
    Stack,
    TextField,
    CircularProgress,
    Alert,
} from '@mui/material';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons';
import { alpha } from '@mui/material/styles';
import ParentCard from '../../../components/shared/ParentCard';
import FormularioRol from './FormularioRol';
import { obtenerListaDeRoles, eliminarRol } from '../../../requests/roles/RequestsRoles';

const ListadoRoles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [rolSeleccionado, setRolSeleccionado] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Dialog cambiar estado
    const [estadoDialog, setEstadoDialog] = useState({ open: false, rol: null });
    const [loadingEstado, setLoadingEstado] = useState(false);

    useEffect(() => {
        cargarRoles();
    }, []);

    const cargarRoles = async () => {
        setLoading(true);
        setError(null);
        const data = await obtenerListaDeRoles();
        if (Array.isArray(data)) {
            setRoles(data);
        } else {
            setError('No se pudieron cargar los roles');
        }
        setLoading(false);
    };

    const handleAbrirFormulario = (rol = null) => {
        if (rol) {
            setModoEdicion(true);
            setRolSeleccionado(rol);
        } else {
            setModoEdicion(false);
            setRolSeleccionado(null);
        }
        setOpenDialog(true);
    };

    const handleCerrarFormulario = () => {
        setOpenDialog(false);
        setRolSeleccionado(null);
        setModoEdicion(false);
    };

    const handleGuardarRol = async () => {
        await cargarRoles();
        handleCerrarFormulario();
    };

    const handleEliminarRol = (rol) => {
        setEstadoDialog({ open: true, rol });
    };

    const handleCerrarEstadoDialog = () => {
        setEstadoDialog({ open: false, rol: null });
    };

    const handleConfirmarEstado = async () => {
        const { rol } = estadoDialog;
        const siguienteEstado = !rol.esActivo;
        setLoadingEstado(true);
        const resultado = await eliminarRol(rol.id, siguienteEstado);
        setLoadingEstado(false);
        if (resultado.EsCorrecto) {
            handleCerrarEstadoDialog();
            await cargarRoles();
        } else {
            const accion = siguienteEstado ? 'activar' : 'inactivar';
            setError(resultado.Mensaje || `Error al ${accion} el rol`);
            handleCerrarEstadoDialog();
        }
    };

    const rolesFiltrados = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return roles;
        return roles.filter(rol => rol.nombre?.toLowerCase().includes(term));
    }, [roles, searchTerm]);

    const rolesPaginados = useMemo(() => {
        const start = page * rowsPerPage;
        return rolesFiltrados.slice(start, start + rowsPerPage);
    }, [rolesFiltrados, page, rowsPerPage]);

    if (loading) {
        return (
            <ParentCard title="Gestión de Roles">
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                </Box>
            </ParentCard>
        );
    }

    return (
        <ParentCard title="Gestión de Roles">
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Stack spacing={2} sx={{ mb: 2 }}>
                <Stack direction="row" spacing={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TextField
                        placeholder="Buscar rol..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        sx={{ flex: 1 }}
                    />
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<IconPlus size={18} />}
                        onClick={() => handleAbrirFormulario()}
                    >
                        Crear Rol
                    </Button>
                </Stack>
            </Stack>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><strong>Nombre del Rol</strong></TableCell>
                            <TableCell><strong>Descripción</strong></TableCell>
                            <TableCell align="center"><strong>Estado</strong></TableCell>
                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rolesFiltrados.length > 0 ? (
                            rolesPaginados.map((rol) => (
                                <TableRow key={rol.id} hover>
                                    <TableCell>{rol.nombre}</TableCell>
                                    <TableCell>{rol.descripcion || '-'}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={rol.esActivo ? 'Activo' : 'Inactivo'}
                                            color={rol.esActivo ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={0.5} justifyContent="center">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleAbrirFormulario(rol)}
                                                title="Gestionar permisos"
                                            >
                                                <IconEdit size={18} />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color={rol.esActivo ? 'error' : 'success'}
                                                onClick={() => handleEliminarRol(rol)}
                                                title={rol.esActivo ? 'Inactivar' : 'Activar'}
                                            >
                                                <IconTrash size={18} />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    No hay roles disponibles
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={rolesFiltrados.length}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                rowsPerPageOptions={[5,10,25,50]}
            />

            {/* Dialog Formulario Rol */}
            <Dialog open={openDialog} onClose={handleCerrarFormulario} maxWidth="md" fullWidth>
                <FormularioRol
                    rol={rolSeleccionado}
                    modoEdicion={modoEdicion}
                    onGuardar={handleGuardarRol}
                    onCancel={handleCerrarFormulario}
                />
            </Dialog>

            {/* Dialog cambiar estado */}
            <Dialog open={estadoDialog.open} onClose={handleCerrarEstadoDialog} maxWidth="xs" fullWidth>
                <DialogTitle>
                    {estadoDialog.rol?.esActivo ? 'Inactivar rol' : 'Activar rol'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        {estadoDialog.rol?.esActivo
                            ? `¿Está seguro de inactivar el rol "${estadoDialog.rol?.nombre}"?`
                            : `¿Está seguro de activar el rol "${estadoDialog.rol?.nombre}"?`}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={handleCerrarEstadoDialog}
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
                        color={estadoDialog.rol?.esActivo ? 'error' : 'success'}
                        onClick={handleConfirmarEstado}
                        disabled={loadingEstado}
                    >
                        {loadingEstado
                            ? <CircularProgress size={20} color="inherit" />
                            : estadoDialog.rol?.esActivo ? 'Inactivar' : 'Activar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </ParentCard>
    );
};

export default ListadoRoles;

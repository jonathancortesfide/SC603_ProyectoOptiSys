import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    IconButton,
    Chip,
    Stack,
    TextField,
    CircularProgress,
    Alert,
} from '@mui/material';
import { IconEdit, IconTrash, IconLock, IconPlus } from '@tabler/icons';
import ParentCard from '../../../components/shared/ParentCard';
import FormularioUsuario from './FormularioUsuario';
import CambiarContrasena from './CambiarContrasena';
import { obtenerListaDeUsuarios, eliminarUsuario } from '../../../requests/usuarios/RequestsUsuarios';

const ListadoUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        setLoading(true);
        setError(null);
        const data = await obtenerListaDeUsuarios();
        if (data && data.length > 0) {
            setUsuarios(data);
        } else {
            setError('No se pudieron cargar los usuarios');
        }
        setLoading(false);
    };

    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    const handleAbrirFormulario = (usuario = null) => {
        if (usuario) {
            setModoEdicion(true);
            setUsuarioSeleccionado(usuario);
        } else {
            setModoEdicion(false);
            setUsuarioSeleccionado(null);
        }
        setOpenDialog(true);
    };

    const handleCerrarFormulario = () => {
        setOpenDialog(false);
        setUsuarioSeleccionado(null);
        setModoEdicion(false);
    };

    const handleGuardarUsuario = async () => {
        await cargarUsuarios();
        handleCerrarFormulario();
    };

    const handleAbrirCambioContrasena = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setOpenPasswordDialog(true);
    };

    const handleCerrarCambioContrasena = () => {
        setOpenPasswordDialog(false);
        setUsuarioSeleccionado(null);
    };

    const handleEliminarUsuario = async (usuario) => {
        if (window.confirm(`¿Está seguro de eliminar el usuario ${usuario.nombre}?`)) {
            const resultado = await eliminarUsuario(usuario.id);
            if (resultado.EsCorrecto) {
                setUsuarios(usuarios.filter(u => u.id !== usuario.id));
            } else {
                setError('Error al eliminar el usuario');
            }
        }
    };

    const usuariosFiltrados = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return usuarios;
        return usuarios.filter(usuario =>
            usuario.nombre?.toLowerCase().includes(term) ||
            usuario.login?.toLowerCase().includes(term) ||
            usuario.email?.toLowerCase().includes(term)
        );
    }, [usuarios, searchTerm]);

    const usuariosPaginados = useMemo(() => {
        const start = page * rowsPerPage;
        return usuariosFiltrados.slice(start, start + rowsPerPage);
    }, [usuariosFiltrados, page, rowsPerPage]);

    if (loading) {
        return (
            <ParentCard title="Gestión de Usuarios">
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                </Box>
            </ParentCard>
        );
    }

    return (
        <ParentCard title="Gestión de Usuarios">
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Stack spacing={2} sx={{ mb: 2 }}>
                <Stack direction="row" spacing={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TextField
                        placeholder="Buscar por nombre, login o email..."
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
                        Crear Usuario
                    </Button>
                </Stack>
            </Stack>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><strong>Login</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Nombre</strong></TableCell>
                            <TableCell align="center"><strong>Es Doctor</strong></TableCell>
                            <TableCell><strong>Código Profesional</strong></TableCell>
                            <TableCell><strong>Teléfono</strong></TableCell>
                            <TableCell><strong>Fecha Nacimiento</strong></TableCell>
                            <TableCell align="center"><strong>Edad</strong></TableCell>
                            <TableCell align="center"><strong>Activo</strong></TableCell>
                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuariosFiltrados.length > 0 ? (
                            usuariosPaginados.map((usuario) => (
                                <TableRow key={usuario.id} hover>
                                    <TableCell>{usuario.login}</TableCell>
                                    <TableCell>{usuario.email}</TableCell>
                                    <TableCell>{usuario.nombre}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={usuario.esDoctor ? 'Sí' : 'No'}
                                            color={usuario.esDoctor ? 'primary' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{usuario.codigoProfesional || '-'}</TableCell>
                                    <TableCell>{usuario.telefono || '-'}</TableCell>
                                    <TableCell>
                                        {usuario.fechaNacimiento
                                            ? new Date(usuario.fechaNacimiento).toLocaleDateString('es-ES')
                                            : '-'}
                                    </TableCell>
                                    <TableCell align="center">
                                        {usuario.fechaNacimiento ? calcularEdad(usuario.fechaNacimiento) : '-'}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={usuario.esActivo ? 'Activo' : 'Inactivo'}
                                            color={usuario.esActivo ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={0.5} justifyContent="center">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleAbrirFormulario(usuario)}
                                                title="Editar"
                                            >
                                                <IconEdit size={18} />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="warning"
                                                onClick={() => handleAbrirCambioContrasena(usuario)}
                                                title="Cambiar contraseña"
                                            >
                                                <IconLock size={18} />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleEliminarUsuario(usuario)}
                                                title="Eliminar"
                                            >
                                                <IconTrash size={18} />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                                    No hay usuarios disponibles
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={usuariosFiltrados.length}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                rowsPerPageOptions={[5,10,25,50]}
            />

            {/* Dialog Formulario Usuario */}
            <Dialog open={openDialog} onClose={handleCerrarFormulario} maxWidth="sm" fullWidth>
                <FormularioUsuario
                    usuario={usuarioSeleccionado}
                    modoEdicion={modoEdicion}
                    onGuardar={handleGuardarUsuario}
                    onCancel={handleCerrarFormulario}
                />
            </Dialog>

            {/* Dialog Cambiar Contraseña */}
            <Dialog open={openPasswordDialog} onClose={handleCerrarCambioContrasena} maxWidth="xs" fullWidth>
                <CambiarContrasena
                    usuario={usuarioSeleccionado}
                    onCancel={handleCerrarCambioContrasena}
                    onSuccess={() => {
                        handleCerrarCambioContrasena();
                        alert('Contraseña cambiada correctamente');
                    }}
                />
            </Dialog>
        </ParentCard>
    );
};

export default ListadoUsuarios;

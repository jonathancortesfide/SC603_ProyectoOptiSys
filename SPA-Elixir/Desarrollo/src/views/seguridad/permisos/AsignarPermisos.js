import React, { useState, useEffect } from 'react';
import {
    Box,
    IconButton,
    Stack,
    TextField,
    CircularProgress,
    Alert,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Divider,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { IconPlus, IconTrash } from '@tabler/icons';
import ParentCard from '../../../components/shared/ParentCard';
import {
    obtenerListaDeUsuarios,
} from '../../../requests/usuarios/RequestsUsuarios';
import {
    obtenerListaDeRoles,
    obtenerRolesDelUsuario,
    asignarRolAUsuario,
    desvincularRolDelUsuario,
} from '../../../requests/roles/RequestsRoles';

const AsignarPermisos = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [rolesDelUsuario, setRolesDelUsuario] = useState([]);
    const [rolesDisponibles, setRolesDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchUsuarios, setSearchUsuarios] = useState('');
    const [success, setSuccess] = useState(null);

    // Dialog desvincular rol
    const [desvincularDialog, setDesvincularDialog] = useState({ open: false, rol: null });
    const [loadingDesvincular, setLoadingDesvincular] = useState(false);

    useEffect(() => {
        cargarDatos();
    }, []);

    const getUsuarioId = (usuario) => usuario?.id ?? usuario?.idUsuario;

    const getNombreUsuario = (usuario) => usuario?.nombre || usuario?.email || 'Usuario';

    const getRolesDisponibles = (rolesActivos, asignaciones = []) => {
        const asignacionesPorRol = new Map(asignaciones.map((asignacion) => [asignacion.idRol, asignacion]));

        return rolesActivos
            .filter((rol) => {
                const asignacion = asignacionesPorRol.get(rol.id);
                return !asignacion || !asignacion.esActivo;
            })
            .map((rol) => {
                const asignacion = asignacionesPorRol.get(rol.id);
                return asignacion
                    ? { ...rol, idUsuarioRol: asignacion.idUsuarioRol, esActivo: asignacion.esActivo }
                    : rol;
            });
    };

    const cargarDatos = async () => {
        setLoading(true);
        setError(null);
        try {
            const usuariosData = await obtenerListaDeUsuarios();
            const rolesData = await obtenerListaDeRoles();

            setUsuarios(usuariosData || []);
            setRoles((rolesData || []).filter((rol) => rol.esActivo));
        } catch (err) {
            setError('Error al cargar los datos');
        }
        setLoading(false);
    };

    const handleSeleccionarUsuario = async (usuario) => {
        setUsuarioSeleccionado(usuario);
        setRolesDelUsuario([]);
        setRolesDisponibles([]);

        const usuarioId = getUsuarioId(usuario);
        const rolesAsignados = await obtenerRolesDelUsuario(usuarioId);
        const asignaciones = rolesAsignados || [];

        setRolesDelUsuario(asignaciones.filter((rolAsignado) => rolAsignado.esActivo));
        setRolesDisponibles(getRolesDisponibles(roles, asignaciones));
    };

    const handleAsignarRol = async (rol) => {
        if (!usuarioSeleccionado) return;

        const usuarioId = getUsuarioId(usuarioSeleccionado);
        const resultado = rol.idUsuarioRol && !rol.esActivo
            ? await desvincularRolDelUsuario(usuarioId, rol.idUsuarioRol, true)
            : await asignarRolAUsuario(usuarioId, rol.id);

        if (resultado.esCorrecto) {
            await handleSeleccionarUsuario(usuarioSeleccionado);
            setSuccess(`Rol ${rol.nombre} asignado correctamente`);
            setTimeout(() => setSuccess(null), 3000);
        } else {
            setError(resultado.mensaje || 'Error al asignar el rol');
        }
    };

    const handleDesvincularRol = (rol) => {
        if (!usuarioSeleccionado) return;
        setDesvincularDialog({ open: true, rol });
    };

    const handleCerrarDesvincular = () => {
        setDesvincularDialog({ open: false, rol: null });
    };

    const handleConfirmarDesvincular = async () => {
        const { rol } = desvincularDialog;
        const usuarioId = getUsuarioId(usuarioSeleccionado);
        setLoadingDesvincular(true);
        const resultado = await desvincularRolDelUsuario(usuarioId, rol.idUsuarioRol, false);
        setLoadingDesvincular(false);

        if (resultado.esCorrecto) {
            handleCerrarDesvincular();
            await handleSeleccionarUsuario(usuarioSeleccionado);
            setSuccess(`Rol ${rol.nombre} desvinculado correctamente`);
            setTimeout(() => setSuccess(null), 3000);
        } else {
            setError(resultado.mensaje || 'Error al desvincular el rol');
            handleCerrarDesvincular();
        }
    };

    const usuariosFiltrados = usuarios.filter(usuario =>
        usuario.nombre?.toLowerCase().includes(searchUsuarios.toLowerCase()) ||
        usuario.email?.toLowerCase().includes(searchUsuarios.toLowerCase())
    );

    if (loading) {
        return (
            <ParentCard title="Asignar Roles">
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                </Box>
            </ParentCard>
        );
    }

    return (
        <ParentCard title="Asignar Roles a Usuarios">
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Columna 1: Listado de Usuarios */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardHeader title="Usuarios" subheader="Seleccione un usuario" />
                        <Divider />
                        <CardContent sx={{ maxHeight: '500px', overflow: 'auto', p: 0 }}>
                            <Stack spacing={1} sx={{ p: 2 }}>
                                <TextField
                                    placeholder="Buscar usuario..."
                                    value={searchUsuarios}
                                    onChange={(e) => setSearchUsuarios(e.target.value)}
                                    size="small"
                                    fullWidth
                                />

                                <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                                    {usuariosFiltrados.length > 0 ? (
                                        usuariosFiltrados.map(usuario => (
                                            <Box
                                                key={getUsuarioId(usuario)}
                                                onClick={() => handleSeleccionarUsuario(usuario)}
                                                sx={{
                                                    p: 2,
                                                    mb: 1,
                                                    borderRadius: 1,
                                                    backgroundColor: getUsuarioId(usuarioSeleccionado) === getUsuarioId(usuario) ? '#e3f2fd' : '#f5f5f5',
                                                    border: getUsuarioId(usuarioSeleccionado) === getUsuarioId(usuario) ? '2px solid #1976d2' : '1px solid #ddd',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s',
                                                    '&:hover': {
                                                        backgroundColor: '#e3f2fd',
                                                        borderColor: '#1976d2',
                                                    }
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                    {getNombreUsuario(usuario)}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#666' }}>
                                                    {usuario.email || '-'}
                                                </Typography>
                                            </Box>
                                        ))
                                    ) : (
                                        <Box sx={{ p: 2, textAlign: 'center' }}>
                                            <Typography variant="body2" sx={{ color: '#999' }}>
                                                No hay usuarios disponibles
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Columna 2: Roles Disponibles */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardHeader
                            title="Roles Disponibles"
                            subheader={usuarioSeleccionado ? `Para ${getNombreUsuario(usuarioSeleccionado)}` : 'Seleccione un usuario'}
                        />
                        <Divider />
                        <CardContent sx={{ maxHeight: '500px', overflow: 'auto' }}>
                            <Stack spacing={1}>
                                {usuarioSeleccionado ? (
                                    rolesDisponibles.length > 0 ? (
                                        rolesDisponibles.map(rol => (
                                            <Box
                                                key={rol.id}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    p: 1.5,
                                                    backgroundColor: '#f9f9f9',
                                                    borderRadius: 1,
                                                    border: '1px solid #ddd',
                                                    '&:hover': {
                                                        backgroundColor: '#f0f0f0',
                                                    }
                                                }}
                                            >
                                                <Typography variant="body2">
                                                    {rol.nombre}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    color="success"
                                                    onClick={() => handleAsignarRol(rol)}
                                                >
                                                    <IconPlus size={18} />
                                                </IconButton>
                                            </Box>
                                        ))
                                    ) : (
                                        <Box sx={{ p: 2, textAlign: 'center' }}>
                                            <Typography variant="body2" sx={{ color: '#999' }}>
                                                Todos los roles están asignados
                                            </Typography>
                                        </Box>
                                    )
                                ) : (
                                    <Box sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="body2" sx={{ color: '#999' }}>
                                            Seleccione un usuario
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Columna 3: Roles Asignados */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardHeader
                            title="Roles Asignados"
                            subheader={usuarioSeleccionado ? `Para ${getNombreUsuario(usuarioSeleccionado)}` : 'Seleccione un usuario'}
                        />
                        <Divider />
                        <CardContent sx={{ maxHeight: '500px', overflow: 'auto' }}>
                            <Stack spacing={1}>
                                {usuarioSeleccionado ? (
                                    rolesDelUsuario.length > 0 ? (
                                        rolesDelUsuario.map(rol => (
                                            <Box
                                                key={rol.id}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    p: 1.5,
                                                    backgroundColor: '#e8f5e9',
                                                    borderRadius: 1,
                                                    border: '1px solid #4caf50',
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                    {rol.nombre}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDesvincularRol(rol)}
                                                >
                                                    <IconTrash size={18} />
                                                </IconButton>
                                            </Box>
                                        ))
                                    ) : (
                                        <Box sx={{ p: 2, textAlign: 'center' }}>
                                            <Typography variant="body2" sx={{ color: '#999' }}>
                                                Sin roles asignados
                                            </Typography>
                                        </Box>
                                    )
                                ) : (
                                    <Box sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="body2" sx={{ color: '#999' }}>
                                            Seleccione un usuario
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* ── Dialog: Desvincular rol ── */}
            <Dialog open={desvincularDialog.open} onClose={handleCerrarDesvincular} maxWidth="xs" fullWidth>
                <DialogTitle>Desvincular rol</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        {`¿Desea desvincular el rol "${desvincularDialog.rol?.nombre}"?`}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={handleCerrarDesvincular}
                        disabled={loadingDesvincular}
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
                        color="error"
                        onClick={handleConfirmarDesvincular}
                        disabled={loadingDesvincular}
                    >
                        {loadingDesvincular ? <CircularProgress size={20} color="inherit" /> : 'Desvincular'}
                    </Button>
                </DialogActions>
            </Dialog>
        </ParentCard>
    );
};

export default AsignarPermisos;

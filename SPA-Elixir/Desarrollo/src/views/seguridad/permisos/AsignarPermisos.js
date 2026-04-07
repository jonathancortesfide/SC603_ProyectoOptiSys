import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
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
    Chip,
} from '@mui/material';
import { IconPlus, IconTrash } from '@tabler/icons';
import ParentCard from '../../../components/shared/ParentCard';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import {
    obtenerListaDeUsuarios,
    obtenerUsuarioPorId,
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

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        setError(null);
        try {
            const usuariosData = await obtenerListaDeUsuarios();
            const rolesData = await obtenerListaDeRoles();

            setUsuarios(usuariosData || []);
            setRoles(rolesData || []);
        } catch (err) {
            setError('Error al cargar los datos');
        }
        setLoading(false);
    };

    const handleSeleccionarUsuario = async (usuario) => {
        setUsuarioSeleccionado(usuario);
        setRolesDelUsuario([]);
        setRolesDisponibles([]);

        // Obtener roles asignados al usuario
        const rolesAsignados = await obtenerRolesDelUsuario(usuario.id);
        setRolesDelUsuario(rolesAsignados || []);

        // Calcular roles disponibles (no asignados)
        const rolesAsignadosIds = (rolesAsignados || []).map(r => r.id);
        const disponibles = roles.filter(r => !rolesAsignadosIds.includes(r.id));
        setRolesDisponibles(disponibles);
    };

    const handleAsignarRol = async (rol) => {
        if (!usuarioSeleccionado) return;

        const resultado = await asignarRolAUsuario(usuarioSeleccionado.id, rol.id);

        if (resultado.EsCorrecto) {
            // Actualizar listas
            setRolesDelUsuario([...rolesDelUsuario, rol]);
            setRolesDisponibles(rolesDisponibles.filter(r => r.id !== rol.id));
            setSuccess(`Rol ${rol.nombre} asignado correctamente`);
            setTimeout(() => setSuccess(null), 3000);
        } else {
            setError('Error al asignar el rol');
        }
    };

    const handleDesvincularRol = async (rol) => {
        if (!usuarioSeleccionado) return;

        if (window.confirm(`¿Desea desvincular el rol ${rol.nombre}?`)) {
            const resultado = await desvincularRolDelUsuario(usuarioSeleccionado.id, rol.id);

            if (resultado.EsCorrecto) {
                // Actualizar listas
                setRolesDelUsuario(rolesDelUsuario.filter(r => r.id !== rol.id));
                setRolesDisponibles([...rolesDisponibles, rol]);
                setSuccess(`Rol ${rol.nombre} desvinculado correctamente`);
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError('Error al desvincular el rol');
            }
        }
    };

    const usuariosFiltrados = usuarios.filter(usuario =>
        usuario.nombre?.toLowerCase().includes(searchUsuarios.toLowerCase()) ||
        usuario.login?.toLowerCase().includes(searchUsuarios.toLowerCase()) ||
        usuario.email?.toLowerCase().includes(searchUsuarios.toLowerCase())
    );

    if (loading) {
        return (
            <ParentCard title="Asignar Permisos">
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                </Box>
            </ParentCard>
        );
    }

    return (
        <ParentCard title="Asignar Permisos a Usuarios">
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
                                                key={usuario.id}
                                                onClick={() => handleSeleccionarUsuario(usuario)}
                                                sx={{
                                                    p: 2,
                                                    mb: 1,
                                                    borderRadius: 1,
                                                    backgroundColor: usuarioSeleccionado?.id === usuario.id ? '#e3f2fd' : '#f5f5f5',
                                                    border: usuarioSeleccionado?.id === usuario.id ? '2px solid #1976d2' : '1px solid #ddd',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s',
                                                    '&:hover': {
                                                        backgroundColor: '#e3f2fd',
                                                        borderColor: '#1976d2',
                                                    }
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                    {usuario.nombre}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#666' }}>
                                                    {usuario.login}
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
                            subheader={usuarioSeleccionado ? `Para ${usuarioSeleccionado.nombre}` : 'Seleccione un usuario'}
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
                            subheader={usuarioSeleccionado ? `Para ${usuarioSeleccionado.nombre}` : 'Seleccione un usuario'}
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
        </ParentCard>
    );
};

export default AsignarPermisos;

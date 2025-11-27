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
} from '@mui/material';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons';
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

    useEffect(() => {
        cargarRoles();
    }, []);

    const cargarRoles = async () => {
        setLoading(true);
        setError(null);
        const data = await obtenerListaDeRoles();
        if (data && data.length > 0) {
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

    const handleEliminarRol = async (rol) => {
        if (window.confirm(`¿Está seguro de eliminar el rol ${rol.nombre}?`)) {
            const resultado = await eliminarRol(rol.id);
            if (resultado.EsCorrecto) {
                setRoles(roles.filter(r => r.id !== rol.id));
            } else {
                setError('Error al eliminar el rol');
            }
        }
    };

    const rolesFiltrados = roles.filter(rol =>
        rol.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rolesFiltrados.length > 0 ? (
                            rolesFiltrados.map((rol) => (
                                <TableRow key={rol.id} hover>
                                    <TableCell>{rol.nombre}</TableCell>
                                    <TableCell>{rol.descripcion || '-'}</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={0.5} justifyContent="center">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleAbrirFormulario(rol)}
                                                title="Editar"
                                            >
                                                <IconEdit size={18} />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleEliminarRol(rol)}
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
                                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                    No hay roles disponibles
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog Formulario Rol */}
            <Dialog open={openDialog} onClose={handleCerrarFormulario} maxWidth="md" fullWidth>
                <FormularioRol
                    rol={rolSeleccionado}
                    modoEdicion={modoEdicion}
                    onGuardar={handleGuardarRol}
                    onCancel={handleCerrarFormulario}
                />
            </Dialog>
        </ParentCard>
    );
};

export default ListadoRoles;

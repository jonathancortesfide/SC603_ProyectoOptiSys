import React, { useState, useEffect } from 'react';
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Stack,
    Alert,
    CircularProgress,
    FormControlLabel,
    Checkbox,
    Typography,
} from '@mui/material';
import { TreeView, TreeItem } from '@mui/lab';
import { IconChevronDown, IconChevronRight } from '@tabler/icons';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { crearRol, actualizarRol, obtenerPermisos } from '../../../requests/roles/RequestsRoles';

const FormularioRol = ({ rol, modoEdicion, onGuardar, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        permisos: []
    });

    const [permisos, setPermisos] = useState([]);
    const [permisosSeleccionados, setPermisosSeleccionados] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedNodes, setExpandedNodes] = useState([]);

    useEffect(() => {
        cargarPermisos();
        if (modoEdicion && rol) {
            setFormData({
                nombre: rol.nombre || '',
                descripcion: rol.descripcion || '',
                permisos: rol.permisos || []
            });
            if (rol.permisos) {
                setPermisosSeleccionados(new Set(rol.permisos.map(p => p.id)));
            }
        }
    }, [rol, modoEdicion]);

    const cargarPermisos = async () => {
        const data = await obtenerPermisos();
        if (data && data.length > 0) {
            setPermisos(data);
            // Expandir todos los módulos por defecto
            const modulos = data.map(p => `modulo-${p.moduloId}`);
            setExpandedNodes(modulos);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTogglePermiso = (permisoId) => {
        const newSet = new Set(permisosSeleccionados);
        if (newSet.has(permisoId)) {
            newSet.delete(permisoId);
        } else {
            newSet.add(permisoId);
        }
        setPermisosSeleccionados(newSet);
    };

    const handleToggleModulo = (moduloId) => {
        const permisosDelModulo = permisos.filter(p => p.moduloId === moduloId);
        const todosSeleccionados = permisosDelModulo.every(p => permisosSeleccionados.has(p.id));
        
        const newSet = new Set(permisosSeleccionados);
        
        if (todosSeleccionados) {
            // Desseleccionar todos del módulo
            permisosDelModulo.forEach(p => newSet.delete(p.id));
        } else {
            // Seleccionar todos del módulo
            permisosDelModulo.forEach(p => newSet.add(p.id));
        }
        
        setPermisosSeleccionados(newSet);
    };

    const handleToggleNode = (nodeId) => {
        setExpandedNodes(prev => {
            if (prev.includes(nodeId)) {
                return prev.filter(id => id !== nodeId);
            } else {
                return [...prev, nodeId];
            }
        });
    };

    const validarFormulario = () => {
        if (!formData.nombre) {
            setError('El nombre del rol es requerido');
            return false;
        }
        if (permisosSeleccionados.size === 0) {
            setError('Debe seleccionar al menos un permiso');
            return false;
        }
        return true;
    };

    const handleGuardar = async () => {
        setError(null);
        if (!validarFormulario()) {
            return;
        }

        setLoading(true);
        try {
            const dataGuardar = {
                ...formData,
                permisos: Array.from(permisosSeleccionados)
            };

            let resultado;
            if (modoEdicion) {
                resultado = await actualizarRol(rol.id, dataGuardar);
            } else {
                resultado = await crearRol(dataGuardar);
            }

            if (resultado.EsCorrecto) {
                onGuardar();
            } else {
                setError(resultado.Mensaje || 'Error al guardar el rol');
            }
        } catch (err) {
            setError('Error al procesar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    // Agrupar permisos por módulo
    const permisosAgrupados = {};
    permisos.forEach(permiso => {
        if (!permisosAgrupados[permiso.moduloNombre]) {
            permisosAgrupados[permiso.moduloNombre] = [];
        }
        permisosAgrupados[permiso.moduloNombre].push(permiso);
    });

    return (
        <>
            <DialogTitle>
                {modoEdicion ? 'Editar Rol' : 'Crear Nuevo Rol'}
            </DialogTitle>
            <DialogContent sx={{ pt: 2, maxHeight: '70vh', overflow: 'auto' }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Stack spacing={2}>
                    <Box>
                        <CustomFormLabel htmlFor="nombre">Nombre del Rol *</CustomFormLabel>
                        <CustomTextField
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ingrese el nombre del rol"
                            fullWidth
                        />
                    </Box>

                    <Box>
                        <CustomFormLabel htmlFor="descripcion">Descripción</CustomFormLabel>
                        <CustomTextField
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Ingrese la descripción del rol"
                            fullWidth
                            multiline
                            rows={2}
                        />
                    </Box>

                    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Opciones de Sistema *
                        </Typography>

                        {Object.entries(permisosAgrupados).map(([moduloNombre, permisosDelModulo]) => {
                            const moduloId = permisosDelModulo[0]?.moduloId;
                            const nodeId = `modulo-${moduloId}`;
                            const todosSeleccionados = permisosDelModulo.every(p => permisosSeleccionados.has(p.id));

                            return (
                                <Box key={moduloId} sx={{ mb: 2 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={todosSeleccionados}
                                                indeterminate={
                                                    permisosDelModulo.some(p => permisosSeleccionados.has(p.id)) &&
                                                    !todosSeleccionados
                                                }
                                                onChange={() => handleToggleModulo(moduloId)}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                {moduloNombre}
                                            </Typography>
                                        }
                                    />
                                    
                                    <Box sx={{ pl: 4, borderLeft: '2px solid #e0e0e0' }}>
                                        {permisosDelModulo.map(permiso => (
                                            <FormControlLabel
                                                key={permiso.id}
                                                control={
                                                    <Checkbox
                                                        checked={permisosSeleccionados.has(permiso.id)}
                                                        onChange={() => handleTogglePermiso(permiso.id)}
                                                        size="small"
                                                    />
                                                }
                                                label={
                                                    <Box>
                                                        <Typography variant="body2">
                                                            {permiso.nombre}
                                                        </Typography>
                                                        {permiso.descripcion && (
                                                            <Typography variant="caption" sx={{ color: '#999' }}>
                                                                {permiso.descripcion}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }
                                                sx={{ mb: 1 }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onCancel} disabled={loading}>Cancelar</Button>
                <Button
                    onClick={handleGuardar}
                    variant="contained"
                    color="success"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Guardar'}
                </Button>
            </DialogActions>
        </>
    );
};

export default FormularioRol;

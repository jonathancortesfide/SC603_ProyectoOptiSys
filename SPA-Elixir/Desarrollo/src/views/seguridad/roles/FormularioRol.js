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
    Collapse,
} from '@mui/material';
import { IconChevronDown, IconChevronUp } from '@tabler/icons';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import {
    crearRol,
    actualizarRol,
    obtenerModulos,
    obtenerPermisos,
    obtenerPermisosDelRol,
} from '../../../requests/roles/RequestsRoles';

const FormularioRol = ({ rol, modoEdicion, onGuardar, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        permisos: []
    });

    const [permisos, setPermisos] = useState([]);
    const [permisosSeleccionados, setPermisosSeleccionados] = useState(new Set());
    const [cargandoPermisos, setCargandoPermisos] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedNodes, setExpandedNodes] = useState([]);

    useEffect(() => {
        const inicializarFormulario = async () => {
            setCargandoPermisos(true);
            await cargarPermisos();

            if (modoEdicion && rol) {
                setFormData({
                    nombre: rol.nombre || '',
                    descripcion: rol.descripcion || '',
                    permisos: [],
                });

                const permisosDelRol = await obtenerPermisosDelRol(rol.id);
                setPermisosSeleccionados(
                    new Set(
                        permisosDelRol
                            .filter((permiso) => permiso.esActivo)
                            .map((permiso) => permiso.id)
                    )
                );
            } else {
                setFormData({
                    nombre: '',
                    descripcion: '',
                    permisos: [],
                });
                setPermisosSeleccionados(new Set());
            }

            setCargandoPermisos(false);
        };

        inicializarFormulario();
    }, [rol, modoEdicion]);

    const cargarPermisos = async () => {
        const [permisosData, modulosData] = await Promise.all([
            obtenerPermisos(),
            obtenerModulos(),
        ]);

        const permisosDisponibles = Array.isArray(permisosData) ? permisosData.filter((p) => p.esActivo) : [];

        // Build idModulo -> { seccionId, seccionNombre } map
        const moduloSeccionMap = new Map(
            (Array.isArray(modulosData) ? modulosData : []).map((m) => [
                m.idModulo ?? m.id,
                { seccionId: m.idSeccion ?? 0, seccionNombre: m.nombreSeccion ?? 'Sin Sección' },
            ])
        );

        // Enrich permisos with section info
        const permisosEnriquecidos = permisosDisponibles.map((p) => {
            const seccionInfo = moduloSeccionMap.get(p.moduloId) ?? { seccionId: 0, seccionNombre: 'Sin Sección' };
            return { ...p, seccionId: seccionInfo.seccionId, seccionNombre: seccionInfo.seccionNombre };
        });

        setPermisos(permisosEnriquecidos);

        const seccionNodes = [...new Set(permisosEnriquecidos.map((p) => `seccion-${p.seccionId}`))];
        const moduloNodes = [...new Set(permisosEnriquecidos.map((p) => `modulo-${p.moduloId}`))];
        setExpandedNodes([]);
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

    const handleToggleSeccion = (seccionId) => {
        const permisosDeSeccion = permisos.filter(p => p.seccionId === seccionId);
        const todosSeleccionados = permisosDeSeccion.every(p => permisosSeleccionados.has(p.id));

        const newSet = new Set(permisosSeleccionados);
        if (todosSeleccionados) {
            permisosDeSeccion.forEach(p => newSet.delete(p.id));
        } else {
            permisosDeSeccion.forEach(p => newSet.add(p.id));
        }
        setPermisosSeleccionados(newSet);
    };

    const handleToggleNode = (nodeId) => {
        setExpandedNodes(prev => {
            const isOpen = prev.includes(nodeId);

            if (nodeId.startsWith('seccion-')) {
                const seccionId = Number(nodeId.replace('seccion-', ''));
                const seccion = seccionesAgrupadas[seccionId];
                const moduloIds = seccion ? Object.keys(seccion.modulos).map(id => `modulo-${id}`) : [];

                if (isOpen) {
                    return prev.filter(id => id !== nodeId && !moduloIds.includes(id));
                } else {
                    return [...prev.filter(id => !moduloIds.includes(id)), nodeId, ...moduloIds];
                }
            }

            return isOpen ? prev.filter(id => id !== nodeId) : [...prev, nodeId];
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

            if (resultado.esCorrecto) {
                onGuardar();
            } else {
                setError(resultado.mensaje || 'Error al guardar el rol');
            }
        } catch (err) {
            setError('Error al procesar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    // Agrupar permisos por sección > módulo
    const seccionesAgrupadas = {};
    permisos.forEach((permiso) => {
        const seccionId = permiso.seccionId ?? 0;
        const seccionNombre = permiso.seccionNombre ?? 'Sin Sección';
        const moduloId = permiso.moduloId;
        const moduloNombre = permiso.moduloNombre;

        if (!seccionesAgrupadas[seccionId]) {
            seccionesAgrupadas[seccionId] = { nombre: seccionNombre, modulos: {} };
        }
        if (!seccionesAgrupadas[seccionId].modulos[moduloId]) {
            seccionesAgrupadas[seccionId].modulos[moduloId] = { nombre: moduloNombre, permisos: [] };
        }
        seccionesAgrupadas[seccionId].modulos[moduloId].permisos.push(permiso);
    });

    return (
        <>
            <DialogTitle>
                {modoEdicion ? 'Gestionar permisos del rol' : 'Crear nuevo rol'}
            </DialogTitle>
            <DialogContent sx={{ pt: 2, maxHeight: '70vh', overflow: 'auto' }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {modoEdicion && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        La API actual permite administrar los permisos del rol, pero no editar su nombre o descripción.
                    </Alert>
                )}

                <Stack spacing={2}>
                    <Box>
                        <CustomFormLabel htmlFor="nombre">Nombre del Rol *</CustomFormLabel>
                        <CustomTextField
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ingrese el nombre del rol"
                            disabled={modoEdicion}
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
                            disabled={modoEdicion}
                            fullWidth
                            multiline
                            rows={2}
                        />
                    </Box>

                    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Opciones de Sistema *
                        </Typography>

                        {cargandoPermisos ? (
                            <Box display="flex" justifyContent="center" py={3}>
                                <CircularProgress size={24} />
                            </Box>
                        ) : Object.keys(seccionesAgrupadas).length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                No hay permisos configurados en el sistema. Primero cree Secciones, Módulos y Permisos.
                            </Typography>
                        ) : (
                            Object.entries(seccionesAgrupadas).map(([seccionId, seccion]) => {
                                const seccionIdNum = Number(seccionId);
                                const permisosDeSeccion = permisos.filter(p => p.seccionId === seccionIdNum);
                                const todosSeccionSeleccionados = permisosDeSeccion.every(p => permisosSeleccionados.has(p.id));
                                const algunoSeccionSeleccionado = permisosDeSeccion.some(p => permisosSeleccionados.has(p.id));
                                const seccionExpandida = expandedNodes.includes(`seccion-${seccionIdNum}`);

                                return (
                                    <Box key={seccionId} sx={{ mb: 2 }}>
                                        {/* Nivel 1: Sección */}
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={todosSeccionSeleccionados}
                                                        indeterminate={algunoSeccionSeleccionado && !todosSeccionSeleccionados}
                                                        onChange={() => handleToggleSeccion(seccionIdNum)}
                                                    />
                                                }
                                                label={
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                                                        {seccion.nombre}
                                                    </Typography>
                                                }
                                                sx={{ flex: 1 }}
                                            />
                                            <Box
                                                sx={{ color: 'primary.main', cursor: 'pointer', mr: 1, display: 'flex', alignItems: 'center' }}
                                                onClick={() => handleToggleNode(`seccion-${seccionIdNum}`)}
                                            >
                                                <Box sx={{ transition: 'transform 0.25s ease', transform: seccionExpandida ? 'rotate(180deg)' : 'rotate(0deg)', display: 'flex' }}>
                                                    <IconChevronDown size={18} />
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Collapse in={seccionExpandida} timeout={200}>
                                            <Box sx={{ pl: 3, borderLeft: '3px solid', borderColor: 'primary.light' }}>
                                                {Object.entries(seccion.modulos).map(([moduloId, modulo]) => {
                                                    const moduloIdNum = Number(moduloId);
                                                    const todosModuloSeleccionados = modulo.permisos.every(p => permisosSeleccionados.has(p.id));
                                                    const algunoModuloSeleccionado = modulo.permisos.some(p => permisosSeleccionados.has(p.id));
                                                    const moduloExpandido = expandedNodes.includes(`modulo-${moduloIdNum}`);

                                                    return (
                                                        <Box key={moduloId} sx={{ mb: 1 }}>
                                                            {/* Nivel 2: Módulo */}
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            checked={todosModuloSeleccionados}
                                                                            indeterminate={algunoModuloSeleccionado && !todosModuloSeleccionados}
                                                                            onChange={() => handleToggleModulo(moduloIdNum)}
                                                                            size="small"
                                                                        />
                                                                    }
                                                                    label={
                                                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                            {modulo.nombre}
                                                                        </Typography>
                                                                    }
                                                                    sx={{ flex: 1 }}
                                                                />
                                                                <Box
                                                                    sx={{ color: 'text.secondary', cursor: 'pointer', mr: 1, display: 'flex', alignItems: 'center' }}
                                                                    onClick={() => handleToggleNode(`modulo-${moduloIdNum}`)}
                                                                >
                                                                    <Box sx={{ transition: 'transform 0.2s ease', transform: moduloExpandido ? 'rotate(180deg)' : 'rotate(0deg)', display: 'flex' }}>
                                                                        <IconChevronDown size={16} />
                                                                    </Box>
                                                                </Box>
                                                            </Box>

                                                            <Collapse in={moduloExpandido} timeout={200}>
                                                                <Box sx={{ pl: 4, borderLeft: '2px solid #e0e0e0' }}>
                                                                    {/* Nivel 3: Permisos */}
                                                                    {modulo.permisos.map((permiso) => (
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
                                                                            sx={{ display: 'flex', mb: 0.5 }}
                                                                        />
                                                                    ))}
                                                                </Box>
                                                            </Collapse>
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                        </Collapse>
                                    </Box>
                                );
                            })
                        )}
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

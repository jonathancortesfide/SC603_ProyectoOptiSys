import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, TextField, Alert, Switch, FormControlLabel } from '@mui/material';
import ParentCard from '../../../components/shared/ParentCard';
import {
    crearClasificacionPaciente,
    actualizarClasificacionPaciente
} from '../../../requests/mantenimientos/clasificacionPacientes/RequestsClasificacionPacientes';
import { getCurrentUsername } from '../../../utils/auth';

const FormularioClasificacionPacientes = ({ clasificacion, modoEdicion, onGuardar, onCancel, noEmpresa }) => {
    const usuarioPorDefecto = getCurrentUsername();
    const noEmpresaPorDefecto = String(noEmpresa ?? '').trim();
    const [formData, setFormData] = useState({ descripcion: '', no_empresa: noEmpresaPorDefecto, activo: true, usuario: usuarioPorDefecto });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (modoEdicion && clasificacion && clasificacion.no_clasificacion) {
            setFormData({
                descripcion: clasificacion.descripcion || '',
                no_empresa: String(clasificacion.no_empresa ?? noEmpresaPorDefecto).trim(),
                activo: clasificacion.activo ?? true,
                usuario: clasificacion.usuario || usuarioPorDefecto
            });
        } else {
            setFormData({ descripcion: '', no_empresa: noEmpresaPorDefecto, activo: true, usuario: usuarioPorDefecto });
        }
    }, [clasificacion, modoEdicion, noEmpresaPorDefecto, usuarioPorDefecto]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async () => {
        setError(null);
        if (!String(formData.descripcion).trim()) {
            setError('Descripción es obligatoria');
            return;
        }
        if (!String(formData.no_empresa).trim()) {
            setError('No. Empresa es obligatorio');
            return;
        }
        if (!String(formData.usuario).trim()) {
            setError('Usuario es obligatorio');
            return;
        }

        setLoading(true);
        try {
            let res;
            const payload = {
                descripcion: String(formData.descripcion).trim(),
                no_empresa: Number(formData.no_empresa),
                activo: Boolean(formData.activo),
                usuario: String(formData.usuario).trim()
            };

            if (modoEdicion && clasificacion && clasificacion.no_clasificacion) {
                res = await actualizarClasificacionPaciente({
                    no_clasificacion: clasificacion.no_clasificacion,
                    ...payload
                });
            } else {
                res = await crearClasificacionPaciente(payload);
            }
            if (res && res.esCorrecto !== false) {
                onGuardar();
            } else if (res && res.esCorrecto === false) {
                setError(res.mensaje || 'Error en la operación');
            } else {
                onGuardar();
            }
        } catch (err) {
            setError('Error al guardar la clasificación de pacientes');
        }
        setLoading(false);
    };

    return (
        <ParentCard title={modoEdicion ? 'Editar clasificación' : 'Crear clasificación'}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box>
                <Stack spacing={2}>
                    <TextField name="descripcion" label="Descripción" value={formData.descripcion} onChange={handleChange} fullWidth />
                    <TextField name="no_empresa" label="No. Empresa" value={formData.no_empresa} fullWidth disabled />
                    <TextField name="usuario" label="Usuario" value={formData.usuario} onChange={handleChange} fullWidth />
                    <FormControlLabel control={<Switch name="activo" checked={formData.activo} onChange={handleChange} />} label={formData.activo ? 'Activo' : 'Inactivo'} />
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                            {modoEdicion ? 'Actualizar' : 'Crear'}
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={onCancel}>Cancelar</Button>
                    </Stack>
                </Stack>
            </Box>
        </ParentCard>
    );
};

export default FormularioClasificacionPacientes;

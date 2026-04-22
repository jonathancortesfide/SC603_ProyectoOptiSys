import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, TextField, Alert, Switch, FormControlLabel } from '@mui/material';
import ParentCard from '../../../components/shared/ParentCard';
import {
    crearGrupoProducto,
    actualizarGrupoProducto
} from '../../../requests/mantenimientos/grupoProductos/RequestsGrupoProductos';
import { getCurrentUsername } from '../../../utils/auth';

const FormularioGrupoProductos = ({ grupo, modoEdicion, onGuardar, onCancel, noEmpresa }) => {
    const usuarioPorDefecto = getCurrentUsername();
    const noEmpresaPorDefecto = String(noEmpresa ?? '').trim();
    const [formData, setFormData] = useState({ descripcion: '', no_empresa: noEmpresaPorDefecto, activo: true, usuario: usuarioPorDefecto });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (modoEdicion && grupo && grupo.no_grupo) {
            setFormData({
                descripcion: grupo.descripcion || '',
                no_empresa: String(grupo.no_empresa ?? noEmpresaPorDefecto).trim(),
                activo: grupo.activo ?? true,
                usuario: grupo.usuario || usuarioPorDefecto
            });
        } else {
            setFormData({ descripcion: '', no_empresa: noEmpresaPorDefecto, activo: true, usuario: usuarioPorDefecto });
        }
    }, [grupo, modoEdicion, noEmpresaPorDefecto, usuarioPorDefecto]);

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
            const payloadBase = {
                descripcion: String(formData.descripcion).trim(),
                activo: Boolean(formData.activo),
                identificador: Number(formData.no_empresa),
                usuario: String(formData.usuario).trim()
            };

            if (modoEdicion && grupo && grupo.no_grupo) {
                res = await actualizarGrupoProducto({
                    no_grupo: grupo.no_grupo,
                    ...payloadBase
                });
            } else {
                res = await crearGrupoProducto({
                    ...payloadBase,
                    no_empresa: Number(formData.no_empresa)
                });
            }
            if (res && res.esCorrecto !== false) {
                onGuardar();
            } else if (res && res.esCorrecto === false) {
                setError(res.mensaje || 'Error en la operación');
            } else {
                onGuardar();
            }
        } catch (err) {
            setError('Error al guardar el grupo de productos');
        }
        setLoading(false);
    };

    return (
        <ParentCard title={modoEdicion ? 'Editar grupo' : 'Crear grupo'}>
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

export default FormularioGrupoProductos;

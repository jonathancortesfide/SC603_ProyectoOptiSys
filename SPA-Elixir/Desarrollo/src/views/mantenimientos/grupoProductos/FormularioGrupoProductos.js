import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, TextField, Alert } from '@mui/material';
import ParentCard from '../../../components/shared/ParentCard';
import {
    crearGrupoProducto,
    actualizarGrupoProducto,
    obtenerGrupoProductoPorId
} from '../../../requests/mantenimientos/grupoProductos/RequestsGrupoProductos';

const FormularioGrupoProductos = ({ grupo, modoEdicion, onGuardar, onCancel }) => {
    const [formData, setFormData] = useState({ descripcion: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (modoEdicion && grupo && grupo.id) {
            if (!grupo.descripcion) {
                (async () => {
                    const data = await obtenerGrupoProductoPorId(grupo.id);
                    if (data) setFormData({ descripcion: data.descripcion });
                })();
            } else {
                setFormData({ descripcion: grupo.descripcion || '' });
            }
        } else {
            setFormData({ descripcion: '' });
        }
    }, [grupo, modoEdicion]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);
        try {
            let res;
            if (modoEdicion && grupo && grupo.id) {
                res = await actualizarGrupoProducto(grupo.id, formData);
            } else {
                res = await crearGrupoProducto(formData);
            }
            if (res && res.EsCorrecto !== false) {
                onGuardar();
            } else if (res && res.EsCorrecto === false) {
                setError(res.Mensaje || 'Error en la operación');
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

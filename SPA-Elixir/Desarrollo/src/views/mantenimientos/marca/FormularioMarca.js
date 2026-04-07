import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, TextField, Alert } from '@mui/material';
import ParentCard from '../../../components/shared/ParentCard';
import { crearMarca, actualizarMarca, obtenerMarcaPorId } from '../../../requests/mantenimientos/marca/RequestsMarcas';

const FormularioMarca = ({ marca, modoEdicion, onGuardar, onCancel }) => {
    const [formData, setFormData] = useState({ descripcion: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (modoEdicion && marca && marca.id) {
            if (!marca.descripcion) {
                (async () => {
                    const data = await obtenerMarcaPorId(marca.id);
                    if (data) setFormData({ descripcion: data.descripcion });
                })();
            } else {
                setFormData({ descripcion: marca.descripcion || '' });
            }
        } else {
            setFormData({ descripcion: '' });
        }
    }, [marca, modoEdicion]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);
        try {
            let res;
            if (modoEdicion && marca && marca.id) {
                res = await actualizarMarca(marca.id, formData);
            } else {
                res = await crearMarca(formData);
            }
            if (res && res.EsCorrecto !== false) {
                onGuardar();
            } else if (res && res.EsCorrecto === false) {
                setError(res.Mensaje || 'Error en la operación');
            } else {
                onGuardar();
            }
        } catch (err) {
            setError('Error al guardar la marca');
        }
        setLoading(false);
    };

    return (
        <ParentCard title={modoEdicion ? 'Editar Marca' : 'Crear Marca'}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box>
                <Stack spacing={2}>
                    <TextField name="descripcion" label="Descripción" value={formData.descripcion} onChange={handleChange} fullWidth />
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>{modoEdicion ? 'Actualizar' : 'Crear'}</Button>
                        <Button variant="outlined" color="secondary" onClick={onCancel}>Cancelar</Button>
                    </Stack>
                </Stack>
            </Box>
        </ParentCard>
    );
};

export default FormularioMarca;

import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, TextField, Alert } from '@mui/material';
import ParentCard from '../../../components/shared/ParentCard';
import { crearMoneda, actualizarMoneda, obtenerMonedaPorId } from '../../../requests/mantenimientos/moneda/RequestsMonedas';

const FormularioMoneda = ({ moneda, modoEdicion, onGuardar, onCancel }) => {
    const [formData, setFormData] = useState({ descripcion: '', signo: '', abreviatura: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (modoEdicion && moneda && moneda.id) {
            // if complete object not passed, try to fetch
            if (!moneda.descripcion) {
                (async () => {
                    const data = await obtenerMonedaPorId(moneda.id);
                    if (data) setFormData({ descripcion: data.descripcion, signo: data.signo, abreviatura: data.abreviatura });
                })();
            } else {
                setFormData({ descripcion: moneda.descripcion || '', signo: moneda.signo || '', abreviatura: moneda.abreviatura || '' });
            }
        } else {
            setFormData({ descripcion: '', signo: '', abreviatura: '' });
        }
    }, [moneda, modoEdicion]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);
        try {
            let res;
            if (modoEdicion && moneda && moneda.id) {
                res = await actualizarMoneda(moneda.id, formData);
            } else {
                res = await crearMoneda(formData);
            }
            if (res && res.EsCorrecto !== false) {
                onGuardar();
            } else if (res && res.EsCorrecto === false) {
                setError(res.Mensaje || 'Error en la operación');
            } else {
                onGuardar();
            }
        } catch (err) {
            setError('Error al guardar la moneda');
        }
        setLoading(false);
    };

    return (
        <ParentCard title={modoEdicion ? 'Editar Moneda' : 'Crear Moneda'}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box>
                <Stack spacing={2}>
                    <TextField name="descripcion" label="Descripción" value={formData.descripcion} onChange={handleChange} fullWidth />
                    <TextField name="signo" label="Signo" value={formData.signo} onChange={handleChange} fullWidth />
                    <TextField name="abreviatura" label="Abreviatura" value={formData.abreviatura} onChange={handleChange} fullWidth />
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

export default FormularioMoneda;

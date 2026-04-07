import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, TextField, Alert, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { crearListaPrecio, actualizarListaPrecio, obtenerListaPrecioPorId } from '../../../requests/mantenimientos/ListaPrecio/RequestsListaPrecio';

const FormularioListaPrecio = ({ lista, modoEdicion, onGuardar, onCancel }) => {
  const [formData, setFormData] = useState({ descripcion: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      if (modoEdicion && lista && lista.no_lista) {
        if (!lista.descripcion) {
          const data = await obtenerListaPrecioPorId(lista.no_lista);
          if (data) setFormData({ descripcion: data.descripcion });
        } else {
          setFormData({ descripcion: lista.descripcion || '' });
        }
      } else {
        setFormData({ descripcion: '' });
      }
    };
    cargar();
  }, [lista, modoEdicion]);

  const handleSubmit = async () => {
    setError(null);
    if (!formData.descripcion || !String(formData.descripcion).trim()) {
      setError('Descripción es obligatoria');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (modoEdicion && lista && lista.no_lista) {
        res = await actualizarListaPrecio(lista.no_lista, formData);
      } else {
        res = await crearListaPrecio(formData);
      }
      if (res && res.EsCorrecto !== false) {
        onGuardar();
      } else if (res && res.EsCorrecto === false) {
        setError(res.Mensaje || 'Error en la operación');
      } else {
        onGuardar();
      }
    } catch (err) {
      setError('Error al guardar la lista de precio');
    }
    setLoading(false);
  };

  return (
    <>
      <DialogTitle>{modoEdicion ? 'Editar Lista de Precio' : 'Crear Lista de Precio'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              name="descripcion"
              label="Descripción"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              fullWidth
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" color="secondary" onClick={onCancel} disabled={loading}>Cancelar</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear')}
        </Button>
      </DialogActions>
    </>
  );
};

export default FormularioListaPrecio;

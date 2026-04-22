import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  TextField,
  Alert,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox
} from '@mui/material';

import {
  crearTipoLente,
  actualizarTipoLente,
  obtenerTipoLentePorId
} from '../../../requests/mantenimientos/TipoLente/RequestsTipoLente';
import { getSucursalIdentificador } from '../../../utils/sucursal';

const FormularioTipoLente = ({ tipo, modoEdicion, onGuardar, onCancel, noEmpresa }) => {
  const noEmpresaPorDefecto = String(noEmpresa ?? getSucursalIdentificador() ?? '').trim();
  const [formData, setFormData] = useState({
    descripcion: '',
    no_empresa: noEmpresaPorDefecto,
    usuario: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      if (modoEdicion && tipo && tipo.no_tipo) {
        if (!tipo.descripcion) {
          try {
            const data = await obtenerTipoLentePorId(tipo.no_tipo);
            if (data) {
              setFormData({
                descripcion: data.descripcion || '',
                no_empresa: data.no_empresa || noEmpresaPorDefecto,
                usuario: data.usuario || ''
              });
            }
          } catch {
            setError('Error al cargar el tipo de lente');
          }
        } else {
          setFormData({
            descripcion: tipo.descripcion || '',
            no_empresa: tipo.no_empresa || noEmpresaPorDefecto,
            usuario: tipo.usuario || ''
          });
        }
      } else {
        setFormData({
          descripcion: '',
          no_empresa: noEmpresaPorDefecto,
          usuario: ''
        });
      }
    };
    cargar();
  }, [tipo, modoEdicion, noEmpresaPorDefecto]);

  const handleSubmit = async () => {
    setError(null);
    if (!formData.descripcion || !String(formData.descripcion).trim()) {
      setError('Descripción es obligatoria');
      return;
    }
    if (!formData.no_empresa) {
      setError('no_empresa es obligatorio');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (modoEdicion && tipo && tipo.no_tipo) {
        console.log('Actualizando tipo de lente:', tipo.no_tipo, formData);
        res = await actualizarTipoLente(tipo.no_tipo, formData);
      } else {
        console.log('=== CREANDO TIPO DE LENTE ===');
        console.log('Datos del formulario:', formData);
        res = await crearTipoLente(formData);
      }
      
      console.log('=== RESPUESTA DEL SERVIDOR ===');
      console.log('Respuesta:', res);
      console.log('Type:', typeof res);
      console.log('Keys:', res ? Object.keys(res) : 'null');
      
      if (res) {
        console.log('Cerrando formulario...');
        onGuardar();
      } else {
        console.error('Respuesta vacía o nula');
        setError('Error en la operación - respuesta vacía');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error capturado:', err);
      setError('Error al guardar el tipo de lente: ' + err.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCancel = () => {
    setLoading(false);
    setError(null);
    onCancel();
  };

  return (
    <>
      <DialogTitle>{modoEdicion ? 'Editar Tipo de Lente' : 'Crear Tipo de Lente'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              name="descripcion"
              label="Descripción"
              value={formData.descripcion}
              onChange={handleChange}
              fullWidth
              required
              disabled={loading}
            />
            <TextField
              name="no_empresa"
              label="No. Empresa"
              type="number"
              value={formData.no_empresa}
              fullWidth
              required
              disabled
            />
            <TextField
              name="usuario"
              label="Usuario"
              value={formData.usuario}
              onChange={handleChange}
              fullWidth
              disabled={loading}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear')}
        </Button>
      </DialogActions>
    </>
  );
};

export default FormularioTipoLente;
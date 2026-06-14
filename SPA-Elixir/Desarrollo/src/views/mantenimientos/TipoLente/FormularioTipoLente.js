import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  TextField,
  Alert,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

import {
  crearTipoLente,
  actualizarTipoLente,
  obtenerTipoLentePorId
} from '../../../requests/mantenimientos/TipoLente/RequestsTipoLente';
import { getNoEmpresa } from '../../../utils/sucursal';

const FormularioTipoLente = ({ tipo, modoEdicion, onGuardar, onCancel }) => {
  const [formData, setFormData] = useState({
    no_tipo: '',
    descripcion: '',
    no_empresa: getNoEmpresa(),
    activo: true,
    identificador: getNoEmpresa(),
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
                no_tipo: data.no_tipo || tipo.no_tipo || '',
                descripcion: data.descripcion || '',
                no_empresa: data.no_empresa || '',
                activo: data.activo !== undefined ? data.activo : true,
                identificador: data.identificador || '',
                usuario: data.usuario || ''
              });
            }
          } catch {
            setError('Error al cargar el tipo de lente');
          }
        } else {
          setFormData({
            no_tipo: tipo.no_tipo || '',
            descripcion: tipo.descripcion || '',
            no_empresa: tipo.no_empresa || '',
            activo: tipo.activo !== undefined ? tipo.activo : true,
            identificador: tipo.identificador || '',
            usuario: tipo.usuario || ''
          });
        }
      } else {
        setFormData({
          no_tipo: '',
          descripcion: '',
          no_empresa: getNoEmpresa(),
          activo: true,
          identificador: getNoEmpresa(),
          usuario: ''
        });
      }
    };
    cargar();
  }, [tipo, modoEdicion]);

  const handleSubmit = async () => {
    setError(null);
    if (!formData.descripcion || !String(formData.descripcion).trim()) {
      setError('Descripción es obligatoria');
      return;
    }
    
    // Limpiar espacios en blanco de los campos
    let datosLimpios = {
      descripcion: String(formData.descripcion).trim(),
      no_empresa: formData.no_empresa || getNoEmpresa(),
      activo: formData.activo,
      identificador: formData.identificador || getNoEmpresa(),
      usuario: String(formData.usuario).trim() || String(getNoEmpresa())
    };
    // Solo agregar no_tipo si es edición
    if (modoEdicion && formData.no_tipo) {
      datosLimpios.no_tipo = parseInt(String(formData.no_tipo).trim(), 10);
    }
    try {
      let res;
      if (modoEdicion && tipo && tipo.no_tipo) {
        console.log('Actualizando tipo de lente:', datosLimpios);
        res = await actualizarTipoLente(datosLimpios);
      } else {
        console.log('=== CREANDO TIPO DE LENTE ===');
        console.log('Datos del formulario:', datosLimpios);
        res = await crearTipoLente(datosLimpios);
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
                        import React, { useState, useEffect } from 'react';
import { crearListaPrecio, actualizarListaPrecio, obtenerListaPrecioPorId } from '../../../requests/mantenimientos/ListaPrecio/RequestsListaPrecio';
import { getSucursalIdentificador } from '../../../utils/sucursal';
import { obtenerListaDeMonedas, obtenerMonedasPorIdentificador, crearMoneda, cambiarEstadoMoneda } from '../../../requests/mantenimientos/moneda/RequestsMonedas';

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
  Checkbox,
  MenuItem 
} from '@mui/material';

const FormularioListaPrecio = ({ lista, modoEdicion, onGuardar, onCancel }) => {
  const [formData, setFormData] = useState({ 
    no_lista: '',
    descripcion: '',
    descripcionMoneda: '',
    id_moneda: '',
    identificador: '',
    usuario: '',
    activo: true
  });
  const [monedas, setMonedas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
console.log("FORMULARIO RENDERIZADO");
useEffect(() => {
  const cargarMonedas = async () => {
    try {
      const resp = await obtenerMonedasPorIdentificador(getSucursalIdentificador());

      const asignadas = resp?.laListaDeMonedas ?? [];

      const monedasFinal = asignadas.map((m) => ({
        id_moneda: m.idMoneda, // ✅ ESTE ES EL CORRECTO
        descripcion: m.descripcion
      }));

      console.log("MONEDAS DROPDOWN:", monedasFinal);

      setMonedas(monedasFinal);

    } catch (error) {
      console.error("Error cargando monedas", error);
    }
  };

  cargarMonedas();
}, []);

useEffect(() => {
  const cargar = async () => {

    

    if (modoEdicion && lista && lista.no_lista) {

      if (!lista.descripcion) {
        const data = await obtenerListaPrecioPorId(lista.no_lista);

        if (data && data.length > 0) {
          const item = data[0];

          setFormData({
            no_lista: item.no_lista || '',
            descripcion: item.descripcion || '',
            descripcionMoneda: item.descripcionMoneda?.trim() || '',
            id_moneda: item.id_moneda ?? '',
            identificador: item.identificador || '',
            usuario: item.usuario || '',
            activo: item.activo ?? true
          });
        }

      } else {
        setFormData({
          no_lista: lista.no_lista || '',
          descripcion: lista.descripcion || '',
          descripcionMoneda: lista.descripcionMoneda?.trim() || '',
          id_moneda: lista.id_moneda ?? '',
          identificador: lista.identificador || '',
          usuario: lista.usuario || '',
          activo: lista.activo ?? true
        });
      }

    } else {
      setFormData({
        no_lista: '',
        descripcion: '',
        descripcionMoneda: '',
        id_moneda: '',
        identificador: '',
        usuario: '',
        activo: true
      });
    }
  };

  cargar();
}, [lista, modoEdicion]);

  const handleSubmit = async () => {
    setError(null);
    if (!formData.descripcion || String(formData.descripcion).trim() === '') {
      setError('Es obligatorio ingresar la descripción');
      return;
    }
    if (!formData.id_moneda || String(formData.id_moneda).trim() === '') {
      setError('Es obligatorio seleccionar una moneda');
      return;
    }
   
   const datosLimpios = {
  descripcion: String(formData.descripcion).trim(),   
  id_moneda: Number(formData.id_moneda),
  descripcionMoneda: String(formData.descripcionMoneda).trim(),
  identificador: getSucursalIdentificador(),
  usuario: String(formData.usuario).trim(),
  activo: formData.activo
};

if (modoEdicion) {
  datosLimpios.no_lista = formData.no_lista; // solo en edición
}


    setLoading(true);
    try {
      let res;
      if (modoEdicion && lista && lista.no_lista) {
        res = await actualizarListaPrecio(datosLimpios);
      } else {
        res = await crearListaPrecio(datosLimpios);
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
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  let newValue = value;

  if (name === 'id_moneda') {
    newValue = value ? Number(value) : '';
    console.log("ID MONEDA SELECCIONADO:", newValue); // 👈 DEBUG
  }

  setFormData({
    ...formData,
    [name]: type === 'checkbox' ? checked : newValue
  });
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
            value={formData.descripcion || ''}
            onChange={handleChange}
            fullWidth
            required
            disabled={loading}
            inputProps={{ maxLength: 100 }}
            helperText={`${formData.descripcion.length}/100`}
          />
            <TextField
                select={true} 
              name="id_moneda"
              label="Moneda"
              value={formData.id_moneda ?? ''}
              onChange={handleChange}
              fullWidth
              disabled={loading}
            >
              <MenuItem value="">
                <em>Seleccione una moneda</em>
              </MenuItem>
              {monedas.map((moneda) => (
                <MenuItem key={moneda.id_moneda} value={moneda.id_moneda}>
                  {moneda.descripcion}
                </MenuItem>
              ))}
            </TextField>
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
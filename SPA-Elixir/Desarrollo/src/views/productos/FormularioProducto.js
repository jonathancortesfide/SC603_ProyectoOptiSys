import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button, Checkbox, FormControlLabel, MenuItem, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { IconChevronDown } from '@tabler/icons';
import { AgregarProducto, actualizarProducto } from '../../requests/mantenimientos/producto/RequestsProductos';

const tiposArticulo = [ 'Material', 'Servicio', 'Servicio-Externo' ];
const tiposImpuesto = [ 'Exento', 'IVA', 'Otro' ];

const FormularioProducto = ({ producto, modoEdicion, onGuardar, onCancel }) => {
  const [form, setForm] = useState({
    tipoArticulo: 'Material',
    tipoImpuesto: 'IVA',
    porcentajeImpuesto: 13,
    codigoInterno: '',
    codigoBarras: '',
    codigoAuxiliar: '',
    nombre: '',
    codigoCabys: '',
    esActivo: true,
    unidadMedida: '',
    existencia: 0,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (producto) {
      setForm((p) => ({ ...p, ...producto, esActivo: producto.esActivo ?? producto.activo ?? true }));
    }
  }, [producto]);

  const handleChange = (key) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.codigoInterno || !String(form.codigoInterno).trim()) e.codigoInterno = 'Código interno es obligatorio';
    if (!form.nombre || !String(form.nombre).trim()) e.nombre = 'Nombre es obligatorio';
    if (isNaN(Number(form.porcentajeImpuesto)) || Number(form.porcentajeImpuesto) < 0) e.porcentajeImpuesto = 'Porcentaje inválido';
    if (isNaN(Number(form.existencia)) || Number(form.existencia) < 0) e.existencia = 'Existencia inválida';

    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const payload = { ...form, noProducto: form.noProducto || producto?.noProducto || 0 };
    try {
      const res = modoEdicion
        ? await actualizarProducto(payload.noProducto, payload)
        : await AgregarProducto({ ...payload, noProducto: 0 });
      if (res && res.EsCorrecto !== false) { onGuardar && onGuardar(); }
      else setErrors({ submit: res?.Mensaje || 'Error al guardar producto' });
    } catch (err) { console.error(err); setErrors({ submit: 'Error al guardar' }); }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<IconChevronDown />}>
          <Typography variant="subtitle1" fontWeight={600}>Información básica</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField select label="Tipo de artículo" fullWidth size="small" value={form.tipoArticulo} onChange={handleChange('tipoArticulo')}>
                {tiposArticulo.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}><TextField label="Código interno" fullWidth size="small" value={form.codigoInterno} onChange={handleChange('codigoInterno')} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Nombre producto" fullWidth size="small" value={form.nombre} onChange={handleChange('nombre')} /></Grid>

            <Grid item xs={12} sm={4}>
              <TextField select label="Tipo de impuesto" fullWidth size="small" value={form.tipoImpuesto} onChange={handleChange('tipoImpuesto')}>
                {tiposImpuesto.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Porcentaje de impuesto" type="number" fullWidth size="small" value={form.porcentajeImpuesto} onChange={handleChange('porcentajeImpuesto')} />
            </Grid>
            <Grid item xs={12} sm={4}><TextField label="Código CABYS" fullWidth size="small" value={form.codigoCabys} onChange={handleChange('codigoCabys')} /></Grid>

            <Grid item xs={12} sm={4}><TextField label="Código barras" fullWidth size="small" value={form.codigoBarras} onChange={handleChange('codigoBarras')} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Código auxiliar" fullWidth size="small" value={form.codigoAuxiliar} onChange={handleChange('codigoAuxiliar')} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Unidad de medida" fullWidth size="small" value={form.unidadMedida} onChange={handleChange('unidadMedida')} /></Grid>
            <Grid item xs={12} sm={4}><FormControlLabel control={<Checkbox checked={form.esActivo} onChange={handleChange('esActivo')} />} label="Es activo" /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Existencia" type="number" fullWidth size="small" value={form.existencia} onChange={handleChange('existencia')} /></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {errors.submit && (
        <Typography color="error" sx={{ mt: 2 }}>
          {errors.submit}
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button variant="outlined" onClick={onCancel}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>{modoEdicion ? 'Guardar' : 'Crear'}</Button>
      </Box>
    </Box>
  );
};

export default FormularioProducto;

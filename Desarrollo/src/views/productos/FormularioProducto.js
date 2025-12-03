import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button, Checkbox, FormControlLabel, MenuItem, Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, IconButton } from '@mui/material';
import { IconChevronDown, IconPlus, IconTrash } from '@tabler/icons';
import { AgregarProducto } from '../../requests/mantenimientos/producto/RequestsProductos';

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
    grupo: '',
    marca: '',
    tipoLente: '',
    existencia: 0,
    caracteristicas: '',
    foto: '',
    minimo: 0,
    esPerecedero: false,
    costoPromedioPonderado: 0,
    costoUltimaCompra: 0,
    costoFinal: 0,
    listasPrecios: [],
  });

  useEffect(() => { if (producto) setForm((p) => ({ ...p, ...producto })); }, [producto]);

  const handleChange = (key) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.codigoInterno || !String(form.codigoInterno).trim()) e.codigoInterno = 'Código interno es obligatorio';
    if (!form.nombre || !String(form.nombre).trim()) e.nombre = 'Nombre es obligatorio';
    if (isNaN(Number(form.porcentajeImpuesto)) || Number(form.porcentajeImpuesto) < 0) e.porcentajeImpuesto = 'Porcentaje inválido';
    if (isNaN(Number(form.existencia)) || Number(form.existencia) < 0) e.existencia = 'Existencia inválida';
    if (isNaN(Number(form.minimo)) || Number(form.minimo) < 0) e.minimo = 'Mínimo inválido';
    ['costoPromedioPonderado','costoUltimaCompra','costoFinal'].forEach(k => {
      if (form[k] !== '' && (isNaN(Number(form[k])) || Number(form[k]) < 0)) e[k] = 'Valor inválido';
    });

    if (Array.isArray(form.listasPrecios)) {
      const listasErr = {};
      form.listasPrecios.forEach((lp, idx) => {
        const rowErr = {};
        if (!lp.nombre || !String(lp.nombre).trim()) rowErr.nombre = 'Nombre es obligatorio';
        if (isNaN(Number(lp.utilidad)) || Number(lp.utilidad) < 0) rowErr.utilidad = 'Utilidad inválida';
        if (isNaN(Number(lp.precioNeto)) || Number(lp.precioNeto) < 0) rowErr.precioNeto = 'Precio neto inválido';
        if (Object.keys(rowErr).length) listasErr[idx] = rowErr;
      });
      if (Object.keys(listasErr).length) e.listasPrecios = listasErr;
    }

    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const payload = { ...form };
    try {
      const res = await AgregarProducto(payload);
      if (res && res.EsCorrecto !== false) { onGuardar && onGuardar(); }
      else setErrors({ submit: res?.Mensaje || 'Error al guardar producto' });
    } catch (err) { console.error(err); setErrors({ submit: 'Error al guardar' }); }
  };

  // Price lists handlers
  const handleAddLista = () => {
    setForm(s => ({ ...s, listasPrecios: [...(s.listasPrecios || []), { nombre: '', utilidad: 0, precioNeto: 0, precioCliente: 0 }] }));
  };

  const handleRemoveLista = (idx) => () => {
    setForm(s => ({ ...s, listasPrecios: (s.listasPrecios || []).filter((_, i) => i !== idx) }));
    setErrors(err => {
      if (!err.listasPrecios) return err;
      const copy = { ...err };
      const lp = { ...copy.listasPrecios };
      delete lp[idx];
      copy.listasPrecios = Object.keys(lp).length ? lp : undefined;
      return copy;
    });
  };

  const handleListaChange = (idx, key) => (e) => {
    const value = e?.target?.type === 'number' ? (e.target.value === '' ? '' : parseFloat(e.target.value)) : e.target.value;
    setForm(s => {
      const listas = [...(s.listasPrecios || [])];
      listas[idx] = { ...listas[idx], [key]: value };
      const impuestoFactor = 1 + (Number(s.porcentajeImpuesto) || 0) / 100;
      listas[idx].precioCliente = Number(listas[idx].precioNeto || 0) * impuestoFactor;
      return { ...s, listasPrecios: listas };
    });
    setErrors(err => {
      if (!err.listasPrecios) return err;
      const copy = { ...err };
      if (copy.listasPrecios && copy.listasPrecios[idx]) {
        const row = { ...copy.listasPrecios };
        delete row[idx];
        copy.listasPrecios = Object.keys(row).length ? row : undefined;
      }
      return copy;
    });
  };

  // Photo upload
  const handleFotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm(s => ({ ...s, foto: reader.result }));
      setErrors(err => ({ ...err, foto: undefined }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<IconChevronDown />}>
          <Typography variant="subtitle1" fontWeight={600}>Datos generales</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField select label="Tipo de artículo" fullWidth size="small" value={form.tipoArticulo} onChange={handleChange('tipoArticulo')}>
                {tiposArticulo.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField select label="Tipo de impuesto" fullWidth size="small" value={form.tipoImpuesto} onChange={handleChange('tipoImpuesto')}>
                {tiposImpuesto.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Porcentaje impuesto" type="number" fullWidth size="small" value={form.porcentajeImpuesto} onChange={handleChange('porcentajeImpuesto')} />
            </Grid>

            <Grid item xs={12}><TextField label="Nombre producto" fullWidth size="small" value={form.nombre} onChange={handleChange('nombre')} /></Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<IconChevronDown />}>
          <Typography variant="subtitle1" fontWeight={600}>Identificadores y códigos</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}><TextField label="Código interno" fullWidth size="small" value={form.codigoInterno} onChange={handleChange('codigoInterno')} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Código barras" fullWidth size="small" value={form.codigoBarras} onChange={handleChange('codigoBarras')} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Código auxiliar" fullWidth size="small" value={form.codigoAuxiliar} onChange={handleChange('codigoAuxiliar')} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Código CABYS" fullWidth size="small" value={form.codigoCabys} onChange={handleChange('codigoCabys')} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Unidad de medida" fullWidth size="small" value={form.unidadMedida} onChange={handleChange('unidadMedida')} /></Grid>
            <Grid item xs={12} sm={4}><FormControlLabel control={<Checkbox checked={form.esActivo} onChange={handleChange('esActivo')} />} label="Es activo" /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Grupo" fullWidth size="small" value={form.grupo} onChange={handleChange('grupo')} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Marca" fullWidth size="small" value={form.marca} onChange={handleChange('marca')} /></Grid>
            {form.tipoArticulo === 'Material' && (
              <Grid item xs={12} sm={4}><TextField label="Tipo de lente" fullWidth size="small" value={form.tipoLente} onChange={handleChange('tipoLente')} /></Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<IconChevronDown />}>
          <Typography variant="subtitle1" fontWeight={600}>Existencias y especiales</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}><TextField label="Existencia" type="number" fullWidth size="small" value={form.existencia} onChange={handleChange('existencia')} /></Grid>
            <Grid item xs={12}><TextField label="Características adicionales" fullWidth size="small" multiline rows={2} value={form.caracteristicas} onChange={handleChange('caracteristicas')} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Mínimo" type="number" fullWidth size="small" value={form.minimo} onChange={handleChange('minimo')} error={!!errors.minimo} helperText={errors.minimo} /></Grid>
            <Grid item xs={12} sm={4}><FormControlLabel control={<Checkbox checked={form.esPerecedero} onChange={handleChange('esPerecedero')} />} label="Es perecedero" /></Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="outlined" component="label">Subir foto<input hidden accept="image/*" type="file" onChange={handleFotoChange} /></Button>
              {form.foto && <Box component="img" src={form.foto} alt="Preview" sx={{ maxWidth: 120, display: 'block', mt: 1 }} />}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<IconChevronDown />}>
          <Typography variant="subtitle1" fontWeight={600}>Costos y precios</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}><TextField label="Costo promedio ponderado" type="number" fullWidth size="small" value={form.costoPromedioPonderado} onChange={handleChange('costoPromedioPonderado')} error={!!errors.costoPromedioPonderado} helperText={errors.costoPromedioPonderado} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Costo última compra" type="number" fullWidth size="small" value={form.costoUltimaCompra} onChange={handleChange('costoUltimaCompra')} error={!!errors.costoUltimaCompra} helperText={errors.costoUltimaCompra} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Costo final" type="number" fullWidth size="small" value={form.costoFinal} onChange={handleChange('costoFinal')} error={!!errors.costoFinal} helperText={errors.costoFinal} /></Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Lista</TableCell>
                      <TableCell>Utilidad %</TableCell>
                      <TableCell>Precio neto</TableCell>
                      <TableCell>Precio al cliente</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(form.listasPrecios || []).map((lp, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <TextField size="small" fullWidth value={lp.nombre} onChange={handleListaChange(idx, 'nombre')} error={!!(errors.listasPrecios && errors.listasPrecios[idx] && errors.listasPrecios[idx].nombre)} helperText={errors.listasPrecios && errors.listasPrecios[idx] && errors.listasPrecios[idx].nombre} />
                        </TableCell>
                        <TableCell>
                          <TextField size="small" type="number" value={lp.utilidad} onChange={handleListaChange(idx, 'utilidad')} />
                        </TableCell>
                        <TableCell>
                          <TextField size="small" type="number" value={lp.precioNeto} onChange={handleListaChange(idx, 'precioNeto')} />
                        </TableCell>
                        <TableCell>
                          {lp.precioCliente?.toFixed ? lp.precioCliente.toFixed(2) : lp.precioCliente}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={handleRemoveLista(idx)}><IconTrash /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 1 }}><Button startIcon={<IconPlus />} onClick={handleAddLista}>Agregar lista de precios</Button></Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button variant="outlined" onClick={onCancel}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>{modoEdicion ? 'Guardar' : 'Crear'}</Button>
      </Box>
    </Box>
  );
};

export default FormularioProducto;

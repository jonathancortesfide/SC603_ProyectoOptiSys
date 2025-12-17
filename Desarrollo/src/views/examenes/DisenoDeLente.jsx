// DisenoDeLente.jsx
import React, { useEffect, useMemo, useRef } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Autocomplete,
  Button,
  IconButton,
} from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';

// --- MOCK DATA (reemplazar por llamadas reales a la API/inventario) ---
const TIPOS_LENTE = [
  { id: 'mono', label: 'Monofocal' },
  { id: 'bifo', label: 'Bifocal' },
  { id: 'prog', label: 'Progresivo' },
  { id: 'ocup', label: 'Ocupacional' },
];

const MATERIALES_BY_TIPO = {
  mono: [
    { id: 'cr39', label: 'CR-39' },
    { id: 'pc', label: 'Policarbonato' },
    { id: 'hi', label: 'Hi-Index' },
  ],
  bifo: [
    { id: 'cr39', label: 'CR-39' },
    { id: 'trivex', label: 'Trivex' },
  ],
  prog: [
    { id: 'pc', label: 'Policarbonato' },
    { id: 'hi', label: '1.67' },
    { id: 'trivex', label: 'Trivex' },
  ],
  ocup: [
    { id: 'pc', label: 'Policarbonato' },
    { id: 'hi', label: 'Hi-Index' },
  ],
};

// Mock inventario AROS (tipo AR)
const MOCK_AROS = [
  { id: 'aro-1', sku: 'AR-001', name: 'Aro Clásico - Negro', price: 120 },
  { id: 'aro-2', sku: 'AR-002', name: 'Aro Moderno - Metal', price: 200 },
  { id: 'aro-3', sku: 'AR-003', name: 'Aro Infantil - Rojo', price: 95 },
];

// Mock laboratorios
const MOCK_LABS = [
  { id: 'lab-1', name: 'Laboratorio A' },
  { id: 'lab-2', name: 'Laboratorio B' },
  { id: 'lab-3', name: 'Laboratorio C' },
];

// Mock productos tipo servicio (SE)
const MOCK_SERVICES = [
  { id: 'se-1', code: 'SE-001', name: 'Examen Completo', type: 'SE', price: 35 },
  { id: 'se-2', code: 'SE-002', name: 'Examen Básico', type: 'SE', price: 20 },
  { id: 'pr-1', code: 'PR-001', name: 'Producto Lente', type: 'PR', price: 100 },
];

// --- COMPONENTE PRINCIPAL ---
export default function DisenoDeLente({ examen, setExamen }) {
  // ensure structure exists
  useEffect(() => {
    if (!examen.DisenoDeLente) {
      setExamen(prev => ({
        ...prev,
        DisenoDeLente: {
          tipoLente: '',
          material: null,
          materialQuery: '',
          aroQuery: '',
          aroSeleccionado: null,
          fotoAro: null, // preview URL
          laboratorioQuery: '',
          laboratorioSeleccionado: null,
          numeroOrden: '',
          numeroPedido: '',
          examenQuery: '',
          examenSeleccionado: null,
        }
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // local ref to revoke last object url on change/unmount
  const lastObjectUrlRef = useRef(null);

  // helper to update nested DisenoDeLente fields
  const setField = (field, value) => {
    setExamen(prev => ({
      ...prev,
      DisenoDeLente: {
        ...(prev.DisenoDeLente || {}),
        [field]: value,
      }
    }));
  };

  // when tipoLente changes, reset material selection & query
  useEffect(() => {
    const tipo = examen.DisenoDeLente?.tipoLente || '';
    // clear material when tipo changes
    setField('material', null);
    setField('materialQuery', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examen.DisenoDeLente?.tipoLente]);

  // file upload handling (preview + revoke previous)
  const onAroFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const preview = URL.createObjectURL(f);
      // revoke previous if exists
      if (lastObjectUrlRef.current) {
        try { URL.revokeObjectURL(lastObjectUrlRef.current); } catch {}
      }
      lastObjectUrlRef.current = preview;
      // save preview URL (not uploading here)
      setField('fotoAro', preview);
    } catch (err) {
      console.error('Error creando preview', err);
    }
  };

  // cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (lastObjectUrlRef.current) {
        try { URL.revokeObjectURL(lastObjectUrlRef.current); } catch {}
        lastObjectUrlRef.current = null;
      }
    };
  }, []);

  // Derived lists / filters
  const materialesDisponibles = useMemo(() => {
    const tipo = examen.DisenoDeLente?.tipoLente || '';
    return MATERIALES_BY_TIPO[tipo] || [];
  }, [examen.DisenoDeLente?.tipoLente]);

  const aroQuery = examen.DisenoDeLente?.aroQuery || '';
  const arResultados = useMemo(() => {
    const q = String(aroQuery || '').trim().toLowerCase();
    if (!q) return [];
    return MOCK_AROS.filter(a => `${a.sku} ${a.name}`.toLowerCase().includes(q));
  }, [aroQuery]);

  const labQuery = examen.DisenoDeLente?.laboratorioQuery || '';
  const labResultados = useMemo(() => {
    const q = String(labQuery || '').trim().toLowerCase();
    if (!q) return [];
    return MOCK_LABS.filter(l => l.name.toLowerCase().includes(q));
  }, [labQuery]);

  const examQuery = examen.DisenoDeLente?.examenQuery || '';
  const examResultados = useMemo(() => {
    const q = String(examQuery || '').trim().toLowerCase();
    if (!q) return [];
    // filter only type SE (servicios)
    return MOCK_SERVICES.filter(s => s.type === 'SE' && (`${s.code} ${s.name}`.toLowerCase().includes(q)));
  }, [examQuery]);

  // UI render
  return (
    <Box>
      <Typography variant="h6" mb={2}>Diseño de Lente</Typography>

      <Grid container spacing={2}>
        {/* Tipo de lente */}
        <Grid item xs={12} md={4}>
          <TextField
            select
            label="Tipo de Lente"
            fullWidth
            size="small"
            value={examen.DisenoDeLente?.tipoLente || ''}
            onChange={(e) => setField('tipoLente', e.target.value)}
          >
            <MenuItem value=""><em>Seleccionar</em></MenuItem>
            {TIPOS_LENTE.map(t => <MenuItem key={t.id} value={t.id}>{t.label}</MenuItem>)}
          </TextField>
        </Grid>

        {/* Material (dependiente) */}
        <Grid item xs={12} md={4}>
          <Autocomplete
            freeSolo
            options={materialesDisponibles}
            getOptionLabel={(opt) => opt.label || ''}
            value={examen.DisenoDeLente?.material || null}
            inputValue={examen.DisenoDeLente?.materialQuery || ''}
            onInputChange={(_, val) => setField('materialQuery', val)}
            onChange={(_, val) => {
              // val can be an object from list or a string (freeSolo)
              if (!val) setField('material', null);
              else if (typeof val === 'string') setField('material', { id: val, label: val });
              else setField('material', val);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Material (buscar)" size="small" />
            )}
          />
        </Grid>

        {/* Aro search */}
        <Grid item xs={12} md={4}>
          <TextField
            label="Buscar Aro (inventario AR)"
            fullWidth
            size="small"
            value={examen.DisenoDeLente?.aroQuery || ''}
            onChange={(e) => setField('aroQuery', e.target.value)}
            helperText={examen.DisenoDeLente?.aroSeleccionado ? `Seleccionado: ${examen.DisenoDeLente.aroSeleccionado.name}` : ''}
          />
        </Grid>

        {/* Lista de resultados de aro (si hay query) */}
        { (examen.DisenoDeLente?.aroQuery || '').trim() !== '' && (
          <Grid item xs={12}>
            <Box sx={{ border: '1px solid #eee', borderRadius: 1, p: 1 }}>
              {arResultados.length === 0 ? (
                <Typography variant="caption">No hay resultados</Typography>
              ) : (
                arResultados.map(a => (
                  <Box key={a.id} display="flex" justifyContent="space-between" alignItems="center" py={0.5}>
                    <Box>
                      <Typography variant="body2">{a.name}</Typography>
                      <Typography variant="caption">{a.sku} — ${a.price}</Typography>
                    </Box>
                    <Button
                      size="small"
                      onClick={() => setField('aroSeleccionado', a)}
                    >
                      Seleccionar
                    </Button>
                  </Box>
                ))
              )}
            </Box>
          </Grid>
        )}

        {/* Preview / photo upload for aro */}
        <Grid item xs={12} md={6}>
          <Box display="flex" gap={1} alignItems="center">
            <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
              Subir foto aro
              <input hidden accept="image/*" type="file" onChange={onAroFile} />
            </Button>
            {examen.DisenoDeLente?.fotoAro && (
              <Box component="img" src={examen.DisenoDeLente.fotoAro} alt="preview aro"
                sx={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 1, border: '1px solid #ddd' }} />
            )}
          </Box>
        </Grid>

        {/* Aro seleccionado show */}
        <Grid item xs={12} md={6}>
          {examen.DisenoDeLente?.aroSeleccionado ? (
            <Box>
              <Typography variant="body2" fontWeight={600}>{examen.DisenoDeLente.aroSeleccionado.name}</Typography>
              <Typography variant="caption">{examen.DisenoDeLente.aroSeleccionado.sku} — ${examen.DisenoDeLente.aroSeleccionado.price}</Typography>
              <Box mt={1}>
                <Button size="small" onClick={() => setField('aroSeleccionado', null)}>Quitar selección</Button>
              </Box>
            </Box>
          ) : (
            <Typography variant="caption">No hay aro seleccionado</Typography>
          )}
        </Grid>

        {/* Laboratorio search */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Buscar laboratorio"
            size="small"
            value={examen.DisenoDeLente?.laboratorioQuery || ''}
            onChange={(e) => setField('laboratorioQuery', e.target.value)}
            helperText={examen.DisenoDeLente?.laboratorioSeleccionado ? `Seleccionado: ${examen.DisenoDeLente.laboratorioSeleccionado.name}` : ''}
          />
        </Grid>

        { (examen.DisenoDeLente?.laboratorioQuery || '').trim() !== '' && (
          <Grid item xs={12}>
            <Box sx={{ border: '1px solid #eee', borderRadius: 1, p: 1 }}>
              {labResultados.length === 0 ? (
                <Typography variant="caption">No hay laboratorios</Typography>
              ) : (
                labResultados.map(l => (
                  <Box key={l.id} display="flex" justifyContent="space-between" alignItems="center" py={0.5}>
                    <Box>
                      <Typography variant="body2">{l.name}</Typography>
                    </Box>
                    <Button size="small" onClick={() => setField('laboratorioSeleccionado', l)}>Seleccionar</Button>
                  </Box>
                ))
              )}
            </Box>
          </Grid>
        )}

        {/* Numero orden / pedido */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            label="Número Orden (laboratorio)"
            value={examen.DisenoDeLente?.numeroOrden || ''}
            onChange={(e) => setField('numeroOrden', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            label="Número Pedido (laboratorio)"
            value={examen.DisenoDeLente?.numeroPedido || ''}
            onChange={(e) => setField('numeroPedido', e.target.value)}
          />
        </Grid>

        {/* Examen/Servicio (tipo SE) search */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            label="Buscar examen/servicio (SE)"
            value={examen.DisenoDeLente?.examenQuery || ''}
            onChange={(e) => setField('examenQuery', e.target.value)}
            helperText={examen.DisenoDeLente?.examenSeleccionado ? `Seleccionado: ${examen.DisenoDeLente.examenSeleccionado.name}` : ''}
          />
        </Grid>

        { (examen.DisenoDeLente?.examenQuery || '').trim() !== '' && (
          <Grid item xs={12}>
            <Box sx={{ border: '1px solid #eee', borderRadius: 1, p: 1 }}>
              {examResultados.length === 0 ? (
                <Typography variant="caption">No se encontraron servicios</Typography>
              ) : (
                examResultados.map(s => (
                  <Box key={s.id} display="flex" justifyContent="space-between" alignItems="center" py={0.5}>
                    <Box>
                      <Typography variant="body2">{s.name}</Typography>
                      <Typography variant="caption">{s.code} — ${s.price}</Typography>
                    </Box>
                    <Button size="small" onClick={() => setField('examenSeleccionado', s)}>Seleccionar</Button>
                  </Box>
                ))
              )}
            </Box>
          </Grid>
        )}

      </Grid>
    </Box>
  );
}

// GraduacionRx.jsx
import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';



const DEFAULT_EYE = {
  Esfera: '',
  Cilindro: '',
  Eje: '',
  Adiccion: '',
  DNP: '',
  AVC: '',
  AVL: '',
  Altura: '',
  Base: '',
  Prisma: '',
  CB: '',
  Diam: '',
  AVSC: '',
  PIO: '',
  LH: '',
  Observaciones: '',
};

const DEFAULT_EYE_CERCA = {
  Esfera: '',
  Cilindro: '',
  Eje: '',
  DNP: '',
  AVC: '',
  Observaciones: '',
};

export default function GraduacionRx({ examen, setExamen }) {
  // Asegurar estructura inicial en examen (no mutamos directamente)
  const initIfMissing = () => {
    const patch = {};
    if (!examen.RxBase) patch.RxBase = { OD: { ...DEFAULT_EYE }, OI: { ...DEFAULT_EYE } };
    if (!examen.RxActual) patch.RxActual = { OD: { ...DEFAULT_EYE }, OI: { ...DEFAULT_EYE } };
    if (!examen.RxCerca) patch.RxCerca = { OD: { ...DEFAULT_EYE_CERCA }, OI: { ...DEFAULT_EYE_CERCA } };
    // toggle flags defaults
    if (typeof examen.mostrarRxBase === 'undefined') patch.mostrarRxBase = false;
    if (typeof examen.mostrarRxActual === 'undefined') patch.mostrarRxActual = true;
    if (typeof examen.mostrarRxCerca === 'undefined') patch.mostrarRxCerca = false;
    if (Object.keys(patch).length) {
      setExamen(prev => ({ ...prev, ...patch }));
    }
  };

  // init once (safe, idempotent)
  React.useEffect(() => { initIfMissing(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  // Si querés cargar RxBase desde examen.prevExamen (si existe) — solo si RxBase está "vacío"
  React.useEffect(() => {
    if (!examen.prevExamen || !examen.mostrarRxBase) return;
    const prev = examen.prevExamen;
    // ejemplo: prev.RxActual / prev.RxBase etc. Esto depende de cómo guardes el examen anterior.
    // Solo copiamos si RxBase tiene campos vacíos (evita sobreescribir)
    const odEmpty = Object.values(examen.RxBase?.OD || {}).every(v => v === '');
    const oiEmpty = Object.values(examen.RxBase?.OI || {}).every(v => v === '');
    if ((odEmpty || oiEmpty) && prev.RxActual) {
      setExamen(prevState => ({
        ...prevState,
        RxBase: {
          OD: odEmpty ? { ...DEFAULT_EYE, ...prev.RxActual.OD } : prevState.RxBase.OD,
          OI: oiEmpty ? { ...DEFAULT_EYE, ...prev.RxActual.OI } : prevState.RxBase.OI,
        }
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examen.prevExamen, examen.mostrarRxBase]);

  // helper para actualizar un campo en estructura anidada: tipo = 'RxBase'|'RxActual'|'RxCerca'|
  const setField = (tipo, lado, campo, valor) => {
    setExamen(prev => {
      const copy = { ...prev };
      if (!copy[tipo]) copy[tipo] = { OD: {}, OI: {} };
      if (!copy[tipo][lado]) copy[tipo][lado] = {};
      copy[tipo] = { ...copy[tipo], [lado]: { ...copy[tipo][lado], [campo]: valor } };
      return copy;
    });
  };

  // toggle mostrar flags
  const toggle = (campo) => {
    setExamen(prev => ({ ...prev, [campo]: !prev[campo] }));
  };

  
  // small helper to read nested values safely
  const read = (tipo, lado, campo) => {
    return (examen && examen[tipo] && examen[tipo][lado] && typeof examen[tipo][lado][campo] !== 'undefined') ? examen[tipo][lado][campo] : '';
  };

  // Render helpers (campo simple)
  const renderCampo = (label, tipo, lado, campo, size = 6) => (
    <Grid item xs={12} md={size}>
      <TextField
        fullWidth
        size="small"
        label={label}
        value={read(tipo, lado, campo)}
        onChange={(e) => setField(tipo, lado, campo, e.target.value)}
      />
    </Grid>
  );

  // Observaciones con contador (700)
  const renderObservaciones = (tipo, lado) => {
    const value = read(tipo, lado, 'Observaciones') || '';
    return (
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          minRows={3}
          label={`${lado} - Observaciones`}
          value={value}
          inputProps={{ maxLength: 700 }}
          helperText={`${value.length}/700`}
          onChange={(e) => setField(tipo, lado, 'Observaciones', e.target.value)}
        />
      </Grid>
    );
  };

  // Render sección genérica para campos completos (lista de campos)
  const renderSeccionRxCompleta = (titulo, tipo) => {
    const campos = [
      { key: 'Esfera', label: 'Esfera' },
      { key: 'Cilindro', label: 'Cilindro' },
      { key: 'Eje', label: 'Eje' },
      { key: 'Adiccion', label: 'Adicción' },
      { key: 'DNP', label: 'DNP' },
      { key: 'AVC', label: 'AVC' },
      { key: 'AVL', label: 'AVL' },
      { key: 'Altura', label: 'Altura' },
      { key: 'Base', label: 'Base' },
      { key: 'Prisma', label: 'Prisma' },
      { key: 'CB', label: 'CB' },
      { key: 'Diam', label: 'Diam' },
      { key: 'AVSC', label: 'AVSC' },
      { key: 'PIO', label: 'PIO' },
      { key: 'LH', label: 'LH' },
    ];

    return (
      <Box mb={3}>
        <Typography variant="subtitle1" gutterBottom>{titulo}</Typography>
        <Grid container spacing={1}>
          {/* Column OD */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Ojo Derecho (OD)</Typography>
            <Grid container spacing={1}>
              {campos.map(c => renderCampo(c.label, tipo, 'OD', c.key, 6))}
              {renderObservaciones(tipo, 'OD')}
            </Grid>
          </Grid>

          {/* Column OI */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Ojo Izquierdo (OI)</Typography>
            <Grid container spacing={1}>
              {campos.map(c => renderCampo(c.label, tipo, 'OI', c.key, 6))}
              {renderObservaciones(tipo, 'OI')}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Render sección cerca (campos reducidos)
  const renderSeccionCerca = () => {
    const campos = [
      { key: 'Esfera', label: 'Esfera' },
      { key: 'Cilindro', label: 'Cilindro' },
      { key: 'Eje', label: 'Eje' },
      { key: 'DNP', label: 'DNP' },
      { key: 'AVC', label: 'AVC' },
    ];
    return (
      <Box mb={3}>
        <Typography variant="subtitle1" gutterBottom>RX Cerca</Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Ojo Derecho (OD)</Typography>
            <Grid container spacing={1}>
              {campos.map(c => renderCampo(c.label, 'RxCerca', 'OD', c.key, 6))}
              {renderObservaciones('RxCerca', 'OD')}
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Ojo Izquierdo (OI)</Typography>
            <Grid container spacing={1}>
              {campos.map(c => renderCampo(c.label, 'RxCerca', 'OI', c.key, 6))}
              {renderObservaciones('RxCerca', 'OI')}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  };

 

  // Memoizado simple para evitar re-renders intensos en listas
  const rendered = useMemo(() => (
    <Box>
      {/* RX Base */}
      {examen.mostrarRxBase && renderSeccionRxCompleta('RX Base (examen anterior)', 'RxBase')}

      {/* RX Actual */}
      {examen.mostrarRxActual && renderSeccionRxCompleta('RX Actual (examen presente)', 'RxActual')}

      {/* RX Cerca */}
      {examen.mostrarRxCerca && renderSeccionCerca()}
    </Box>
  ), [
    examen.mostrarRxBase,
    examen.mostrarRxActual,
    examen.mostrarRxCerca,
    // include exam fields to re-evaluate when changed
    examen.RxBase, examen.RxActual, examen.RxCerca, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ]);

  return (
    <Box>
      <Typography variant="h6" mb={2}>Graduación RX</Typography>

      {/* Selección de secciones */}
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={!!examen.mostrarRxBase} onChange={() => toggle('mostrarRxBase')} />}
            label="Mostrar RX Base (del examen anterior)"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={!!examen.mostrarRxActual} onChange={() => toggle('mostrarRxActual')} />}
            label="Mostrar RX Actual"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={!!examen.mostrarRxCerca} onChange={() => toggle('mostrarRxCerca')} />}
            label="Graduación de Cerca"
          />
        </Grid>

        
      </Grid>

      <Box mt={2}>
        {rendered}
      </Box>
    </Box>
  );
}

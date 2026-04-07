import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TextField
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Constantes de campos RX a manejar en la tabla
const CAMPOS_POR_RX = {
  RxBase: ["Esfera", "Cilindro", "Eje", "Adicción", "DNP", "AVC", "AVL", "Altura", "Base", "Prisma", "CB", "Diam", "AVSC", "PIO", "LH"],
  RxActual: ["Esfera", "Cilindro", "Eje", "Adicción", "DNP", "AVC", "AVL", "Altura", "Base", "Prisma", "CB", "Diam", "AVSC", "PIO", "LH"],
  RxCerca: ["Esfera", "Cilindro", "Eje", "DNP", "AVC"],
  RxContacto: ["Esfera", "Cilindro", "Eje", "Adicción"]
};

// Función para inicializar una estructura RX vacía
const initRX = () => ({
  OD: {},
  OI: {},
  observaciones: ""
});

// Helper: normaliza un id seguro (quita diacríticos, espacios y caracteres raros)
function normalizeId(tipo, ojo, campo) {
  const safeCampo = String(campo)
    .normalize?.("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .toLowerCase();
  return `${String(tipo).toLowerCase()}_${String(ojo).toLowerCase()}_${safeCampo}`;
}

// Componente principal de Graduación RX
export default function GraduacionRX({ examen, setExamen }) {
  const inicializado = React.useRef(false);
 React.useEffect(() => {
  if (!examen || inicializado.current) return;
  inicializado.current = true;

  setExamen(prev => ({
    ...prev,
    RxBase: prev.RxBase ?? initRX(),
    RxActual: prev.RxActual ?? initRX(),
    RxCerca: prev.RxCerca ?? initRX(),
    RxContacto: prev.RxContacto ?? initRX(),
    observacionesGenerales: prev.observacionesGenerales ?? ""
  }));
}, []);

  if (!examen) return null;

  const setCampo = React.useCallback((tipo, ojo, campo, valor) => {
    setExamen(prev => ({
      ...prev,
      [tipo]: {
        ...(prev[tipo] ?? initRX()),
        [ojo]: {
          ...(prev[tipo]?.[ojo] ?? {}),
          [campo]: valor
        }
      }
    }));
  }, [setExamen]);

  // Flag compartida: true mientras hacemos navegación por Tab programática (evita races onBlur->setState)
  const tabbingRef = React.useRef(false);
  const tabbingTimerRef = React.useRef(null);
  // Flag compartida para navegación por mouse (mousedown -> focus into another input)
  const mouseNavRef = React.useRef(false);
  const mouseNavTimerRef = React.useRef(null);

  // Pending commits: cuando la navegación por Tab/Mouse está en curso, los onBlur no harán
  // commit inmediato — se registran aquí y se flushan cuando el siguiente input está listo.
  const pendingCommitsRef = React.useRef({});
  const registerPendingCommit = React.useCallback((id, commitFn, value) => {
    pendingCommitsRef.current[id] = { commitFn, value };
  }, []);
  const flushPendingCommits = React.useCallback(() => {
    const entries = Object.values(pendingCommitsRef.current);
    pendingCommitsRef.current = {};
    for (const e of entries) {
      try { e.commitFn(e.value); } catch (_) { /* swallow */ }
    }
  }, []);

  // Limpiar timers al desmontar
  React.useEffect(() => {
    return () => {
      if (tabbingTimerRef.current) clearTimeout(tabbingTimerRef.current);
      if (mouseNavTimerRef.current) clearTimeout(mouseNavTimerRef.current);
      pendingCommitsRef.current = {};
    };
  }, []);

// Componente para renderizar la tabla RX que es la que contiene los campos editables de cada ojo
  // Inputs manejan su propio estado local y sincronizan al padre en onBlur — evita re-renders por cada tecla
  // Ahora aceptan un `externalRef` (pasado por la tabla) para navegación robusta por Tab incluso después de re-renders
  const CellInput = React.memo(function CellInput({ value, onCommit, id, externalRef }) {
    const [local, setLocal] = React.useState(value ?? "");
    const innerRef = React.useRef(null);
    const inputRef = externalRef ?? innerRef;

    React.useEffect(() => setLocal(value ?? ""), [value]);
    const blurTimerRef = React.useRef(null);
    const handleBlur = React.useCallback(() => {
      // Si estamos en navegación por Tab o por Mouse, registrar el commit pendiente
      // en lugar de aplicarlo inmediatamente para evitar races que rompen el foco.
      if (tabbingRef.current || mouseNavRef.current) {
        registerPendingCommit(id, onCommit, local);
        return;
      }

      const delay = 0; // commit inmediato cuando no hay navegación programática
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
      blurTimerRef.current = setTimeout(() => {
        blurTimerRef.current = null;
        if ((value ?? "") !== local) onCommit(local);
      }, delay);
    }, [local, onCommit, value, id, registerPendingCommit]);
    React.useEffect(() => () => { if (blurTimerRef.current) clearTimeout(blurTimerRef.current); }, []);

    const handleMouseDown = React.useCallback((e) => {
      // Marcar navegación por mouse para que el onBlur del input anterior registre
      // un pending commit en lugar de aplicar un setState inmediato.
      mouseNavRef.current = true;
      if (mouseNavTimerRef.current) clearTimeout(mouseNavTimerRef.current);
      mouseNavTimerRef.current = setTimeout(() => { mouseNavRef.current = false; mouseNavTimerRef.current = null; }, 200);

      e.stopPropagation();
      if (inputRef.current && document.activeElement !== inputRef.current) {
        e.preventDefault();
        // focus inmediato y asegurar focus en el siguiente frame
        inputRef.current.focus();
        requestAnimationFrame(() => { try { inputRef.current.focus(); } catch (_) {} });
      }
    }, [inputRef]);

    const handleFocus = React.useCallback((e) => {
      try { e.target.select(); } catch (err) { /* no crítico */ }
      // Cuando un input recibe foco tras una navegación por Tab, flushar commits pendientes
      // en la siguiente animation frame — así evitamos que un commit anterior remonte la UI
      // antes de que el nuevo input acepte teclado.
      requestAnimationFrame(() => {
        flushPendingCommits();
      });
    }, [flushPendingCommits]);

    // Mantener un handler ligero por si el table-level handler no está presente
    const handleKeyDown = React.useCallback((e) => {
      if (e.key !== 'Tab') return;
      // Si la tabla maneja Tab, este handler no interferirá; dejamos la lógica principal en TablaRX
      // Pero prevenimos el comportamiento por defecto momentáneamente para evitar races locales
      e.stopPropagation();
    }, []);

    return (
      <TextField
        size="small"
        inputRef={inputRef}
        value={local}
        onChange={e => setLocal(e.target.value)}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        inputProps={{ style: { textAlign: "center", width: 60 }, 'aria-label': id }}
      />
    );
  });

  const handleTableKeyDownCapture = React.useCallback((e) => {
    if (e.key !== 'Tab') return;
    const active = document.activeElement;
    if (!active) return;

    const isFocusable = (n) => !!(n && typeof n.focus === 'function' && !n.disabled && n.tabIndex !== -1);
    const doFocus = (n) => {
      if (!n) return false;
      try { n.focus(); n.select?.(); } catch (_) { /* ignore */ }
      requestAnimationFrame(() => { try { n.focus(); } catch (_) {} });
      return true;
    };

    // Secuencia RX basada en IDs normalizados
    const secciones = ["RxBase", "RxActual", "RxCerca", "RxContacto"];
    const ojosOrder = ["OD", "OI"];
    const seq = [];
    for (const s of secciones) {
      const camposS = CAMPOS_POR_RX[s] || [];
      for (const o of ojosOrder) {
        for (const c of camposS) seq.push(normalizeId(s, o, c));
      }
    }

    const currentAria = active.getAttribute?.('aria-label') ?? '';
    const idx = seq.indexOf(currentAria);
    const forward = !e.shiftKey;

    if (idx !== -1) {
      const nextIdx = forward ? idx + 1 : idx - 1;
      if (nextIdx >= 0 && nextIdx < seq.length) {
        const nextEl = document.querySelector(`[aria-label="${seq[nextIdx]}"]`);
        if (isFocusable(nextEl)) {
          e.preventDefault();
          e.stopPropagation();
          tabbingRef.current = true;
          if (tabbingTimerRef.current) clearTimeout(tabbingTimerRef.current);
          tabbingTimerRef.current = setTimeout(() => { tabbingRef.current = false; tabbingTimerRef.current = null; }, 150);
          doFocus(nextEl);
          return;
        }
      }
    }

    // Fallback: buscar dentro de la misma tabla en orden DOM
    const table = active.closest('table');
    if (table) {
      const inputs = Array.from(table.querySelectorAll('input, textarea, [tabindex]:not([tabindex="-1"])')).filter(isFocusable);
      const cur = inputs.indexOf(active);
      const next = inputs[forward ? cur + 1 : cur - 1];
      if (next) {
        e.preventDefault();
        e.stopPropagation();
        tabbingRef.current = true;
        if (tabbingTimerRef.current) clearTimeout(tabbingTimerRef.current);
        tabbingTimerRef.current = setTimeout(() => { tabbingRef.current = false; tabbingTimerRef.current = null; }, 150);
        doFocus(next);
        return;
      }

      // Si estamos al final de esta tabla, intentar enfoc ar el siguiente campo RX usando la secuencia global
      if (idx !== -1) {
        const nextIdx = forward ? idx + 1 : idx - 1;
        if (nextIdx >= 0 && nextIdx < seq.length) {
          const nextEl = document.querySelector(`[aria-label="${seq[nextIdx]}"]`);
          if (isFocusable(nextEl)) {
            e.preventDefault();
            e.stopPropagation();
            tabbingRef.current = true;
            if (tabbingTimerRef.current) clearTimeout(tabbingTimerRef.current);
            tabbingTimerRef.current = setTimeout(() => { tabbingRef.current = false; tabbingTimerRef.current = null; }, 150);
            doFocus(nextEl);
            return;
          }
        }
      }
    }

    // No se encontró un objetivo RX válido — dejar comportamiento por defecto
  }, []);

  const TablaRX = React.memo(function TablaRX({ tipo }) {
    const campos = React.useMemo(() => CAMPOS_POR_RX[tipo] || [], [tipo]);
    const ojos = React.useMemo(() => ["OD", "OI"], []);

    // Registro local de refs por celda (order-preserving)
    const cellRefs = React.useRef({});

    // Handler de Tab robusto que consulta `cellRefs` (no depende de querySelector global)
    const handleTableKeyDownCaptureLocal = React.useCallback((e) => {
      if (e.key !== 'Tab') return;
      const active = document.activeElement;
      if (!active) return;

      const isFocusable = (n) => !!(n && typeof n.focus === 'function' && !n.disabled && n.tabIndex !== -1);
      const doFocus = (n) => {
        if (!n) return false;
        try { n.focus(); n.select?.(); } catch (_) { /* ignore */ }
        requestAnimationFrame(() => { try { n.focus(); } catch (_) {} });
        return true;
      };

      // Secuencia RX basada en los IDs normalizados
      const secciones = ["RxBase", "RxActual", "RxCerca", "RxContacto"];
      const ojosOrder = ["OD", "OI"];
      const seq = [];
      for (const s of secciones) {
        const camposS = CAMPOS_POR_RX[s] || [];
        for (const o of ojosOrder) {
          for (const c of camposS) seq.push(normalizeId(s, o, c));
        }
      }

      const currentAria = active.getAttribute?.('aria-label') ?? '';
      const idx = seq.indexOf(currentAria);
      const forward = !e.shiftKey;

      // Intentar usar cellRefs (más fiable que querySelector cuando hay re-renders)
      if (idx !== -1) {
        const nextIdx = forward ? idx + 1 : idx - 1;
        if (nextIdx >= 0 && nextIdx < seq.length) {
          const nextRef = cellRefs.current[seq[nextIdx]];
          const nextEl = nextRef?.current;
          if (isFocusable(nextEl)) {
            e.preventDefault();
            e.stopPropagation();
            tabbingRef.current = true;
            if (tabbingTimerRef.current) clearTimeout(tabbingTimerRef.current);
            tabbingTimerRef.current = setTimeout(() => { tabbingRef.current = false; tabbingTimerRef.current = null; }, 150);
            doFocus(nextEl);
            return;
          }
        }
      }

      // FALLBACK: recorrer los refs locales en DOM order
      const localOrder = [];
      for (const s of [tipo]) {
        for (const o of ojos) {
          for (const c of campos) {
            const id = normalizeId(s, o, c);
            const r = cellRefs.current[id];
            if (r?.current && isFocusable(r.current)) localOrder.push(r.current);
          }
        }
      }

      const cur = localOrder.indexOf(active);
      const next = localOrder[forward ? cur + 1 : cur - 1];
      if (next) {
        e.preventDefault();
        e.stopPropagation();
        tabbingRef.current = true;
        if (tabbingTimerRef.current) clearTimeout(tabbingTimerRef.current);
        tabbingTimerRef.current = setTimeout(() => { tabbingRef.current = false; tabbingTimerRef.current = null; }, 150);
        doFocus(next);
        return;
      }

      // Si no encontramos en esta tabla, dejar que el comportamiento por defecto ocurra
    }, [campos, ojos, tipo]);

    return (
      <TableContainer component={Paper} variant="outlined" onKeyDownCapture={handleTableKeyDownCaptureLocal}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              {campos.map(c => (
                <TableCell key={c} align="center" sx={{ fontWeight: "bold" }}>
                  {c}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {ojos.map(ojo => (
              <TableRow key={ojo}>
                <TableCell sx={{ fontWeight: "bold", width: 60 }}>
                  {ojo}
                </TableCell>

                {campos.map(campo => {
                  const id = normalizeId(tipo, ojo, campo);
                  if (!cellRefs.current[id]) cellRefs.current[id] = React.createRef();
                  return (
                    <TableCell key={campo} align="center" sx={{ p: 0.5 }}>
                      <CellInput
                        id={id}
                        externalRef={cellRefs.current[id]}
                        value={examen[tipo]?.[ojo]?.[campo] ?? ""}
                        onCommit={val => setCampo(tipo, ojo, campo, val)}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  });


  // Componente aislado para Observaciones: estado local + debounce, sincroniza en onBlur y en debounce
  const ObservacionesField = React.memo(function ObservacionesField({ value, onCommit }) {
    const [local, setLocal] = React.useState(value ?? "");
    const timerRef = React.useRef(null);

    React.useEffect(() => setLocal(value ?? ""), [value]);

    // Debounced auto-commit (suave, para evitar actualizar el padre en cada tecla)
    React.useEffect(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if ((value ?? "") !== local) onCommit(local);
      }, 300);
      return () => clearTimeout(timerRef.current);
    }, [local, onCommit, value]);

    const handleBlur = React.useCallback(() => {
      if ((value ?? "") !== local) onCommit(local);
    }, [local, onCommit, value]);

    return (
      <Box mt={2}>
        <TextField
          fullWidth
          label="Observaciones del médico"
          multiline
          minRows={3}
          value={local}
          onChange={e => setLocal(e.target.value)}
          onBlur={handleBlur}
          inputProps={{ 'aria-label': 'observaciones-medico' }}
        />
      </Box>
    );
  });

  // Memoizar SeccionRX para que no se re-renderice cuando cambie sólo `observaciones` en el padre
  const SeccionRX = React.memo(({ titulo, tipo, abierto = true }) => ( // Componente para cada sección de RX con acordeón, como RX en Uso, RX Base, RX Cerca
    <Accordion defaultExpanded={abierto}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bold">{titulo}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <TablaRX tipo={tipo} />
      </AccordionDetails>
    </Accordion>
  ));


  return ( // Componente principal de Graduación RX 
    <Box>
      <Typography variant="h6" mb={2}>
        Graduación RX
      </Typography>

      {/* SECCIONES */}
      <ObservacionesField
        value={examen.observacionesGenerales}
        onCommit={val => setExamen(prev => ({ ...prev, observacionesGenerales: val }))}
      />
<SeccionRX tipo="RxBase" titulo="RX en Uso" />
<SeccionRX tipo="RxActual" titulo="RX Base" />
<SeccionRX tipo="RxCerca" titulo="RX Cerca" abierto={false} />
<SeccionRX tipo="RxContacto" titulo="RX Lente de Contacto" abierto={false} />


     

    </Box>
  );
}

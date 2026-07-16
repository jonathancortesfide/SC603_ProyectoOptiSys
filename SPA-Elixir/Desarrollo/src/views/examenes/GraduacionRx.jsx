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
  TextField,
  CircularProgress
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { obtenerExamenCompletoPorNoPaciente } from "../../requests/examenes/RequestsExamenes";

// Constantes de campos RX a manejar en la tabla
const CAMPOS_POR_RX = {
  RxBase: ["Esfera", "Cilindro", "Eje", "Adicion", "DNP", "AVC", "AVL", "Altura", "Base", "Prisma", "CB", "Diam", "AVSC", "PIO", "LH"],
  RxActual: ["Esfera", "Cilindro", "Eje", "Adicción", "DNP", "AVC", "AVL", "Altura", "Base", "Prisma", "CB", "Diam", "AVSC", "PIO", "LH"],
  RxCerca: ["Esfera", "Cilindro", "Eje", "DNP", "AVC"],
  RxContacto: ["Esfera", "Cilindro", "Eje", "Adicción"]
};

// Mapa abreviatura (tal como la devuelve el backend en ObtenerPorNoPaciente) -> campo de RxBase ("RX en Uso").
const ABREVIATURAS_RXBASE = ["ESF", "CIL", "EJE", "ADD", "DNP", "AVC", "AVL", "ALT", "BASE", "PR", "CB", "DIAM", "AVSC", "PIO", "LH"];
const ABREV_TO_CAMPO_RXBASE = ABREVIATURAS_RXBASE.reduce((acc, abrev, i) => {
  acc[abrev] = CAMPOS_POR_RX.RxBase[i];
  return acc;
}, {});

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

// Helper: "D "/"Derecho" -> "OD", "I "/"Izquierdo" -> "OI"
function posicionToOjo(posicion) {
  if (!posicion) return null;
  const valor = String(posicion).trim().toUpperCase();
  if (valor.startsWith("D") || valor.includes("DER")) return "OD";
  if (valor.startsWith("I") || valor.includes("IZQ")) return "OI";
  return null;
}

// Construye { OD: {...}, OI: {...} } para el RX anterior/en uso a partir de las filas que devuelve
// api/ExamenCompleto/ObtenerPorNoPaciente.
function construirRxBaseDesdeApi(rows) {
  const resultado = { OD: {}, OI: {} };
  if (!Array.isArray(rows)) return resultado;

  const filasParaMapear = rows.filter((row) => {
    const tipoXml = String(row?.tipo_xml ?? row?.tipoXml ?? "").trim().toLowerCase();
    const tipoGraduacion = String(row?.tipo_graduacion ?? row?.tipoGraduacion ?? "").trim().toLowerCase();
    const esRxAnterior = tipoGraduacion.includes("rx anterior") || tipoGraduacion.includes("en uso") || tipoGraduacion.includes("anterior");

    if (tipoXml === "base" || esRxAnterior) return true;
    if (!tipoXml && !tipoGraduacion) return true; // fallback si no vienen metadatos
    return false;
  });

  const filas = filasParaMapear.length > 0 ? filasParaMapear : rows;

  for (const row of filas) {
    const ojo = posicionToOjo(row.posicion ?? row.posicion_nombre);
    if (!ojo) continue;

    const abrev = String(row.abreviatura ?? "").trim().toUpperCase();
    const campo = ABREV_TO_CAMPO_RXBASE[abrev];
    if (!campo) continue; // abreviatura desconocida, se ignora

    const valor = row.resultado_valor ?? row.resultadoValor ?? row.resultado ?? "";
    resultado[ojo][campo] = valor;
  }

  return resultado;
}

/* =========================================================================
 * IMPORTANTE: todos los componentes de abajo viven a nivel de MÓDULO
 * (fuera de GraduacionRX). Antes estaban declarados dentro del cuerpo del
 * componente padre, lo que hacía que React les asignara una identidad
 * NUEVA en cada render (cada vez que se tipeaba algo y el padre volvía a
 * renderizar). Eso forzaba a React a desmontar y re-montar todos los
 * <TextField> en cada cambio de estado, perdiendo el foco: es la causa
 * de que al hacer click en otra celda/tabla "te sacara" del campo.
 *
 * Ahora comparten identidad estable entre renders, y las refs/callbacks
 * de navegación (tabbing, mouse, pending commits) se pasan vía Context
 * en lugar de por clausura.
 * ========================================================================= */

const RxNavContext = React.createContext(null);

const CellInput = React.memo(function CellInput({ value, onCommit, id, externalRef }) {
  const nav = React.useContext(RxNavContext);
  const [local, setLocal] = React.useState(value ?? "");
  const innerRef = React.useRef(null);
  const inputRef = externalRef ?? innerRef;

  React.useEffect(() => setLocal(value ?? ""), [value]);

  const blurTimerRef = React.useRef(null);
  const handleBlur = React.useCallback(() => {
    if (nav.tabbingRef.current || nav.mouseNavRef.current) {
      nav.registerPendingCommit(id, onCommit, local);
      return;
    }

    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    blurTimerRef.current = setTimeout(() => {
      blurTimerRef.current = null;
      if ((value ?? "") !== local) onCommit(local);
    }, 0);
  }, [local, onCommit, value, id, nav]);

  React.useEffect(() => () => { if (blurTimerRef.current) clearTimeout(blurTimerRef.current); }, []);

  const handleMouseDown = React.useCallback((e) => {
    nav.mouseNavRef.current = true;
    if (nav.mouseNavTimerRef.current) clearTimeout(nav.mouseNavTimerRef.current);
    nav.mouseNavTimerRef.current = setTimeout(() => {
      nav.mouseNavRef.current = false;
      nav.mouseNavTimerRef.current = null;
    }, 200);

    e.stopPropagation();
    if (inputRef.current && document.activeElement !== inputRef.current) {
      e.preventDefault();
      inputRef.current.focus();
      requestAnimationFrame(() => { try { inputRef.current.focus(); } catch (_) {} });
    }
  }, [inputRef, nav]);

  const handleFocus = React.useCallback((e) => {
    try { e.target.select(); } catch (err) { /* no crítico */ }
    requestAnimationFrame(() => {
      nav.flushPendingCommits();
    });
  }, [nav]);

  const handleKeyDown = React.useCallback((e) => {
    if (e.key !== 'Tab') return;
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

const TablaRX = React.memo(function TablaRX({ tipo, examen, setCampo }) {
  const nav = React.useContext(RxNavContext);
  const campos = React.useMemo(() => CAMPOS_POR_RX[tipo] || [], [tipo]);
  const ojos = React.useMemo(() => ["OD", "OI"], []);

  const cellRefs = React.useRef({});

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
        const nextRef = cellRefs.current[seq[nextIdx]];
        const nextEl = nextRef?.current;
        if (isFocusable(nextEl)) {
          e.preventDefault();
          e.stopPropagation();
          nav.tabbingRef.current = true;
          if (nav.tabbingTimerRef.current) clearTimeout(nav.tabbingTimerRef.current);
          nav.tabbingTimerRef.current = setTimeout(() => { nav.tabbingRef.current = false; nav.tabbingTimerRef.current = null; }, 150);
          doFocus(nextEl);
          return;
        }
      }
    }

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
      nav.tabbingRef.current = true;
      if (nav.tabbingTimerRef.current) clearTimeout(nav.tabbingTimerRef.current);
      nav.tabbingTimerRef.current = setTimeout(() => { nav.tabbingRef.current = false; nav.tabbingTimerRef.current = null; }, 150);
      doFocus(next);
      return;
    }
  }, [campos, ojos, tipo, nav]);

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

const ObservacionesField = React.memo(function ObservacionesField({ value, onCommit }) {
  const [local, setLocal] = React.useState(value ?? "");
  const timerRef = React.useRef(null);

  React.useEffect(() => setLocal(value ?? ""), [value]);

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

const SeccionRX = React.memo(function SeccionRX({ titulo, tipo, abierto = true, extra = null, examen, setCampo }) {
  return (
    <Accordion defaultExpanded={abierto}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bold">{titulo}</Typography>
        {extra}
      </AccordionSummary>

      <AccordionDetails>
        <TablaRX tipo={tipo} examen={examen} setCampo={setCampo} />
      </AccordionDetails>
    </Accordion>
  );
});

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

  const [cargandoRxAnterior, setCargandoRxAnterior] = React.useState(false);
  const noPacienteCargadoRef = React.useRef(null);

  React.useEffect(() => {
    const noPacienteId = examen?.NoPaciente;
    if (!noPacienteId) return;
    if (noPacienteCargadoRef.current === noPacienteId) return;

    let cancelado = false;
    setCargandoRxAnterior(true);

    const cargar = async () => {
      try {
        const data = await obtenerExamenCompletoPorNoPaciente(noPacienteId);
        if (cancelado) return;

        const rows = Array.isArray(data) ? data : Array.isArray(data?.datos) ? data.datos : [];
        const rxBaseDesdeApi = construirRxBaseDesdeApi(rows);

        noPacienteCargadoRef.current = noPacienteId;
        setExamen(prev => ({
          ...prev,
          RxActual: {
            OD: { ...(prev.RxActual?.OD ?? {}), ...rxBaseDesdeApi.OD },
            OI: { ...(prev.RxActual?.OI ?? {}), ...rxBaseDesdeApi.OI },
            observaciones: prev.RxActual?.observaciones ?? ""
          }
        }));
      } catch (e) {
        if (cancelado) return;
        console.error("Error al cargar RX en Uso por NoPaciente:", e);
      } finally {
        if (!cancelado) setCargandoRxAnterior(false);
      }
    };

    cargar();
    return () => { cancelado = true; };
  }, [examen?.NoPaciente, setExamen]);

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

  // Refs compartidas de navegación (foco por Tab / mouse) — estas SÍ pueden
  // vivir en el padre porque son objetos ref estables (no cambian de
  // identidad entre renders); se exponen a los hijos vía Context.
  const tabbingRef = React.useRef(false);
  const tabbingTimerRef = React.useRef(null);
  const mouseNavRef = React.useRef(false);
  const mouseNavTimerRef = React.useRef(null);
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

  React.useEffect(() => {
    return () => {
      if (tabbingTimerRef.current) clearTimeout(tabbingTimerRef.current);
      if (mouseNavTimerRef.current) clearTimeout(mouseNavTimerRef.current);
      pendingCommitsRef.current = {};
    };
  }, []);

  // Valor de contexto estable: se crea una sola vez (todas las refs y
  // callbacks que contiene ya son estables), así que no dispara
  // re-renders extra en los consumidores.
  const navValue = React.useRef({
    tabbingRef,
    tabbingTimerRef,
    mouseNavRef,
    mouseNavTimerRef,
    registerPendingCommit,
    flushPendingCommits
  }).current;

  if (!examen) return null;

  return (
    <RxNavContext.Provider value={navValue}>
      <Box>
        <Typography variant="h6" mb={2}>
          Graduación RX
        </Typography>

        <ObservacionesField
          value={examen.observacionesGenerales}
          onCommit={val => setExamen(prev => ({ ...prev, observacionesGenerales: val }))}
        />

        <SeccionRX
          tipo="RxBase"
          titulo="RX en Uso"
          examen={examen}
          setCampo={setCampo}
          extra={
            cargandoRxAnterior ? (
              <Box display="flex" alignItems="center" gap={1} ml={2}>
                <CircularProgress size={16} />
                <Typography variant="caption">Cargando RX anterior…</Typography>
              </Box>
            ) : null
          }
        />
        <SeccionRX tipo="RxActual" titulo="RX Base" examen={examen} setCampo={setCampo} />
        <SeccionRX tipo="RxCerca" titulo="RX Cerca" abierto={false} examen={examen} setCampo={setCampo} />
        <SeccionRX tipo="RxContacto" titulo="RX Lente de Contacto" abierto={false} examen={examen} setCampo={setCampo} />
      </Box>
    </RxNavContext.Provider>
  );
}
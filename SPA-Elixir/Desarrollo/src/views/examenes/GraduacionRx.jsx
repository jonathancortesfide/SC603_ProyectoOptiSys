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
  CircularProgress,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { obtenerGraduacionesPorIdentificador } from "../../requests/examenes/RequestsGraduacion";
import { obtenerExamenCompletoPorNoPaciente } from "../../requests/examenes/RequestsExamenes";
import { getSucursalIdentificador } from "../../utils/sucursal";

// ─────────────────────────────────────────────
// Utilidades puras (fuera del componente para evitar recreación)
// ─────────────────────────────────────────────

function slugCampo(texto, idGraduacion) {
  const raw = String(texto ?? `g${idGraduacion}`);
  const base = raw
    .normalize?.("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .toLowerCase();
  return base || `c${idGraduacion}`;
}

function normalizeId(tipo, ojo, campo) {
  const safeCampo = String(campo)
    .normalize?.("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .toLowerCase();
  return `${String(tipo).toLowerCase()}_${String(ojo).toLowerCase()}_${safeCampo}`;
}

function tiposDesdeRespuestaApi(data) {
  if (!data) return [];
  return data.tiposGraduacion ?? data.TiposGraduacion ?? [];
}

function normalizarFilaApi(row) {
  return {
    idGraduacion: row.idGraduacion ?? row.IdGraduacion,
    identificador: row.identificador ?? row.Identificador,
    nombre: row.nombre ?? row.Nombre ?? "",
    abreviatura: row.abreviatura ?? row.Abreviatura ?? "",
    descripcionTecnica: row.descripcionTecnica ?? row.DescripcionTecnica ?? "",
    orden: Number(row.orden ?? row.Orden ?? 0),
    activo: row.activo ?? row.Activo ?? true,
    idTipoGraduacion: Number(row.idTipoGraduacion ?? row.IdTipoGraduacion ?? 0),
  };
}

function asignarClavesCampo(grads) {
  const usados = new Set();
  return grads.map((g) => {
    let campoKey = slugCampo(g.abreviatura || g.nombre, g.idGraduacion);
    if (usados.has(campoKey)) campoKey = `${campoKey}_${g.idGraduacion}`;
    usados.add(campoKey);
    return { ...g, campoKey };
  });
}

function construirSeccionesDesdeApiAgrupada(tiposApi) {
  const secciones = [];
  const tiposOrdenados = [...tiposApi].sort(
    (a, b) =>
      Number(a.idTipoGraduacion ?? a.IdTipoGraduacion ?? 0) -
      Number(b.idTipoGraduacion ?? b.IdTipoGraduacion ?? 0)
  );

  for (const tipo of tiposOrdenados) {
    const idTipo = Number(tipo.idTipoGraduacion ?? tipo.IdTipoGraduacion ?? 0);
    if (!idTipo) continue;

    const tituloApi = String(tipo.nombreTipoGraduacion ?? tipo.NombreTipoGraduacion ?? "").trim();
    const gradsRaw = tipo.graduaciones ?? tipo.Graduaciones ?? [];
    const filas = gradsRaw.map(normalizarFilaApi).filter((g) => g.activo !== false);
    const ordenadas = [...filas].sort((a, b) => a.orden - b.orden);
    const conKeys = asignarClavesCampo(ordenadas);
    if (!conKeys.length) continue;

    const tipoKey = slugCampo(tituloApi || `RxTipo_${idTipo}`, idTipo);
    const titulo = tituloApi || `Graduación (tipo ${idTipo})`;
    const abierto = secciones.length < 2;

    secciones.push({
      idTipo,
      tipo: tipoKey,
      titulo,
      abierto,
      columnas: conKeys.map((r) => ({
        key: r.campoKey,
        label: r.abreviatura || r.nombre || r.campoKey,
        idGraduacion: r.idGraduacion,
      })),
    });
  }

  return secciones;
}

function initRXConColumnas(columnasKeys) {
  const OD = {};
  const OI = {};
  for (const k of columnasKeys) {
    OD[k] = "";
    OI[k] = "";
  }
  return { OD, OI, observaciones: "" };
}

function mergeExamenRx(prev, secciones) {
  const next = { ...prev };
  const seccionesActivas = new Set(secciones.map((s) => s.tipo));

  for (const sec of secciones) {
    const keys = sec.columnas.map((c) => c.key);
    const prevRx = prev[sec.tipo] ?? initRXConColumnas(keys);
    const OD = { ...prevRx.OD };
    const OI = { ...prevRx.OI };
    for (const k of keys) {
      if (OD[k] === undefined) OD[k] = prevRx.OD?.[k] ?? "";
      if (OI[k] === undefined) OI[k] = prevRx.OI?.[k] ?? "";
    }
    next[sec.tipo] = { OD, OI, observaciones: prevRx.observaciones ?? "" };
  }

  for (const key of Object.keys(prev)) {
    if (key === "observacionesGenerales" || seccionesActivas.has(key)) continue;
    const valor = prev[key];
    if (
      valor &&
      typeof valor === "object" &&
      !Array.isArray(valor) &&
      (Object.prototype.hasOwnProperty.call(valor, "OD") ||
        Object.prototype.hasOwnProperty.call(valor, "OI"))
    ) {
      delete next[key];
    }
  }

  next.observacionesGenerales = prev.observacionesGenerales ?? "";
  return next;
}

function construirSecuenciaTab(secciones) {
  const seq = [];
  for (const s of secciones) {
    for (const o of ["OD", "OI"]) {
      for (const col of s.columnas) seq.push(normalizeId(s.tipo, o, col.key));
    }
  }
  return seq;
}

function resolveIdentificadorExamen(examen) {
  const raw =
    examen?.identificadorGraduaciones ??
    examen?.IdentificadorGraduaciones ??
    examen?.identificador ??
    examen?.Identificador;
  if (raw !== undefined && raw !== null && String(raw).trim() !== "") {
    const n = Number.parseInt(String(raw), 10);
    if (Number.isFinite(n)) return n;
  }
  return getSucursalIdentificador();
}

function posicionToOjo(posicion) {
  if (!posicion) return null;
  const valor = String(posicion).trim().toUpperCase();
  if (valor.startsWith("D") || valor.includes("DER")) return "OD";
  if (valor.startsWith("I") || valor.includes("IZQ")) return "OI";
  return null;
}

const ID_TIPO_RX_ANTERIOR = 1;

function construirRxActualDesdeApi(rows, secciones) {
  const rxActual = {};
  if (!Array.isArray(rows) || !Array.isArray(secciones) || !secciones.length) return rxActual;

  // Inicializar estructura para todos los tipos
  for (const sec of secciones) {
    rxActual[sec.tipo] = { OD: {}, OI: {} };
  }

  // Buscar la sección destino: la de idTipoGraduacion === 1 ("RX anterior en uso")
  const seccionDestino = secciones.find((s) => s.idTipo === ID_TIPO_RX_ANTERIOR);
  if (!seccionDestino) return rxActual;

  // Índice primario: idGraduacion → campoKey  (solo dentro del tipo destino)
  const porId = new Map();
  // Índice secundario: slugAbrev → campoKey
  const porSlug = new Map();

  for (const col of seccionDestino.columnas) {
    if (col.idGraduacion != null) {
      porId.set(Number(col.idGraduacion), col.key);
    }
    porSlug.set(col.key, col.key);
  }

  for (const row of rows) {
    const ojo = posicionToOjo(row.posicion ?? row.posicion_nombre);
    if (!ojo) continue;

    const idGrad = Number(row.id_graduacion ?? row.idGraduacion ?? row.IdGraduacion ?? 0);
    const abrevRaw = String(row.abreviatura ?? "").trim();
    const slugAbrev = slugCampo(abrevRaw, idGrad);

    // Match por id primero, slug como fallback
    const campoKey = (idGrad && porId.get(idGrad)) ?? porSlug.get(slugAbrev);
    if (!campoKey) continue;

    const valor = row.resultado_valor ?? row.resultadoValor ?? row.resultado ?? "";
    rxActual[seccionDestino.tipo][ojo][campoKey] = valor;
  }

  return rxActual;
}


const CellInput = React.memo(function CellInput({
  value,
  onCommit,
  id,
  externalRef,
  tabbingRef,
  mouseNavRef,
  mouseNavTimerRef,
  registerPendingCommit,
  flushPendingCommits,
}) {
  const [local, setLocal] = React.useState(value ?? "");
  const innerRef = React.useRef(null);
  const inputRef = externalRef ?? innerRef;
  const blurTimerRef = React.useRef(null);

  React.useEffect(() => setLocal(value ?? ""), [value]);

  React.useEffect(
    () => () => {
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    },
    []
  );

  const handleBlur = React.useCallback(() => {
    if (tabbingRef.current || mouseNavRef.current) {
      registerPendingCommit(id, onCommit, local);
      return;
    }
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    blurTimerRef.current = setTimeout(() => {
      blurTimerRef.current = null;
      if ((value ?? "") !== local) onCommit(local);
    }, 0);
  }, [local, onCommit, value, id, tabbingRef, mouseNavRef, registerPendingCommit]);

  const handleMouseDown = React.useCallback(
    (e) => {
      mouseNavRef.current = true;
      if (mouseNavTimerRef.current) clearTimeout(mouseNavTimerRef.current);
      mouseNavTimerRef.current = setTimeout(() => {
        mouseNavRef.current = false;
        mouseNavTimerRef.current = null;
      }, 200);
      e.stopPropagation();
      if (inputRef.current && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current.focus();
        requestAnimationFrame(() => {
          try { inputRef.current.focus(); } catch (_) {}
        });
      }
    },
    [inputRef, mouseNavRef, mouseNavTimerRef]
  );

  const handleFocus = React.useCallback(
    (e) => {
      try { e.target.select(); } catch (_) {}
      requestAnimationFrame(() => { flushPendingCommits(); });
    },
    [flushPendingCommits]
  );

  const handleKeyDown = React.useCallback((e) => {
    if (e.key === "Tab") e.stopPropagation();
  }, []);

  return (
    <TextField
      size="small"
      inputRef={inputRef}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={handleBlur}
      onMouseDown={handleMouseDown}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      inputProps={{ style: { textAlign: "center", width: 60 }, "aria-label": id }}
    />
  );
});

const TablaRX = React.memo(function TablaRX({
  tipo,
  columnas,
  rx,
  tabSequence,
  setCampo,
  tabbingRef,
  tabbingTimerRef,
  mouseNavRef,
  mouseNavTimerRef,
  registerPendingCommit,
  flushPendingCommits,
}) {
  const campos = React.useMemo(() => columnas.map((c) => c.key), [columnas]);
  const cellRefs = React.useRef({});

  const handleTableKeyDownCapture = React.useCallback(
    (e) => {
      if (e.key !== "Tab") return;
      const active = document.activeElement;
      if (!active) return;

      const isFocusable = (n) =>
        !!(n && typeof n.focus === "function" && !n.disabled && n.tabIndex !== -1);
      const doFocus = (n) => {
        if (!n) return false;
        try { n.focus(); n.select?.(); } catch (_) {}
        requestAnimationFrame(() => { try { n.focus(); } catch (_) {} });
        return true;
      };

      const currentAria = active.getAttribute?.("aria-label") ?? "";
      const idx = tabSequence.indexOf(currentAria);
      const forward = !e.shiftKey;

      if (idx !== -1) {
        const nextIdx = forward ? idx + 1 : idx - 1;
        if (nextIdx >= 0 && nextIdx < tabSequence.length) {
          const nextEl = cellRefs.current[tabSequence[nextIdx]]?.current;
          if (isFocusable(nextEl)) {
            e.preventDefault();
            e.stopPropagation();
            tabbingRef.current = true;
            if (tabbingTimerRef.current) clearTimeout(tabbingTimerRef.current);
            tabbingTimerRef.current = setTimeout(() => {
              tabbingRef.current = false;
              tabbingTimerRef.current = null;
            }, 150);
            doFocus(nextEl);
            return;
          }
        }
      }

      // Fallback: navegación local
      const localOrder = [];
      for (const o of ["OD", "OI"]) {
        for (const c of campos) {
          const r = cellRefs.current[normalizeId(tipo, o, c)];
          if (r?.current && isFocusable(r.current)) localOrder.push(r.current);
        }
      }
      const cur = localOrder.indexOf(active);
      const next = localOrder[forward ? cur + 1 : cur - 1];
      if (next) {
        e.preventDefault();
        e.stopPropagation();
        tabbingRef.current = true;
        if (tabbingTimerRef.current) clearTimeout(tabbingTimerRef.current);
        tabbingTimerRef.current = setTimeout(() => {
          tabbingRef.current = false;
          tabbingTimerRef.current = null;
        }, 150);
        doFocus(next);
      }
    },
    [campos, tipo, tabSequence, tabbingRef, tabbingTimerRef]
  );

  return (
    <TableContainer component={Paper} variant="outlined" onKeyDownCapture={handleTableKeyDownCapture}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            {columnas.map((col) => (
              <TableCell key={col.key} align="center" sx={{ fontWeight: "bold" }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {["OD", "OI"].map((ojo) => (
            <TableRow key={ojo}>
              <TableCell sx={{ fontWeight: "bold", width: 60 }}>{ojo}</TableCell>
              {columnas.map((col) => {
                const id = normalizeId(tipo, ojo, col.key);
                if (!cellRefs.current[id]) cellRefs.current[id] = React.createRef();
                return (
                  <TableCell key={col.key} align="center" sx={{ p: 0.5 }}>
                    <CellInput
                      id={id}
                      externalRef={cellRefs.current[id]}
                      value={rx?.[ojo]?.[col.key] ?? ""}
                      onCommit={(val) => setCampo(tipo, ojo, col.key, val)}
                      tabbingRef={tabbingRef}
                      mouseNavRef={mouseNavRef}
                      mouseNavTimerRef={mouseNavTimerRef}
                      registerPendingCommit={registerPendingCommit}
                      flushPendingCommits={flushPendingCommits}
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
        onChange={(e) => setLocal(e.target.value)}
        onBlur={handleBlur}
        inputProps={{ "aria-label": "observaciones-medico" }}
      />
    </Box>
  );
});

const SeccionRX = React.memo(function SeccionRX({
  titulo, tipo, columnas, abierto, rx,
  tabSequence, setCampo,
  tabbingRef, tabbingTimerRef, mouseNavRef, mouseNavTimerRef,
  registerPendingCommit, flushPendingCommits,
}) {
  return (
    <Accordion defaultExpanded={abierto}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bold">{titulo}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TablaRX
          tipo={tipo}
          columnas={columnas}
          rx={rx}
          tabSequence={tabSequence}
          setCampo={setCampo}
          tabbingRef={tabbingRef}
          tabbingTimerRef={tabbingTimerRef}
          mouseNavRef={mouseNavRef}
          mouseNavTimerRef={mouseNavTimerRef}
          registerPendingCommit={registerPendingCommit}
          flushPendingCommits={flushPendingCommits}
        />
      </AccordionDetails>
    </Accordion>
  );
});

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────

export default function GraduacionRX({ examen, setExamen }) {
  const [secciones, setSecciones] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);
  const [errorCarga, setErrorCarga] = React.useState(null);

  // FIX: se usa una ref para rastrear qué par (noPaciente, secciones) ya fue cargado,
  // evitando doble fetch cuando secciones llega después de que noPaciente ya estaba listo.
  const lastLoadedRef = React.useRef({ noPaciente: null, seccionesKey: null });

  const identificadorGraduaciones = React.useMemo(
    () => (examen ? resolveIdentificadorExamen(examen) : getSucursalIdentificador()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      examen?.identificador,
      examen?.Identificador,
      examen?.identificadorGraduaciones,
      examen?.IdentificadorGraduaciones,
    ]
  );

  // Efecto 1: cargar la configuración de secciones/graduaciones
  React.useEffect(() => {
    if (!examen) return;
    let cancelado = false;
    setCargando(true);
    setErrorCarga(null);

    const cargar = async () => {
      try {
        const data = await obtenerGraduacionesPorIdentificador(identificadorGraduaciones);
        if (cancelado) return;
        if (data?.esCorrecto === false || data?.EsCorrecto === false) {
          throw new Error(data?.mensaje ?? data?.Mensaje ?? "No se pudieron obtener las graduaciones.");
        }
        const tipos = tiposDesdeRespuestaApi(data);
        const built = construirSeccionesDesdeApiAgrupada(tipos);
        setSecciones(built);
        setExamen((prev) => mergeExamenRx(prev ?? {}, built));
      } catch (e) {
        if (cancelado) return;
        setSecciones([]);
        setExamen((prev) => mergeExamenRx(prev ?? {}, []));
        setErrorCarga(
          e?.response?.data?.mensaje ?? e?.message ?? "No se pudieron cargar las graduaciones."
        );
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    cargar();
    return () => { cancelado = true; };
  }, [identificadorGraduaciones, setExamen]);

  // FIX PRINCIPAL: cargar RX previo del paciente.
  // Antes dependía de `secciones` como estado → se ejecutaba dos veces (una con [] y otra
  // cuando llegaban las secciones reales). Ahora esperamos a que secciones tenga contenido
  // y usamos una clave compuesta para no repetir la carga si ya se hizo con los mismos datos.
  React.useEffect(() => {
    const noPacienteId = examen?.NoPaciente;
    if (!noPacienteId || cargando || !secciones.length) return;

    // Clave estable que representa "secciones actuales"
    const seccionesKey = secciones.map((s) => s.tipo).join("|");
    const lastLoaded = lastLoadedRef.current;

    // Si ya cargamos para este paciente con estas mismas secciones, no repetir
    if (lastLoaded.noPaciente === noPacienteId && lastLoaded.seccionesKey === seccionesKey) return;

    let cancelado = false;

    // Limpiar campos antes de cargar
    setExamen((prev) => {
      const actualizado = { ...prev };
      for (const sec of secciones) {
        actualizado[sec.tipo] = { OD: {}, OI: {} };
      }
      return actualizado;
    });

    const cargarRxActual = async () => {
      try {
        const data = await obtenerExamenCompletoPorNoPaciente(noPacienteId);
        if (cancelado) return;
        const rows = Array.isArray(data) ? data : Array.isArray(data?.datos) ? data.datos : [];
        const rxActual = construirRxActualDesdeApi(rows, secciones);

        lastLoadedRef.current = { noPaciente: noPacienteId, seccionesKey };
        setExamen((prev) => ({ ...prev, ...rxActual }));
      } catch (e) {
        if (cancelado) return;
        console.error("Error al cargar RX Actual por noPaciente:", e);
      }
    };

    cargarRxActual();
    return () => { cancelado = true; };
  }, [examen?.NoPaciente, secciones, cargando, setExamen]);

  // Refs compartidos para navegación con teclado/mouse
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
      try { e.commitFn(e.value); } catch (_) {}
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (tabbingTimerRef.current) clearTimeout(tabbingTimerRef.current);
      if (mouseNavTimerRef.current) clearTimeout(mouseNavTimerRef.current);
      pendingCommitsRef.current = {};
    };
  }, []);

  const tabSequence = React.useMemo(() => construirSecuenciaTab(secciones), [secciones]);

  const setCampo = React.useCallback((tipo, ojo, campo, valor) => {
    setExamen((prev) => ({
      ...prev,
      [tipo]: {
        ...(prev[tipo] ?? initRXConColumnas([campo])),
        [ojo]: {
          ...(prev[tipo]?.[ojo] ?? {}),
          [campo]: valor,
        },
      },
    }));
  }, [setExamen]);

  if (!examen) return null;

  const idMostrado = resolveIdentificadorExamen(examen);

  // Props compartidas para los subcomponentes de navegación
  const navProps = {
    tabSequence,
    setCampo,
    tabbingRef,
    tabbingTimerRef,
    mouseNavRef,
    mouseNavTimerRef,
    registerPendingCommit,
    flushPendingCommits,
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Graduación RX
      </Typography>

      {cargando && (
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <CircularProgress size={22} />
          <Typography variant="body2">Cargando graduaciones…</Typography>
        </Box>
      )}

      {errorCarga && !cargando && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorCarga}
        </Alert>
      )}

      {!cargando && !errorCarga && secciones.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No hay graduaciones activas configuradas para el identificador {idMostrado}. Revise el
          mantenimiento de graduaciones o el identificador de sucursal.
        </Alert>
      )}

      <ObservacionesField
        value={examen.observacionesGenerales}
        onCommit={(val) => setExamen((prev) => ({ ...prev, observacionesGenerales: val }))}
      />

      {!cargando &&
        !errorCarga &&
        secciones.map((sec) => (
          <SeccionRX
            key={sec.tipo}
            tipo={sec.tipo}
            titulo={sec.titulo}
            columnas={sec.columnas}
            abierto={sec.abierto}
            rx={examen[sec.tipo]}
            {...navProps}
          />
        ))}
    </Box>
  );
}

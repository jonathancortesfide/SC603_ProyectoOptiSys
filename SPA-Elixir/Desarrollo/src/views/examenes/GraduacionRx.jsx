import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { obtenerExamenCompletoPorNoPaciente } from '../../requests/examenes/RequestsExamenes';
import { obtenerGraduacionesPorIdentificador } from '../../requests/examenes/RequestsGraduacion';

/* =========================================================================
 * MAPEO LEGACY
 * -------------------------------------------------------------------------
 * El backend de guardado del examen espera exactamente estas keys
 * (RxBase.OD.Esfera, RxActual.OD.DNP, etc). La API de graduaciones nos da
 * el ORDEN, el TÍTULO y qué columnas están ACTIVAS por identificador de
 * sucursal, pero la traducción abreviatura -> campo legacy se mantiene
 * fija acá para no romper lo que ya está guardado en producción.
 *
 * Si el backend agrega una graduación nueva que no está en este mapa,
 * esa columna simplemente se ignora (no se rompe nada, pero tampoco
 * aparece hasta que alguien la agregue acá a propósito).
 * ========================================================================= */

const TIPO_LEGACY = {
  1: 'RxBase', // "RX anterior (en uso)" -> se llena con el RX previo del paciente
  2: 'RxActual', // "RX actual (nueva)"
  3: 'RxCerca',
  4: 'RxContacto',
};

const TITULO_LEGACY = {
  RxBase: 'RX en Uso',
  RxActual: 'RX Base',
  RxCerca: 'RX Cerca',
  RxContacto: 'RX Lente de Contacto',
};

const ORDEN_FIJO_SECCIONES = ['RxBase', 'RxActual', 'RxCerca', 'RxContacto'];

// OJO: se respeta el typo/inconsistencia histórica de "Adicion" vs "Adicción"
// tal como estaba en el componente hardcodeado original.
const CAMPO_LEGACY_POR_TIPO = {
  RxBase: {
    ESF: 'Esfera',
    CIL: 'Cilindro',
    EJE: 'Eje',
    ADD: 'Adicion',
    DNP: 'DNP',
    AVC: 'AVC',
    AVL: 'AVL',
    ALT: 'Altura',
    BASE: 'Base',
    PR: 'Prisma',
    CB: 'CB',
    DIAM: 'Diam',
    AVSC: 'AVSC',
    PIO: 'PIO',
    LH: 'LH',
  },
  RxActual: {
    ESF: 'Esfera',
    CIL: 'Cilindro',
    EJE: 'Eje',
    ADD: 'Adicción',
    DNP: 'DNP',
    AVC: 'AVC',
    AVL: 'AVL',
    ALT: 'Altura',
    BASE: 'Base',
    PR: 'Prisma',
    CB: 'CB',
    DIAM: 'Diam',
    AVSC: 'AVSC',
    PIO: 'PIO',
    LH: 'LH',
  },
  RxCerca: {
    ESF: 'Esfera',
    CIL: 'Cilindro',
    EJE: 'Eje',
    DNP: 'DNP',
    AVC: 'AVC',
  },
  RxContacto: {
    ESF: 'Esfera',
    CIL: 'Cilindro',
    EJE: 'Eje',
    ADD: 'Adicción',
  },
};

const ID_TIPO_RX_ANTERIOR = 1;

// TODO: reemplazar el fallback "1" por el helper real de sucursal cuando
// exista en este proyecto (equivalente a getSucursalIdentificador()).
function resolveIdentificadorExamen(examen) {
  const raw =
    examen?.identificadorGraduaciones ??
    examen?.IdentificadorGraduaciones ??
    examen?.identificador ??
    examen?.Identificador;
  if (raw !== undefined && raw !== null && String(raw).trim() !== '') {
    const n = Number.parseInt(String(raw), 10);
    if (Number.isFinite(n)) return n;
  }
  return 1;
}

const initRX = () => ({ OD: {}, OI: {}, observaciones: '' });

function normalizeId(tipo, ojo, campo) {
  const safeCampo = String(campo)
    .normalize?.('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
  return `${String(tipo).toLowerCase()}_${String(ojo).toLowerCase()}_${safeCampo}`;
}

function posicionToOjo(posicion) {
  if (!posicion) return null;
  const valor = String(posicion).trim().toUpperCase();
  if (valor.startsWith('D') || valor.includes('DER')) return 'OD';
  if (valor.startsWith('I') || valor.includes('IZQ')) return 'OI';
  return null;
}

function tiposDesdeRespuestaApi(data) {
  if (!data) return [];
  return data.tiposGraduacion ?? data.TiposGraduacion ?? [];
}

function normalizarFilaApi(row) {
  return {
    idGraduacion: row.idGraduacion ?? row.IdGraduacion,
    nombre: row.nombre ?? row.Nombre ?? '',
    abreviatura: row.abreviatura ?? row.Abreviatura ?? '',
    orden: Number(row.orden ?? row.Orden ?? 0),
    activo: row.activo ?? row.Activo ?? true,
    idTipoGraduacion: Number(row.idTipoGraduacion ?? row.IdTipoGraduacion ?? 0),
  };
}

// Construye las secciones (RxBase/RxActual/RxCerca/RxContacto) a partir de
// la respuesta de /api/Graduacion/Obtener, traduciendo cada abreviatura a
// su key legacy correspondiente.
function construirSeccionesLegacy(tiposApi) {
  const secciones = [];

  for (const tipo of tiposApi) {
    const idTipo = Number(tipo.idTipoGraduacion ?? tipo.IdTipoGraduacion ?? 0);
    const tipoKey = TIPO_LEGACY[idTipo];
    if (!tipoKey) continue; // tipo que el guardado legacy todavía no soporta

    const gradsRaw = tipo.graduaciones ?? tipo.Graduaciones ?? [];
    const filas = gradsRaw.map(normalizarFilaApi).filter((g) => g.activo !== false);
    const ordenadas = [...filas].sort((a, b) => a.orden - b.orden);

    const mapaLegacy = CAMPO_LEGACY_POR_TIPO[tipoKey] || {};
    const columnas = [];
    for (const g of ordenadas) {
      const abrev = String(g.abreviatura ?? '')
        .trim()
        .toUpperCase();
      const campoLegacy = mapaLegacy[abrev];
      if (!campoLegacy) continue; // columna nueva sin mapeo legacy -> se ignora
      columnas.push({
        key: campoLegacy,
        label: g.abreviatura || g.nombre || campoLegacy,
        idGraduacion: g.idGraduacion,
      });
    }
    if (!columnas.length) continue;

    secciones.push({
      idTipo,
      tipo: tipoKey,
      titulo: TITULO_LEGACY[tipoKey] || tipo.nombreTipoGraduacion || tipoKey,
      abierto: tipoKey === 'RxBase' || tipoKey === 'RxActual',
      columnas,
    });
  }

  secciones.sort(
    (a, b) => ORDEN_FIJO_SECCIONES.indexOf(a.tipo) - ORDEN_FIJO_SECCIONES.indexOf(b.tipo),
  );

  return secciones;
}

// Agrega/limpia secciones en el objeto `examen` según lo que vino de la API,
// sin tocar valores ya cargados.
function mergeExamenRx(prev, secciones) {
  const next = { ...prev };
  const seccionesActivas = new Set(secciones.map((s) => s.tipo));

  for (const sec of secciones) {
    const prevRx = prev[sec.tipo] ?? initRX();
    next[sec.tipo] = {
      OD: { ...(prevRx.OD ?? {}) },
      OI: { ...(prevRx.OI ?? {}) },
      observaciones: prevRx.observaciones ?? '',
    };
  }

  for (const key of Object.keys(prev)) {
    if (key === 'observacionesGenerales' || seccionesActivas.has(key)) continue;
    const valor = prev[key];
    if (
      valor &&
      typeof valor === 'object' &&
      !Array.isArray(valor) &&
      (Object.prototype.hasOwnProperty.call(valor, 'OD') ||
        Object.prototype.hasOwnProperty.call(valor, 'OI'))
    ) {
      delete next[key];
    }
  }

  next.observacionesGenerales = prev.observacionesGenerales ?? '';
  return next;
}

function construirSecuenciaTab(secciones) {
  const seq = [];
  for (const s of secciones) {
    for (const o of ['OD', 'OI']) {
      for (const col of s.columnas) seq.push(normalizeId(s.tipo, o, col.key));
    }
  }
  return seq;
}

// Traduce las filas del RX anterior del paciente (ObtenerPorNoPaciente) a
// la sección legacy correspondiente (idTipoGraduacion === 1 -> "RxBase").
function construirRxAnteriorDesdeApi(rows, secciones) {
  const resultado = {};
  for (const sec of secciones) resultado[sec.tipo] = { OD: {}, OI: {} };

  const seccionDestino =
    secciones.find((s) => s.tipo === 'RxActual') ??
    secciones.find((s) => s.idTipo === ID_TIPO_RX_ANTERIOR);
  if (!seccionDestino || !Array.isArray(rows)) return resultado;

  const porId = new Map();
  for (const col of seccionDestino.columnas) {
    if (col.idGraduacion != null) porId.set(Number(col.idGraduacion), col.key);
  }
  const mapaAbrev = CAMPO_LEGACY_POR_TIPO[seccionDestino.tipo] || {};

  for (const row of rows) {
    const ojo = posicionToOjo(row.posicion ?? row.posicion_nombre);
    if (!ojo) continue;

    const idGrad = Number(row.id_graduacion ?? row.idGraduacion ?? row.IdGraduacion ?? 0);
    const abrev = String(row.abreviatura ?? '')
      .trim()
      .toUpperCase();
    const campoKey = (idGrad && porId.get(idGrad)) ?? mapaAbrev[abrev];
    if (!campoKey) continue;

    const valor = row.resultado_valor ?? row.resultadoValor ?? row.resultado ?? '';
    resultado.RxActual = resultado.RxActual ?? { OD: {}, OI: {} };
    resultado.RxActual[ojo][campoKey] = valor;
  }

  return resultado;
}

/* =========================================================================
 * Componentes de UI (nivel de módulo, identidad estable entre renders —
 * ver comentario original sobre por qué NO deben vivir dentro del padre).
 * ========================================================================= */

const RxNavContext = React.createContext(null);

const CellInput = React.memo(function CellInput({ value, onCommit, id, externalRef }) {
  const nav = React.useContext(RxNavContext);
  const [local, setLocal] = React.useState(value ?? '');
  const innerRef = React.useRef(null);
  const inputRef = externalRef ?? innerRef;

  React.useEffect(() => setLocal(value ?? ''), [value]);

  const blurTimerRef = React.useRef(null);
  const handleBlur = React.useCallback(() => {
    if (nav.tabbingRef.current || nav.mouseNavRef.current) {
      nav.registerPendingCommit(id, onCommit, local);
      return;
    }
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    blurTimerRef.current = setTimeout(() => {
      blurTimerRef.current = null;
      if ((value ?? '') !== local) onCommit(local);
    }, 0);
  }, [local, onCommit, value, id, nav]);

  React.useEffect(
    () => () => {
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    },
    [],
  );

  const handleMouseDown = React.useCallback(
    (e) => {
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
        requestAnimationFrame(() => {
          try {
            inputRef.current.focus();
          } catch (_) {}
        });
      }
    },
    [inputRef, nav],
  );

  const handleFocus = React.useCallback(
    (e) => {
      try {
        e.target.select();
      } catch (err) {
        /* no crítico */
      }
      requestAnimationFrame(() => {
        nav.flushPendingCommits();
      });
    },
    [nav],
  );

  const handleKeyDown = React.useCallback((e) => {
    if (e.key !== 'Tab') return;
    e.stopPropagation();
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
      inputProps={{ style: { textAlign: 'center', width: 60 }, 'aria-label': id }}
    />
  );
});

const TablaRX = React.memo(function TablaRX({ tipo, columnas, rx, setCampo }) {
  const nav = React.useContext(RxNavContext);
  const cellRefs = React.useRef({});

  const handleTableKeyDownCaptureLocal = React.useCallback(
    (e) => {
      if (e.key !== 'Tab') return;
      const active = document.activeElement;
      if (!active) return;

      const isFocusable = (n) =>
        !!(n && typeof n.focus === 'function' && !n.disabled && n.tabIndex !== -1);
      const doFocus = (n) => {
        if (!n) return false;
        try {
          n.focus();
          n.select?.();
        } catch (_) {
          /* ignore */
        }
        requestAnimationFrame(() => {
          try {
            n.focus();
          } catch (_) {}
        });
        return true;
      };

      const seq = nav.tabSequence;
      const currentAria = active.getAttribute?.('aria-label') ?? '';
      const idx = seq.indexOf(currentAria);
      const forward = !e.shiftKey;

      if (idx !== -1) {
        const nextIdx = forward ? idx + 1 : idx - 1;
        if (nextIdx >= 0 && nextIdx < seq.length) {
          const nextEl = nav.cellRefsGlobal.current[seq[nextIdx]]?.current;
          if (isFocusable(nextEl)) {
            e.preventDefault();
            e.stopPropagation();
            nav.tabbingRef.current = true;
            if (nav.tabbingTimerRef.current) clearTimeout(nav.tabbingTimerRef.current);
            nav.tabbingTimerRef.current = setTimeout(() => {
              nav.tabbingRef.current = false;
              nav.tabbingTimerRef.current = null;
            }, 150);
            doFocus(nextEl);
            return;
          }
        }
      }

      const localOrder = [];
      for (const o of ['OD', 'OI']) {
        for (const col of columnas) {
          const id = normalizeId(tipo, o, col.key);
          const r = cellRefs.current[id];
          if (r?.current && isFocusable(r.current)) localOrder.push(r.current);
        }
      }
      const cur = localOrder.indexOf(active);
      const next = localOrder[forward ? cur + 1 : cur - 1];
      if (next) {
        e.preventDefault();
        e.stopPropagation();
        nav.tabbingRef.current = true;
        if (nav.tabbingTimerRef.current) clearTimeout(nav.tabbingTimerRef.current);
        nav.tabbingTimerRef.current = setTimeout(() => {
          nav.tabbingRef.current = false;
          nav.tabbingTimerRef.current = null;
        }, 150);
        doFocus(next);
      }
    },
    [columnas, tipo, nav],
  );

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      onKeyDownCapture={handleTableKeyDownCaptureLocal}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            {columnas.map((col) => (
              <TableCell key={col.key} align="center" sx={{ fontWeight: 'bold' }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {['OD', 'OI'].map((ojo) => (
            <TableRow key={ojo}>
              <TableCell sx={{ fontWeight: 'bold', width: 60 }}>{ojo}</TableCell>

              {columnas.map((col) => {
                const id = normalizeId(tipo, ojo, col.key);
                if (!cellRefs.current[id]) cellRefs.current[id] = React.createRef();
                // Registrar también en el mapa global para el tab-order cross-sección
                nav.cellRefsGlobal.current[id] = cellRefs.current[id];
                return (
                  <TableCell key={col.key} align="center" sx={{ p: 0.5 }}>
                    <CellInput
                      id={id}
                      externalRef={cellRefs.current[id]}
                      value={rx?.[ojo]?.[col.key] ?? ''}
                      onCommit={(val) => setCampo(tipo, ojo, col.key, val)}
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
  const [local, setLocal] = React.useState(value ?? '');
  const timerRef = React.useRef(null);

  React.useEffect(() => setLocal(value ?? ''), [value]);

  React.useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if ((value ?? '') !== local) onCommit(local);
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [local, onCommit, value]);

  const handleBlur = React.useCallback(() => {
    if ((value ?? '') !== local) onCommit(local);
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
        inputProps={{ 'aria-label': 'observaciones-medico' }}
      />
    </Box>
  );
});

const SeccionRX = React.memo(function SeccionRX({
  titulo,
  tipo,
  columnas,
  abierto,
  extra,
  rx,
  setCampo,
}) {
  return (
    <Accordion defaultExpanded={abierto}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bold">{titulo}</Typography>
        {extra}
      </AccordionSummary>

      <AccordionDetails>
        <TablaRX tipo={tipo} columnas={columnas} rx={rx} setCampo={setCampo} />
      </AccordionDetails>
    </Accordion>
  );
});

/* =========================================================================
 * Componente principal
 * ========================================================================= */

export default function GraduacionRX({ examen, setExamen }) {
  const [secciones, setSecciones] = React.useState([]);
  const [cargandoConfig, setCargandoConfig] = React.useState(true);
  const [errorConfig, setErrorConfig] = React.useState(null);
  const [cargandoRxAnterior, setCargandoRxAnterior] = React.useState(false);

  const lastLoadedRef = React.useRef({ noPaciente: null, seccionesKey: null });

  const identificadorGraduaciones = React.useMemo(
    () => (examen ? resolveIdentificadorExamen(examen) : 1),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      examen?.identificador,
      examen?.Identificador,
      examen?.identificadorGraduaciones,
      examen?.IdentificadorGraduaciones,
    ],
  );

  // Efecto 1: cargar estructura de graduaciones (secciones/columnas) desde el backend.
  React.useEffect(() => {
    if (!examen) return;
    let cancelado = false;
    setCargandoConfig(true);
    setErrorConfig(null);

    const cargar = async () => {
      try {
        const data = await obtenerGraduacionesPorIdentificador(identificadorGraduaciones);
        if (cancelado) return;
        if (data?.esCorrecto === false || data?.EsCorrecto === false) {
          throw new Error(
            data?.mensaje ?? data?.Mensaje ?? 'No se pudieron obtener las graduaciones.',
          );
        }
        const tipos = tiposDesdeRespuestaApi(data);
        const built = construirSeccionesLegacy(tipos);
        setSecciones(built);
        setExamen((prev) => mergeExamenRx(prev ?? {}, built));
      } catch (e) {
        if (cancelado) return;
        setSecciones([]);
        setErrorConfig(
          e?.response?.data?.mensaje ?? e?.message ?? 'No se pudieron cargar las graduaciones.',
        );
      } finally {
        if (!cancelado) setCargandoConfig(false);
      }
    };

    cargar();
    return () => {
      cancelado = true;
    };
  }, [identificadorGraduaciones, setExamen]);

  // Efecto 2: cargar RX anterior del paciente (igual que antes, ahora resuelto contra secciones dinámicas).
  React.useEffect(() => {
    const noPacienteId = examen?.NoPaciente;
    if (!noPacienteId || cargandoConfig || !secciones.length) return;

    const seccionesKey = secciones.map((s) => s.tipo).join('|');
    const lastLoaded = lastLoadedRef.current;
    if (lastLoaded.noPaciente === noPacienteId && lastLoaded.seccionesKey === seccionesKey) return;

    let cancelado = false;
    setCargandoRxAnterior(true);

    const cargar = async () => {
      try {
        const data = await obtenerExamenCompletoPorNoPaciente(noPacienteId);
        if (cancelado) return;

        const rows = Array.isArray(data) ? data : Array.isArray(data?.datos) ? data.datos : [];
        const rxAnterior = construirRxAnteriorDesdeApi(rows, secciones);

        lastLoadedRef.current = { noPaciente: noPacienteId, seccionesKey };
        setExamen((prev) => {
          const next = { ...prev };
          const prevActual = prev.RxActual ?? initRX();
          const rxActual = rxAnterior.RxActual ?? { OD: {}, OI: {} };

          next.RxActual = {
            OD: { ...prevActual.OD, ...(rxActual.OD ?? {}) },
            OI: { ...prevActual.OI, ...(rxActual.OI ?? {}) },
            observaciones: prevActual.observaciones ?? '',
          };

          for (const sec of secciones.filter((s) => s.tipo !== 'RxActual')) {
            const prevRx = prev[sec.tipo] ?? initRX();
            next[sec.tipo] = {
              OD: { ...prevRx.OD },
              OI: { ...prevRx.OI },
              observaciones: prevRx.observaciones ?? '',
            };
          }

          return next;
        });
      } catch (e) {
        if (cancelado) return;
        console.error('Error al cargar RX anterior por NoPaciente:', e);
      } finally {
        if (!cancelado) setCargandoRxAnterior(false);
      }
    };

    cargar();
    return () => {
      cancelado = true;
    };
  }, [examen?.NoPaciente, secciones, cargandoConfig, setExamen]);

  const setCampo = React.useCallback(
    (tipo, ojo, campo, valor) => {
      setExamen((prev) => ({
        ...prev,
        [tipo]: {
          ...(prev[tipo] ?? initRX()),
          [ojo]: {
            ...(prev[tipo]?.[ojo] ?? {}),
            [campo]: valor,
          },
        },
      }));
    },
    [setExamen],
  );

  // Refs de navegación compartidas (estables entre renders).
  const tabbingRef = React.useRef(false);
  const tabbingTimerRef = React.useRef(null);
  const mouseNavRef = React.useRef(false);
  const mouseNavTimerRef = React.useRef(null);
  const pendingCommitsRef = React.useRef({});
  const cellRefsGlobal = React.useRef({}); // id -> ref, para el tab-order cross-sección

  const registerPendingCommit = React.useCallback((id, commitFn, value) => {
    pendingCommitsRef.current[id] = { commitFn, value };
  }, []);

  const flushPendingCommits = React.useCallback(() => {
    const entries = Object.values(pendingCommitsRef.current);
    pendingCommitsRef.current = {};
    for (const e of entries) {
      try {
        e.commitFn(e.value);
      } catch (_) {
        /* swallow */
      }
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (tabbingTimerRef.current) clearTimeout(tabbingTimerRef.current);
      if (mouseNavTimerRef.current) clearTimeout(mouseNavTimerRef.current);
      pendingCommitsRef.current = {};
    };
  }, []);

  const navValue = React.useRef({
    tabbingRef,
    tabbingTimerRef,
    mouseNavRef,
    mouseNavTimerRef,
    registerPendingCommit,
    flushPendingCommits,
    cellRefsGlobal,
    tabSequence: [],
  }).current;

  // El tabSequence se recalcula cuando cambian las secciones; se muta el
  // objeto de contexto directamente (se lee en el handler de evento, no en
  // render, así que no hace falta disparar un re-render extra).
  navValue.tabSequence = React.useMemo(() => construirSecuenciaTab(secciones), [secciones]);

  if (!examen) return null;

  return (
    <RxNavContext.Provider value={navValue}>
      <Box>
        <Typography variant="h6" mb={2}>
          Graduación RX
        </Typography>

        {cargandoConfig && (
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <CircularProgress size={22} />
            <Typography variant="body2">Cargando graduaciones…</Typography>
          </Box>
        )}

        {errorConfig && !cargandoConfig && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorConfig}
          </Alert>
        )}

        {!cargandoConfig && !errorConfig && secciones.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            No hay graduaciones activas configuradas para este identificador.
          </Alert>
        )}

        <ObservacionesField
          value={examen.observacionesGenerales}
          onCommit={(val) => setExamen((prev) => ({ ...prev, observacionesGenerales: val }))}
        />

        {!cargandoConfig &&
          !errorConfig &&
          secciones.map((sec) => (
            <SeccionRX
              key={sec.tipo}
              tipo={sec.tipo}
              titulo={sec.titulo}
              columnas={sec.columnas}
              abierto={sec.abierto}
              rx={examen[sec.tipo]}
              setCampo={setCampo}
              extra={
                sec.tipo === 'RxBase' && cargandoRxAnterior ? (
                  <Box display="flex" alignItems="center" gap={1} ml={2}>
                    <CircularProgress size={16} />
                    <Typography variant="caption">Cargando RX anterior…</Typography>
                  </Box>
                ) : null
              }
            />
          ))}
      </Box>
    </RxNavContext.Provider>
  );
}

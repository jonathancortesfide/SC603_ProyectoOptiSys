import { useCallback, useMemo, useState } from 'react';
import {
  createMaestroInicial,
  createLineaVacia,
  createFacturaFormaPagoVacia,
} from '../domain/facturaModel';
import { calcularTotalesFactura } from '../domain/calcularTotalesFactura';
import {
  MOCK_PACIENTES,
  MOCK_VENDEDORES,
  MOCK_PRODUCTOS,
  MOCK_FORMAS_PAGO,
  MOCK_MONEDAS_SUCURSAL,
  MOCK_CAJAS,
  MOCK_CIERRES_CAJA,
  MOCK_PACIENTE_CUENTAS,
} from '../data/mockCatalogos';

/**
 * Motor de estado para documentos tipo factura (reutilizable para cotización, NC, etc.).
 * Catálogos mock incluidos; sustituir por API cuando exista capa de datos.
 */
export function useFactura(options = {}) {
  const {
    maestroInicial,
    lineasIniciales,
    pagosIniciales,
    pacienteInicial = null,
    vendedorInicial = null,
    cuentaPacienteInicial = null,
    catalogos = {},
  } = options;

  const pacientes = catalogos.pacientes ?? MOCK_PACIENTES;
  const vendedores = catalogos.vendedores ?? MOCK_VENDEDORES;
  const productos = catalogos.productos ?? MOCK_PRODUCTOS;
  const formasPago = catalogos.formasPago ?? MOCK_FORMAS_PAGO;
  const monedasSucursal = catalogos.monedasSucursal ?? MOCK_MONEDAS_SUCURSAL;
  const cajas = catalogos.cajas ?? MOCK_CAJAS;
  const cierresCaja = catalogos.cierresCaja ?? MOCK_CIERRES_CAJA;
  const pacienteCuentas = catalogos.pacienteCuentas ?? MOCK_PACIENTE_CUENTAS;

  const [maestro, setMaestro] = useState(() =>
    createMaestroInicial({
      ...(maestroInicial || {}),
      pacienteId: pacienteInicial?.id ?? maestroInicial?.pacienteId ?? null,
      vendedorId: vendedorInicial?.id ?? maestroInicial?.vendedorId ?? null,
    }),
  );
  const [paciente, setPacienteState] = useState(pacienteInicial);
  const [vendedor, setVendedorState] = useState(vendedorInicial);
  const [cuentaPaciente, setCuentaPacienteState] = useState(cuentaPacienteInicial);
  const [detalle, setDetalle] = useState(() =>
    Array.isArray(lineasIniciales) && lineasIniciales.length > 0
      ? lineasIniciales
      : [createLineaVacia()],
  );
  const [pagos, setPagos] = useState(() =>
    Array.isArray(pagosIniciales) && pagosIniciales.length > 0
      ? pagosIniciales
      : [createFacturaFormaPagoVacia()],
  );

  const monedasPorId = useMemo(() => {
    const m = new Map();
    (monedasSucursal || []).forEach((x) => m.set(x.id, x));
    return m;
  }, [monedasSucursal]);

  const monedaPorCodigo = useMemo(() => {
    const m = new Map();
    (monedasSucursal || []).forEach((x) => m.set(x.monedaCodigo, x));
    return m;
  }, [monedasSucursal]);

  const updateMaestro = useCallback((patch) => {
    setMaestro((prev) => ({ ...prev, ...patch }));
  }, []);

  const setPaciente = useCallback((p) => {
    setPacienteState(p);
    setMaestro((prev) => ({
      ...prev,
      pacienteId: p?.id ?? null,
      pacienteCuentaId: null,
    }));
    setCuentaPacienteState(null);
  }, []);

  const setVendedor = useCallback((v) => {
    setVendedorState(v);
    setMaestro((prev) => ({
      ...prev,
      vendedorId: v?.id ?? null,
    }));
  }, []);

  const cuentasPacienteDisponibles = useMemo(() => {
    const pid = paciente?.id ?? maestro.pacienteId ?? null;
    if (!pid) return [];
    return (pacienteCuentas || []).filter((c) => c.pacienteId === pid);
  }, [paciente, maestro.pacienteId, pacienteCuentas]);

  const setCuentaPaciente = useCallback((cuenta) => {
    setCuentaPacienteState(cuenta);
    const mon = cuenta?.idMoneda ? monedasPorId.get(cuenta.idMoneda) : null;
    const monedaCodigo = mon?.monedaCodigo ?? null;
    const tipoCambioRef = mon?.tasaCambio ?? 1;

    setMaestro((prev) => ({
      ...prev,
      pacienteCuentaId: cuenta?.id ?? null,
      ...(monedaCodigo ? { monedaCodigo } : {}),
    }));

    setPagos((prev) =>
      (prev || []).map((p) => ({
        ...p,
        monedaCodigoPago:
          p.monedaCodigoPago !== undefined && p.monedaCodigoPago !== null && p.monedaCodigoPago !== ''
            ? p.monedaCodigoPago
            : (monedaCodigo || ''),
        tipoCambio:
          p.tipoCambio !== undefined && p.tipoCambio !== null
            ? p.tipoCambio
            : (monedaCodigo && monedaCodigo !== 'CRC' ? Number(tipoCambioRef) || 1 : 1),
      })),
    );
  }, [monedasPorId]);

  const setCondicionVenta = useCallback((condicion) => {
    if (condicion === 'CONTADO') {
      setMaestro((prev) => ({
        ...prev,
        condicionVenta: condicion,
        plazoDias: 0,
        fechaVencimiento: '',
      }));
      return;
    }

    // Crédito: si no hay plazo/vencimiento, proponer 30 días.
    setMaestro((prev) => {
      const plazo = Number(prev.plazoDias) > 0 ? Number(prev.plazoDias) : 30;
      const base = prev.fechaEmision ? new Date(prev.fechaEmision) : new Date();
      const venc = new Date(base);
      venc.setDate(venc.getDate() + plazo);
      const iso = new Date(venc.getTime() - venc.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);

      return {
        ...prev,
        condicionVenta: condicion,
        plazoDias: plazo,
        fechaVencimiento: prev.fechaVencimiento || iso,
      };
    });
  }, []);

  const setPlazoDias = useCallback((plazoDias) => {
    const plazo = Number(plazoDias) || 0;
    setMaestro((prev) => {
      if (prev.condicionVenta !== 'CREDITO') return { ...prev, plazoDias: 0, fechaVencimiento: '' };
      const base = prev.fechaEmision ? new Date(prev.fechaEmision) : new Date();
      const venc = new Date(base);
      venc.setDate(venc.getDate() + Math.max(0, plazo));
      const iso = new Date(venc.getTime() - venc.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
      return { ...prev, plazoDias: Math.max(0, plazo), fechaVencimiento: iso };
    });
  }, []);

  const totales = useMemo(() => calcularTotalesFactura(detalle), [detalle]);

  const totalPagos = useMemo(
    () =>
      (pagos || []).reduce((acc, p) => acc + (Number(p.monto) || 0), 0),
    [pagos],
  );

  const diferenciaPagoVsTotal = useMemo(
    () => Number((totalPagos - totales.totalDocumento).toFixed(2)),
    [totalPagos, totales.totalDocumento],
  );

  const addLinea = useCallback(() => {
    setDetalle((prev) => [...prev, createLineaVacia({ orden: prev.length })]);
  }, []);

  const updateLinea = useCallback((id, patch) => {
    setDetalle((prev) =>
      prev.map((linea) => (linea.id === id ? { ...linea, ...patch } : linea)),
    );
  }, []);

  const removeLinea = useCallback((id) => {
    setDetalle((prev) => {
      const next = prev.filter((l) => l.id !== id);
      return next.length === 0 ? [createLineaVacia()] : next;
    });
  }, []);

  const aplicarProductoALinea = useCallback((lineaId, producto) => {
    if (!producto) {
      updateLinea(lineaId, {
        productoId: null,
        producto: null,
      });
      return;
    }
    updateLinea(lineaId, {
      productoId: producto.id,
      producto,
      precioUnitario:
        producto.precioReferencia !== undefined && producto.precioReferencia !== null
          ? Number(producto.precioReferencia)
          : 0,
      tasaImpuesto:
        producto.tasaImpuesto !== undefined && producto.tasaImpuesto !== null
          ? Number(producto.tasaImpuesto)
          : 13,
    });
  }, [updateLinea]);

  const addPago = useCallback(() => {
    setPagos((prev) => [...prev, createFacturaFormaPagoVacia()]);
  }, []);

  const updatePago = useCallback((id, patch) => {
    setPagos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );
  }, []);

  const removePago = useCallback((id) => {
    setPagos((prev) => {
      const next = prev.filter((p) => p.id !== id);
      return next.length === 0 ? [createFacturaFormaPagoVacia()] : next;
    });
  }, []);

  const aplicarFormaPago = useCallback((pagoId, forma) => {
    if (!forma) {
      updatePago(pagoId, { formaPagoId: null, formaPago: null });
      return;
    }
    updatePago(pagoId, {
      formaPagoId: forma.id,
      formaPago: forma,
    });
  }, [updatePago]);

  const tipoCambioSugerido = useMemo(() => {
    const mon = monedaPorCodigo.get(maestro.monedaCodigo);
    if (!mon) return 1;
    return Number(mon.tasaCambio) || 1;
  }, [maestro.monedaCodigo, monedaPorCodigo]);

  const resetFactura = useCallback(() => {
    setMaestro(
      createMaestroInicial({
        ...(maestroInicial || {}),
        pacienteId: pacienteInicial?.id ?? maestroInicial?.pacienteId ?? null,
        vendedorId: vendedorInicial?.id ?? maestroInicial?.vendedorId ?? null,
      }),
    );
    setPacienteState(pacienteInicial ?? null);
    setVendedorState(vendedorInicial ?? null);
    setCuentaPacienteState(cuentaPacienteInicial ?? null);
    setDetalle([createLineaVacia()]);
    setPagos([createFacturaFormaPagoVacia()]);
  }, [maestroInicial, pacienteInicial, vendedorInicial, cuentaPacienteInicial]);

  /** Snapshot serializable para futura API / otro documento */
  const construirPayloadBorrador = useCallback(() => {
    return {
      maestro,
      paciente,
      vendedor,
      detalle,
      pagos,
      totales: {
        subtotalBruto: totales.subtotalBruto,
        totalDescuentos: totales.totalDescuentos,
        subtotalNeto: totales.subtotalNeto,
        totalImpuestos: totales.totalImpuestos,
        totalDocumento: totales.totalDocumento,
      },
    };
  }, [maestro, paciente, vendedor, detalle, pagos, totales]);

  return {
    maestro,
    setMaestro,
    updateMaestro,
    paciente,
    setPaciente,
    vendedor,
    setVendedor,
    cuentaPaciente,
    setCuentaPaciente,
    cuentasPacienteDisponibles,
    setCondicionVenta,
    setPlazoDias,
    tipoCambioSugerido,
    detalle,
    setDetalle,
    addLinea,
    updateLinea,
    removeLinea,
    aplicarProductoALinea,
    pagos,
    setPagos,
    addPago,
    updatePago,
    removePago,
    aplicarFormaPago,
    totales,
    totalPagos,
    diferenciaPagoVsTotal,
    resetFactura,
    construirPayloadBorrador,
    catalogos: {
      pacientes,
      vendedores,
      productos,
      formasPago,
      monedasSucursal,
      cajas,
      cierresCaja,
      pacienteCuentas,
    },
  };
}

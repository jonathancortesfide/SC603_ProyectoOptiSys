import React, { useState, useEffect } from 'react';
import {
    Box, Button, Alert, CircularProgress, TextField, DialogTitle,
    DialogContent, DialogActions, FormControlLabel, Checkbox, Grid,
} from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { alpha } from '@mui/material/styles';
import { agregarProveedor, actualizarProveedor, noProveedorDe } from '../../../requests/mantenimientos/proveedor/RequestsProveedores';
import { construirProveedorDto, fechaIsoDesdeLocal } from '../../../requests/mantenimientos/proveedor/proveedorDto';
import { obtenerPaises, normalizarListaPaises, noPaisDe, nombrePaisDe } from '../../../requests/mantenimientos/pais/RequestsPaises';
import {
    obtenerMonedasPorGetIdentificador,
    normalizarListaMonedas,
    filtrarMonedasActivas,
    numeroMonedaCatalogoDe,
    idMonedaDe,
    labelMonedaDe,
    signoMonedaDe,
    descripcionMonedaDe,
} from '../../../requests/mantenimientos/moneda/RequestsMonedas';
import { getSucursalIdentificador } from '../../../utils/sucursal';

const filterPaises = createFilterOptions({
    stringify: (option) => `${nombrePaisDe(option)} ${noPaisDe(option) ?? ''}`,
});

const filterMonedas = createFilterOptions({
    stringify: (option) => `${labelMonedaDe(option)} ${numeroMonedaCatalogoDe(option) ?? ''} ${signoMonedaDe(option)} ${descripcionMonedaDe(option)}`,
});

// TODO: obtener del usuario loggeado (fallback en utils/sucursal)
const USUARIO = 'jonathan';

const respuestaOk = (res) => res && (res.esCorrecto === true || res.EsCorrecto === true);

const strFrom = (p, camel, pascal) => {
    const v = p?.[camel] ?? p?.[pascal];
    return v !== undefined && v !== null ? String(v) : '';
};

const numStrFrom = (p, camel, pascal) => {
    const v = p?.[camel] ?? p?.[pascal];
    if (v === undefined || v === null || Number.isNaN(v)) return '';
    return String(v);
};

const boolFrom = (p, camel, pascal) => !!(p?.[camel] ?? p?.[pascal]);

const fechaLocalInicial = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
};

/**
 * Props:
 *   proveedor     object|null — registro en edición o null para alta
 *   modoEdicion   boolean
 *   onGuardar     () => void
 *   onCancel      () => void
 */
const FormularioProveedor = ({ proveedor, modoEdicion, onGuardar, onCancel }) => {
    const [cedula, setCedula] = useState('');
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [notas, setNotas] = useState('');
    const [fechaRegistro, setFechaRegistro] = useState(fechaLocalInicial);
    const [plazo, setPlazo] = useState('');
    const [email, setEmail] = useState('');
    const [paises, setPaises] = useState([]);
    const [cargandoPaises, setCargandoPaises] = useState(true);
    const [errorPaises, setErrorPaises] = useState(null);
    const [paisSeleccionado, setPaisSeleccionado] = useState(null);
    const [esActivo, setEsActivo] = useState(true);
    const [limiteCredito, setLimiteCredito] = useState('');
    const [monedas, setMonedas] = useState([]);
    const [cargandoMonedas, setCargandoMonedas] = useState(true);
    const [errorMonedas, setErrorMonedas] = useState(null);
    const [monedaSeleccionada, setMonedaSeleccionada] = useState(null);
    const [saldo, setSaldo] = useState('');
    const [telefono1, setTelefono1] = useState('');
    const [telefono2, setTelefono2] = useState('');
    const [esLaboratorio, setEsLaboratorio] = useState(false);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelado = false;
        (async () => {
            setCargandoPaises(true);
            setErrorPaises(null);
            const resp = await obtenerPaises('');
            const lista = normalizarListaPaises(resp);
            if (cancelado) return;
            if (resp && (resp.esCorrecto === false || resp.EsCorrecto === false)) {
                setErrorPaises(resp.mensaje ?? resp.Mensaje ?? 'No se pudieron cargar los países');
            }
            setPaises(lista);
            setCargandoPaises(false);
        })();
        return () => { cancelado = true; };
    }, []);

    useEffect(() => {
        let cancelado = false;
        (async () => {
            setCargandoMonedas(true);
            setErrorMonedas(null);
            const identificador = getSucursalIdentificador();
            const resp = await obtenerMonedasPorGetIdentificador(identificador);
            if (cancelado) return;
            if (resp && (resp.esCorrecto === false || resp.EsCorrecto === false)) {
                setErrorMonedas(resp.mensaje ?? resp.Mensaje ?? 'No se pudieron cargar las monedas');
            }
            const lista = filtrarMonedasActivas(normalizarListaMonedas(resp));
            setMonedas(lista);
            setCargandoMonedas(false);
        })();
        return () => { cancelado = true; };
    }, []);

    useEffect(() => {
        if (modoEdicion && proveedor) {
            setCedula(strFrom(proveedor, 'cedula', 'Cedula'));
            setNombre(strFrom(proveedor, 'nombre', 'Nombre'));
            setDireccion(strFrom(proveedor, 'direccion', 'Direccion'));
            setNotas(strFrom(proveedor, 'notas', 'Notas'));
            setPlazo(numStrFrom(proveedor, 'plazo', 'Plazo'));
            setEmail(strFrom(proveedor, 'email', 'Email'));
            setLimiteCredito(numStrFrom(proveedor, 'limiteCredito', 'LimiteCredito'));
            setSaldo(numStrFrom(proveedor, 'saldo', 'Saldo'));
            setTelefono1(strFrom(proveedor, 'telefono1', 'Telefono1'));
            setTelefono2(strFrom(proveedor, 'telefono2', 'Telefono2'));
            setEsLaboratorio(boolFrom(proveedor, 'esLaboratorio', 'EsLaboratorio'));
            setEsActivo(boolFrom(proveedor, 'esActivo', 'EsActivo'));
            const fr = proveedor.fechaRegistro ?? proveedor.FechaRegistro;
            if (fr) {
                const d = new Date(fr);
                if (!Number.isNaN(d.getTime())) {
                    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                    setFechaRegistro(d.toISOString().slice(0, 16));
                }
            } else {
                setFechaRegistro(fechaLocalInicial());
            }
        } else {
            setCedula('');
            setNombre('');
            setDireccion('');
            setNotas('');
            setFechaRegistro(fechaLocalInicial());
            setPlazo('');
            setEmail('');
            setPaisSeleccionado(null);
            setEsActivo(true);
            setLimiteCredito('');
            setMonedaSeleccionada(null);
            setSaldo('');
            setTelefono1('');
            setTelefono2('');
            setEsLaboratorio(false);
        }
        setError(null);
    }, [proveedor, modoEdicion]);

    useEffect(() => {
        if (!paises.length) return;
        if (modoEdicion && proveedor) {
            const nid = proveedor.noNacionalidad ?? proveedor.NoNacionalidad;
            const n = Number.parseInt(String(nid ?? ''), 10);
            if (Number.isFinite(n)) {
                const found = paises.find((p) => Number(noPaisDe(p)) === n);
                setPaisSeleccionado(found ?? null);
            } else {
                setPaisSeleccionado(null);
            }
        } else if (!modoEdicion) {
            setPaisSeleccionado(null);
        }
    }, [proveedor, modoEdicion, paises]);

    useEffect(() => {
        if (!monedas.length) return;
        if (modoEdicion && proveedor) {
            const nm = proveedor.noMoneda ?? proveedor.NoMoneda;
            const n = Number.parseInt(String(nm ?? ''), 10);
            if (Number.isFinite(n)) {
                let found = monedas.find((m) => Number(idMonedaDe(m)) === n);
                if (!found) {
                    found = monedas.find((m) => Number(numeroMonedaCatalogoDe(m)) === n);
                }
                setMonedaSeleccionada(found ?? null);
            } else {
                setMonedaSeleccionada(null);
            }
        }
    }, [proveedor, modoEdicion, monedas]);

    const parseIntSafe = (s, label) => {
        const t = String(s).trim();
        if (!t) return { ok: false, error: `${label} es requerido` };
        const n = Number.parseInt(t, 10);
        if (!Number.isFinite(n)) return { ok: false, error: `${label} debe ser un número entero` };
        return { ok: true, value: n };
    };

    const parseFloatSafe = (s, defaultZero = true) => {
        const t = String(s).trim();
        if (!t) return defaultZero ? 0 : null;
        const n = Number.parseFloat(t.replace(',', '.'));
        return Number.isFinite(n) ? n : (defaultZero ? 0 : null);
    };

    const handleSubmit = async () => {
        setError(null);
        const n = nombre.trim();
        const c = cedula.trim();
        if (!c) {
            setError('Indique la cédula');
            return;
        }
        if (!n) {
            setError('Indique el nombre');
            return;
        }

        if (!paisSeleccionado) {
            setError('Seleccione la nacionalidad (país)');
            return;
        }
        const noNat = Number.parseInt(String(noPaisDe(paisSeleccionado)), 10);
        if (!Number.isFinite(noNat)) {
            setError('Nacionalidad no válida');
            return;
        }
        const pl = parseIntSafe(plazo, 'Plazo');
        if (!pl.ok) {
            setError(pl.error);
            return;
        }
        if (!monedaSeleccionada) {
            setError('Seleccione la moneda');
            return;
        }
        const noMonedaVal = Number.parseInt(String(idMonedaDe(monedaSeleccionada)), 10);
        if (!Number.isFinite(noMonedaVal) || noMonedaVal <= 0) {
            setError('Moneda no válida (falta idMoneda en el catálogo)');
            return;
        }

        setLoading(true);

        const identificador = getSucursalIdentificador();
        const fechaRegistroIso = fechaIsoDesdeLocal(fechaRegistro);
        const noProv = modoEdicion && proveedor ? noProveedorDe(proveedor) : 0;

        const dto = construirProveedorDto({
            noProveedor: noProv,
            identificador,
            nombre: n,
            cedula: c,
            direccion: direccion.trim(),
            notas: notas.trim(),
            fechaRegistroIso,
            plazo: pl.value,
            email: email.trim(),
            noNacionalidad: noNat,
            esActivo,
            limiteCredito: parseFloatSafe(limiteCredito, true),
            noMoneda: noMonedaVal,
            saldo: parseFloatSafe(saldo, true),
            telefono1: telefono1.trim(),
            telefono2: telefono2.trim(),
            esLaboratorio,
            usuario: USUARIO,
        });

        const res = modoEdicion && proveedor
            ? await actualizarProveedor(dto)
            : await agregarProveedor(dto);

        if (respuestaOk(res)) {
            onGuardar();
        } else {
            setError(res?.mensaje ?? res?.Mensaje ?? 'No se pudo guardar el proveedor');
        }
        setLoading(false);
    };

    return (
        <>
            <DialogTitle>{modoEdicion ? 'Editar proveedor' : 'Agregar proveedor'}</DialogTitle>
            <DialogContent sx={{ maxHeight: '78vh', overflowY: 'auto' }}>
                {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
                {errorPaises && <Alert severity="warning" sx={{ mb: 2, mt: 1 }}>{errorPaises}</Alert>}
                {errorMonedas && <Alert severity="warning" sx={{ mb: 2, mt: 1 }}>{errorMonedas}</Alert>}
                <Box sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Cédula"
                                value={cedula}
                                onChange={(e) => setCedula(e.target.value)}
                                fullWidth
                                required
                                autoFocus={!modoEdicion}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Dirección"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                fullWidth
                                multiline
                                minRows={2}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Notas"
                                value={notas}
                                onChange={(e) => setNotas(e.target.value)}
                                fullWidth
                                multiline
                                minRows={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Fecha registro"
                                type="datetime-local"
                                value={fechaRegistro}
                                onChange={(e) => setFechaRegistro(e.target.value)}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Plazo"
                                type="number"
                                value={plazo}
                                onChange={(e) => setPlazo(e.target.value)}
                                fullWidth
                                required
                                inputProps={{ step: 1 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Correo electrónico"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                options={paises}
                                loading={cargandoPaises}
                                value={paisSeleccionado}
                                onChange={(e, newValue) => setPaisSeleccionado(newValue)}
                                getOptionLabel={(opt) => (opt ? nombrePaisDe(opt) : '')}
                                isOptionEqualToValue={(a, b) => noPaisDe(a) === noPaisDe(b)}
                                filterOptions={filterPaises}
                                noOptionsText="Sin coincidencias"
                                loadingText="Cargando países…"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Nacionalidad (país)"
                                        required
                                        placeholder="Buscar por nombre o código…"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {cargandoPaises ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                options={monedas}
                                loading={cargandoMonedas}
                                value={monedaSeleccionada}
                                onChange={(e, newValue) => setMonedaSeleccionada(newValue)}
                                getOptionLabel={(opt) => (opt ? labelMonedaDe(opt) : '')}
                                isOptionEqualToValue={(a, b) => Number(idMonedaDe(a)) === Number(idMonedaDe(b))}
                                filterOptions={filterMonedas}
                                noOptionsText="Sin coincidencias"
                                loadingText="Cargando monedas…"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Moneda"
                                        required
                                        placeholder="Buscar moneda…"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {cargandoMonedas ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Límite crédito"
                                type="number"
                                value={limiteCredito}
                                onChange={(e) => setLimiteCredito(e.target.value)}
                                fullWidth
                                inputProps={{ step: 'any' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Saldo"
                                type="number"
                                value={saldo}
                                onChange={(e) => setSaldo(e.target.value)}
                                fullWidth
                                inputProps={{ step: 'any' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Teléfono 1"
                                value={telefono1}
                                onChange={(e) => setTelefono1(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Teléfono 2"
                                value={telefono2}
                                onChange={(e) => setTelefono2(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={(
                                    <Checkbox
                                        checked={esLaboratorio}
                                        onChange={(e) => setEsLaboratorio(e.target.checked)}
                                    />
                                )}
                                label="Es laboratorio"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={(
                                    <Checkbox
                                        checked={esActivo}
                                        onChange={(e) => setEsActivo(e.target.checked)}
                                    />
                                )}
                                label="Activo"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={loading}
                    sx={(theme) => ({
                        '&:hover': {
                            borderColor: theme.palette.error.main,
                            color: theme.palette.error.main,
                            backgroundColor: alpha(theme.palette.error.main, 0.06),
                        },
                    })}
                >
                    Cancelar
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={20} color="inherit" /> : (modoEdicion ? 'Guardar' : 'Agregar')}
                </Button>
            </DialogActions>
        </>
    );
};

export default FormularioProveedor;

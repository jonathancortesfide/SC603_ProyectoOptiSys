import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    cambiarEstadoEnfermedad,
    agregarEnfermedadConCatalogo,
    obtenerCatalogoEnfermedades,
    obtenerEnfermedadesPorIdentificador,
    obtenerTiposEnfermedades,
} from '../../../requests/mantenimientos/enfermedad/RequestsEnfermedades';
import { getCurrentUsername } from '../../../utils/session';
import { getSucursalIdentificador } from '../../../utils/sucursal';

const FormularioEnfermedad = ({ onGuardar, onCancel }) => {
    const [catalogo, setCatalogo] = useState([]);
    const [tiposDisponibles, setTiposDisponibles] = useState([]);
    const [loadingCatalogo, setLoadingCatalogo] = useState(true);
    const [enfermedadSeleccionada, setEnfermedadSeleccionada] = useState(null);
    const [textoEnfermedad, setTextoEnfermedad] = useState('');
    const [descripcionNueva, setDescripcionNueva] = useState('');
    const [noTipo, setNoTipo] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const cargar = async () => {
            setLoadingCatalogo(true);

            const identificador = getSucursalIdentificador();
            const [catalogoResponse, tiposResponse, respSucursal] = await Promise.all([
                obtenerCatalogoEnfermedades(),
                obtenerTiposEnfermedades(),
                obtenerEnfermedadesPorIdentificador(identificador),
            ]);

            const todas = catalogoResponse ?? [];
            const asignadas = respSucursal?.datos ?? [];

            const asignadasPorId = new Map(asignadas.map((item) => [item.idEnfermedad, item]));

            const opciones = todas
                .map((item) => {
                    const asignada = asignadasPorId.get(item.idEnfermedad);

                    if (asignada?.activo) return null;

                    return {
                        idEnfermedad: item.idEnfermedad,
                        descripcion: item.descripcion,
                        noTipo: item.noTipo,
                        tipoEnfermedad: item.tipoNombre,
                        numeroEnfermedad: asignada?.numeroEnfermedad ?? null,
                        esReactivacion: Boolean(asignada && asignada.activo === false),
                    };
                })
                .filter(Boolean)
                .sort((a, b) => a.descripcion.localeCompare(b.descripcion));

            setCatalogo(opciones);
            setTiposDisponibles(
                (tiposResponse ?? [])
                    .map((item) => ({
                        noTipo: item.numeroTipo,
                        tipoNombre: item.nombre,
                    }))
                    .filter((item) => Number.isFinite(Number(item.noTipo)) && item.tipoNombre)
                    .sort((a, b) => a.tipoNombre.localeCompare(b.tipoNombre))
            );
            setLoadingCatalogo(false);
        };

        cargar();
    }, []);

    const enfermedadCoincidente = useMemo(() => {
        const termino = textoEnfermedad.trim().toLowerCase();
        if (!termino) return null;

        return catalogo.find((item) => item.descripcion.trim().toLowerCase() === termino) ?? null;
    }, [catalogo, textoEnfermedad]);

    const enfermedadActual = enfermedadSeleccionada ?? enfermedadCoincidente;

    const esNuevaEnfermedad = Boolean(textoEnfermedad.trim()) && !enfermedadActual;

    const handleSubmit = async () => {
        const identificador = getSucursalIdentificador();
        const usuario = getCurrentUsername();
        const parsedNoTipo = Number.parseInt(String(noTipo).trim(), 10);
        const descripcionNormalizada = textoEnfermedad.trim();

        setError(null);

        if (!descripcionNormalizada) {
            setError('Seleccione o escriba una enfermedad');
            return;
        }

        if (esNuevaEnfermedad) {
            if (!Number.isFinite(parsedNoTipo) || parsedNoTipo <= 0) {
                setError('Seleccione un tipo de enfermedad');
                return;
            }
        }

        setLoading(true);

        const res = enfermedadActual?.esReactivacion && enfermedadActual?.numeroEnfermedad
            ? await cambiarEstadoEnfermedad(enfermedadActual.numeroEnfermedad, true, usuario)
            : await agregarEnfermedadConCatalogo({
                idEnfermedad: enfermedadActual?.idEnfermedad ?? null,
                descripcion: enfermedadActual ? '' : descripcionNormalizada,
                noTipo: enfermedadActual ? null : parsedNoTipo,
                identificador,
                usuario,
            });

        if (res?.esCorrecto) {
            onGuardar({
                message: enfermedadActual?.esReactivacion
                    ? 'Enfermedad reactivada correctamente'
                    : 'Enfermedad agregada correctamente',
                severity: 'success',
            });
        } else {
            setError(res?.mensaje || 'No se pudo guardar la enfermedad');
        }

        setLoading(false);
    };

    return (
        <>
            <DialogTitle>Agregar enfermedad a sucursal</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}

                <Stack spacing={2} sx={{ mt: 1 }}>
                    {loadingCatalogo ? (
                        <Box display="flex" justifyContent="center" p={2}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : (
                        <>
                            <Autocomplete
                                freeSolo
                                fullWidth
                                options={catalogo}
                                value={enfermedadSeleccionada}
                                inputValue={textoEnfermedad}
                                onChange={(_, value) => {
                                    if (typeof value === 'string') {
                                        setEnfermedadSeleccionada(null);
                                        setTextoEnfermedad(value);
                                        setDescripcionNueva(value);
                                        setNoTipo('');
                                    } else {
                                        setEnfermedadSeleccionada(value);
                                        setTextoEnfermedad(value?.descripcion ?? '');
                                        setDescripcionNueva(value?.descripcion ?? '');
                                        setNoTipo(value?.noTipo ? String(value.noTipo) : '');
                                    }
                                    setError(null);
                                }}
                                onInputChange={(_, value, reason) => {
                                    if (reason === 'reset') return;

                                    setTextoEnfermedad(value);
                                    setDescripcionNueva(value);

                                    const exacta = catalogo.find(
                                        (item) => item.descripcion.trim().toLowerCase() === String(value).trim().toLowerCase()
                                    ) ?? null;

                                    setEnfermedadSeleccionada(exacta);
                                    setNoTipo(exacta?.noTipo ? String(exacta.noTipo) : '');
                                }}
                                getOptionLabel={(option) => (typeof option === 'string' ? option : option.descripcion ?? '')}
                                isOptionEqualToValue={(option, value) => option.idEnfermedad === value.idEnfermedad}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props} key={option.idEnfermedad}>
                                        {option.descripcion} — {option.tipoEnfermedad}{option.esReactivacion ? ' (Inactiva)' : ''}
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Enfermedad"
                                        helperText="Busque en el catálogo. Si no existe, escríbala y podrá agregarla al catálogo y a la sucursal de una vez."
                                    />
                                )}
                            />

                            {enfermedadActual && (
                                <Alert severity={enfermedadActual.esReactivacion ? 'warning' : 'info'}>
                                    <Typography variant="body2">
                                        <strong>{enfermedadActual.descripcion}</strong>
                                        {' '}
                                        — {enfermedadActual.tipoEnfermedad}
                                        {enfermedadActual.esReactivacion ? ' (se reactivará al guardar)' : ' (se asignará desde el catálogo)'}
                                    </Typography>
                                </Alert>
                            )}

                            {esNuevaEnfermedad && (
                                <Alert severity="info">
                                    <Typography variant="body2">
                                        "{textoEnfermedad.trim()}" no existe en el catálogo. Se creará y se asignará a la sucursal.
                                    </Typography>
                                </Alert>
                            )}

                            {esNuevaEnfermedad && (
                                <TextField
                                    select
                                    fullWidth
                                    label="Tipo de enfermedad"
                                    value={noTipo}
                                    onChange={(e) => setNoTipo(e.target.value)}
                                    helperText={tiposDisponibles.length > 0
                                        ? 'Seleccione el tipo para crear la nueva enfermedad.'
                                        : 'No hay tipos disponibles para seleccionar.'}
                                >
                                    {tiposDisponibles.length === 0 ? (
                                        <MenuItem value="" disabled>
                                            Sin tipos disponibles
                                        </MenuItem>
                                    ) : tiposDisponibles.map((tipo) => (
                                        <MenuItem key={tipo.noTipo} value={tipo.noTipo}>
                                            {tipo.tipoNombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        </>
                    )}
                </Stack>
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading || loadingCatalogo || (esNuevaEnfermedad && tiposDisponibles.length === 0)}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Agregar'}
                </Button>
            </DialogActions>
        </>
    );
};

export default FormularioEnfermedad;
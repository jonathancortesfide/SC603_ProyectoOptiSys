import React, { useState, useEffect } from 'react';
import {
    Box, Button, Alert, CircularProgress,
    Select, MenuItem, InputLabel, FormControl, DialogTitle,
    DialogContent, DialogActions,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { obtenerListaDeMonedas, obtenerMonedasPorIdentificador, crearMoneda, cambiarEstadoMoneda } from '../../../requests/mantenimientos/moneda/RequestsMonedas';
import { getSucursalIdentificador } from '../../../utils/sucursal';

// TODO: obtener del usuario loggeado (fallback en utils/sucursal)
const USUARIO = 'jonathan';

/**
 * Formulario para asociar una moneda existente a la sucursal.
 * Muestra solo las monedas que todavía no han sido asignadas.
 *
 * Props:
 *   onGuardar  () => void   — callback tras guardar con éxito
 *   onCancel   () => void   — callback para cerrar sin guardar
 */
const FormularioMoneda = ({ onGuardar, onCancel }) => {
    const [monedasDisponibles, setMonedasDisponibles] = useState([]);
    const [loadingMonedas, setLoadingMonedas] = useState(true);
    const [todoAsignado, setTodoAsignado] = useState(false);

    const [numeroDeMoneda, setNumeroDeMoneda] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const cargar = async () => {
            setLoadingMonedas(true);
            const [respTodas, respAsignadas] = await Promise.all([
                obtenerListaDeMonedas(),
                obtenerMonedasPorIdentificador(getSucursalIdentificador()),
            ]);

            const todas = respTodas?.laListaDeMonedas ?? [];
            const asignadas = respAsignadas?.laListaDeMonedas ?? [];
            const asignadasIds = new Set(asignadas.map((m) => m.numeroDeMoneda));

            // Monedas nunca asignadas a la sucursal
            const noAsignadas = todas
                .filter((m) => !asignadasIds.has(m.numeroDeMoneda))
                .map((m) => ({
                    ...m,
                    relacionIdMoneda: null,
                    esReactivacion: false,
                }));

            // Monedas ya asignadas pero inactivas (deben reactivarse desde "Agregar")
            const catalogoPorNumero = new Map(todas.map((m) => [m.numeroDeMoneda, m]));
            const asignadasInactivas = asignadas
                .filter((m) => m.activo === false)
                .map((m) => {
                    const delCatalogo = catalogoPorNumero.get(m.numeroDeMoneda);
                    return {
                        ...(delCatalogo ?? m),
                        numeroDeMoneda: m.numeroDeMoneda,
                        // idMoneda es la PK de la relación MonedaSucursal
                        relacionIdMoneda: m.idMoneda,
                        esReactivacion: true,
                    };
                });

            const disponibles = [...asignadasInactivas, ...noAsignadas];

            setMonedasDisponibles(disponibles);
            setTodoAsignado(disponibles.length === 0);
            setLoadingMonedas(false);
        };
        cargar();
    }, []);

    const handleSubmit = async () => {
        setError(null);
        if (!numeroDeMoneda) { setError('Seleccione una moneda'); return; }

        const seleccion = monedasDisponibles.find(
            (m) => String(m.numeroDeMoneda) === String(numeroDeMoneda)
        );

        setLoading(true);

        const res = seleccion?.relacionIdMoneda
            ? await cambiarEstadoMoneda(seleccion.relacionIdMoneda, true, USUARIO)
            : await crearMoneda({
                numeroDeMoneda: Number(numeroDeMoneda),
                identificador: getSucursalIdentificador(),
                usuario: USUARIO,
            });

        if (res && res.esCorrecto) {
            onGuardar();
        } else {
            setError(res?.mensaje || 'No se pudo guardar la moneda');
        }
        setLoading(false);
    };

    return (
        <>
            <DialogTitle>Agregar moneda a sucursal</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
                <Box sx={{ mt: 1 }}>
                    {loadingMonedas ? (
                        <Box display="flex" justifyContent="center" p={2}><CircularProgress size={24} /></Box>
                    ) : todoAsignado ? (
                        <Alert severity="info">
                            Todas las monedas disponibles ya están asignadas a esta sucursal.
                        </Alert>
                    ) : (
                        <FormControl fullWidth>
                            <InputLabel id="moneda-label">Moneda</InputLabel>
                            <Select
                                labelId="moneda-label"
                                value={numeroDeMoneda}
                                label="Moneda"
                                onChange={(e) => setNumeroDeMoneda(e.target.value)}
                            >
                                {monedasDisponibles.map((m) => (
                                    <MenuItem key={m.numeroDeMoneda} value={m.numeroDeMoneda}>
                                        {m.signo} — {m.descripcion}{m.esReactivacion ? ' (Inactiva)' : ''}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
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
                {!todoAsignado && !loadingMonedas && (
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? <CircularProgress size={20} color="inherit" /> : 'Agregar'}
                    </Button>
                )}
            </DialogActions>
        </>
    );
};

export default FormularioMoneda;



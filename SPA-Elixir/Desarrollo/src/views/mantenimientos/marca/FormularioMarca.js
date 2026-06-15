import { useState, useEffect } from 'react';
import {
    Button, Stack, TextField, Alert, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Box,
} from '@mui/material';
import { agregarMarca, modificarMarca, obtenerMarcaPorNoMarca, noMarcaDe } from '../../../requests/mantenimientos/marca/RequestsMarcas';
import { construirMarcaDto } from '../../../requests/mantenimientos/marca/marcaDto';
import { getNoEmpresa } from '../../../utils/empresa';
import { getSucursalIdentificador } from '../../../utils/sucursal';

const USUARIO = 'jonathan';

const respuestaOk = (res) => res && (res.esCorrecto === true || res.EsCorrecto === true);

const boolFromMarca = (m) => {
    if (!m) return true;
    if (m.esActivo !== undefined) return !!m.esActivo;
    if (m.EsActivo !== undefined) return !!m.EsActivo;
    if (m.activo !== undefined) return !!m.activo;
    if (m.Activo !== undefined) return !!m.Activo;
    return true;
};

const FormularioMarca = ({ marca, modoEdicion, onGuardar, onCancel }) => {
    const [descripcion, setDescripcion] = useState('');
    const [esActivo, setEsActivo] = useState(true);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!(modoEdicion && marca)) {
                if (!cancelled) {
                    setDescripcion('');
                    setEsActivo(true);
                }
                return;
            }
            const desc = marca.descripcion ?? marca.Descripcion;
            const act = boolFromMarca(marca);
            if (desc != null && String(desc).length > 0) {
                if (!cancelled) {
                    setDescripcion(String(desc));
                    setEsActivo(act);
                }
                return;
            }
            const noEmpresa = getNoEmpresa();
            const nm = noMarcaDe(marca);
            const data = await obtenerMarcaPorNoMarca(noEmpresa, nm);
            if (cancelled) return;
            if (data) {
                setDescripcion(String(data.descripcion ?? data.Descripcion ?? ''));
                setEsActivo(boolFromMarca(data));
            }
        })();
        return () => { cancelled = true; };
    }, [marca, modoEdicion]);

    const handleSubmit = async () => {
        setError(null);
        const noEmpresa = getNoEmpresa();
        const identificador = getSucursalIdentificador();
        const noMarca = modoEdicion && marca ? Number.parseInt(String(noMarcaDe(marca)), 10) || 0 : 0;

        const dto = construirMarcaDto({
            noMarca,
            noEmpresa,
            identificador,
            descripcion,
            // En creación, el API requiere que la marca se cree activa.
            esActivo: modoEdicion ? esActivo : true,
            usuario: USUARIO,
        });

        setLoading(true);
        try {
            const res = modoEdicion && marca
                ? await modificarMarca(dto)
                : await agregarMarca(dto);
            if (respuestaOk(res)) {
                onGuardar();
            } else {
                setError(res?.Mensaje ?? res?.mensaje ?? 'Error en la operación');
            }
        } catch (_err) {
            setError('Error al guardar la marca');
        }
        setLoading(false);
    };

    return (
        <>
            <DialogTitle sx={{ pb: 0 }}>{modoEdicion ? 'Editar Marca' : 'Crear Marca'}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Stack spacing={2}>
                        <TextField name="descripcion" label="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} fullWidth />
                        {modoEdicion && (
                            <FormControlLabel
                                control={(
                                    <Checkbox
                                        checked={esActivo}
                                        onChange={(e) => setEsActivo(e.target.checked)}
                                    />
                                )}
                                label="Activo"
                            />
                        )}
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button variant="outlined" color="secondary" onClick={onCancel} disabled={loading}>Cancelar</Button>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>{modoEdicion ? 'Actualizar' : 'Crear'}</Button>
            </DialogActions>
        </>
    );
};

export default FormularioMarca;

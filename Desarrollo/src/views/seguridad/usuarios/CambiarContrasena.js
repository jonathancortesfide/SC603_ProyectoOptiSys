import React, { useState } from 'react';
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Stack,
    Alert,
    CircularProgress,
} from '@mui/material';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { cambiarContrasena } from '../../../requests/usuarios/RequestsUsuarios';

const CambiarContrasena = ({ usuario, onCancel, onSuccess }) => {
    const [contrasenaActual, setContrasenaActual] = useState('');
    const [contrasenaNueva, setContrasenaNueva] = useState('');
    const [contrasenaConfirm, setContrasenaConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const validarFormulario = () => {
        if (!contrasenaActual) {
            setError('La contraseña actual es requerida');
            return false;
        }
        if (!contrasenaNueva) {
            setError('La contraseña nueva es requerida');
            return false;
        }
        if (contrasenaNueva !== contrasenaConfirm) {
            setError('Las contraseñas nuevas no coinciden');
            return false;
        }
        if (contrasenaNueva.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return false;
        }
        return true;
    };

    const handleGuardar = async () => {
        setError(null);
        if (!validarFormulario()) {
            return;
        }

        setLoading(true);
        try {
            const resultado = await cambiarContrasena(
                usuario.id,
                contrasenaActual,
                contrasenaNueva
            );

            if (resultado.EsCorrecto) {
                onSuccess();
            } else {
                setError(resultado.Mensaje || 'Error al cambiar la contraseña');
            }
        } catch (err) {
            setError('Error al procesar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            <DialogContent sx={{ pt: 2, minWidth: '400px' }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Stack spacing={2}>
                    <Box>
                        <CustomFormLabel htmlFor="usuario">Usuario</CustomFormLabel>
                        <CustomTextField
                            id="usuario"
                            value={usuario?.nombre || usuario?.login || ''}
                            fullWidth
                            disabled
                        />
                    </Box>

                    <Box>
                        <CustomFormLabel htmlFor="contrasenaActual">Contraseña Actual *</CustomFormLabel>
                        <CustomTextField
                            id="contrasenaActual"
                            type="password"
                            value={contrasenaActual}
                            onChange={(e) => setContrasenaActual(e.target.value)}
                            placeholder="Ingrese la contraseña actual"
                            fullWidth
                        />
                    </Box>

                    <Box>
                        <CustomFormLabel htmlFor="contrasenaNueva">Contraseña Nueva *</CustomFormLabel>
                        <CustomTextField
                            id="contrasenaNueva"
                            type="password"
                            value={contrasenaNueva}
                            onChange={(e) => setContrasenaNueva(e.target.value)}
                            placeholder="Ingrese la contraseña nueva"
                            fullWidth
                        />
                    </Box>

                    <Box>
                        <CustomFormLabel htmlFor="contrasenaConfirm">Confirmar Contraseña Nueva *</CustomFormLabel>
                        <CustomTextField
                            id="contrasenaConfirm"
                            type="password"
                            value={contrasenaConfirm}
                            onChange={(e) => setContrasenaConfirm(e.target.value)}
                            placeholder="Confirme la contraseña nueva"
                            fullWidth
                        />
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onCancel} disabled={loading}>Cancelar</Button>
                <Button
                    onClick={handleGuardar}
                    variant="contained"
                    color="success"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Cambiar Contraseña'}
                </Button>
            </DialogActions>
        </>
    );
};

export default CambiarContrasena;

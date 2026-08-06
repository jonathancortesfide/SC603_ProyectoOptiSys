import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Stack,
    Alert,
    CircularProgress,
    Paper,
    Typography,
} from '@mui/material';
import { IconLock, IconCircleCheck } from '@tabler/icons';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import { activarCuenta } from '../../requests/usuarios/RequestsUsuarios';

const ActivarCuenta = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get('email') || '';

    const [password, setPassword] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [exito, setExito] = useState(false);

    useEffect(() => {
        if (!email) setError('Enlace inválido. Pedí al administrador que genere uno nuevo.');
    }, [email]);

    const validar = () => {
        if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return false; }
        if (password !== confirmar) { setError('Las contraseñas no coinciden.'); return false; }
        return true;
    };

    const handleActivar = async () => {
        setError(null);
        if (!validar()) return;
        setLoading(true);
        try {
            const resultado = await activarCuenta(email, password);
            if (resultado.esCorrecto) {
                setExito(true);
            } else {
                setError(resultado.mensaje || 'No se pudo activar la cuenta.');
            }
        } catch {
            setError('Error al procesar la solicitud.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
                p: 2,
            }}
        >
            <Paper elevation={8} sx={{ maxWidth: 420, width: '100%', borderRadius: 3, overflow: 'hidden' }}>
                {/* Header */}
                <Box sx={{ background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)', p: 3, textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={700} color="white">Elixir</Typography>
                    <Typography variant="caption" sx={{ color: '#b3d1ff', letterSpacing: 1, textTransform: 'uppercase' }}>
                        Sistema de Gestión Óptica
                    </Typography>
                </Box>

                <Box sx={{ p: 4 }}>
                    {exito ? (
                        <Stack spacing={2} alignItems="center">
                            <IconCircleCheck size={56} color="#2e7d32" />
                            <Typography variant="h6" fontWeight={600} textAlign="center">
                                ¡Cuenta activada!
                            </Typography>
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                Tu contraseña fue configurada correctamente. Ya podés ingresar al sistema.
                            </Typography>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() => navigate('/auth/login')}
                                sx={{ mt: 1, background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)' }}
                            >
                                Ir al inicio de sesión
                            </Button>
                        </Stack>
                    ) : (
                        <Stack spacing={2}>
                            <Box textAlign="center" mb={1}>
                                <IconLock size={40} color="#1a73e8" />
                                <Typography variant="h6" fontWeight={600} mt={1}>
                                    Activá tu cuenta
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Definí una contraseña para <strong>{email}</strong>
                                </Typography>
                            </Box>

                            {error && <Alert severity="error">{error}</Alert>}

                            <Box>
                                <CustomFormLabel htmlFor="password">Contraseña *</CustomFormLabel>
                                <CustomTextField
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mínimo 8 caracteres"
                                    fullWidth
                                    disabled={!email}
                                />
                            </Box>

                            <Box>
                                <CustomFormLabel htmlFor="confirmar">Confirmá la contraseña *</CustomFormLabel>
                                <CustomTextField
                                    id="confirmar"
                                    type="password"
                                    value={confirmar}
                                    onChange={(e) => setConfirmar(e.target.value)}
                                    placeholder="Repetí la contraseña"
                                    fullWidth
                                    disabled={!email}
                                />
                            </Box>

                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleActivar}
                                disabled={loading || !email}
                                sx={{ mt: 1, py: 1.4, background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)' }}
                            >
                                {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Activar cuenta'}
                            </Button>
                        </Stack>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default ActivarCuenta;

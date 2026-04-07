import React, { useState, useEffect } from 'react';
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Box,
    Stack,
    Alert,
    CircularProgress,
} from '@mui/material';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomCheckbox from '../../../components/forms/theme-elements/CustomCheckbox';
import { crearUsuario, actualizarUsuario } from '../../../requests/usuarios/RequestsUsuarios';

const FormularioUsuario = ({ usuario, modoEdicion, onGuardar, onCancel }) => {
    const [formData, setFormData] = useState({
        login: '',
        email: '',
        contrasena: '',
        nombre: '',
        esDoctor: false,
        codigoProfesional: '',
        telefono: '',
        direccion: '',
        fechaNacimiento: '',
        esActivo: true,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [contrasenaConfirm, setContrasenaConfirm] = useState('');

    useEffect(() => {
        if (modoEdicion && usuario) {
            setFormData({
                ...usuario,
                contrasena: '', // No mostrar contraseña en edición
            });
        }
    }, [usuario, modoEdicion]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const validarFormulario = () => {
        if (!formData.login) {
            setError('El login es requerido');
            return false;
        }
        if (!formData.email) {
            setError('El email es requerido');
            return false;
        }
        if (!formData.nombre) {
            setError('El nombre es requerido');
            return false;
        }
        if (!modoEdicion && !formData.contrasena) {
            setError('La contraseña es requerida');
            return false;
        }
        if (!modoEdicion && formData.contrasena !== contrasenaConfirm) {
            setError('Las contraseñas no coinciden');
            return false;
        }
        if (formData.esDoctor && !formData.codigoProfesional) {
            setError('El código profesional es requerido para doctores');
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
        let resultado;

        try {
            if (modoEdicion) {
                const dataActualizar = { ...formData };
                delete dataActualizar.contrasena;
                resultado = await actualizarUsuario(usuario.id, dataActualizar);
            } else {
                resultado = await crearUsuario(formData);
            }

            if (resultado.EsCorrecto) {
                onGuardar();
            } else {
                setError(resultado.Mensaje || 'Error al guardar el usuario');
            }
        } catch (err) {
            setError('Error al procesar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DialogTitle>
                {modoEdicion ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Stack spacing={2}>
                    <Box>
                        <CustomFormLabel htmlFor="login">Login Usuario *</CustomFormLabel>
                        <CustomTextField
                            id="login"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            placeholder="Ingrese el login"
                            fullWidth
                            disabled={modoEdicion}
                        />
                    </Box>

                    <Box>
                        <CustomFormLabel htmlFor="email">Email *</CustomFormLabel>
                        <CustomTextField
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="usuario@ejemplo.com"
                            fullWidth
                        />
                    </Box>

                    <Box>
                        <CustomFormLabel htmlFor="nombre">Nombre *</CustomFormLabel>
                        <CustomTextField
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ingrese el nombre completo"
                            fullWidth
                        />
                    </Box>

                    {!modoEdicion && (
                        <>
                            <Box>
                                <CustomFormLabel htmlFor="contrasena">Contraseña *</CustomFormLabel>
                                <CustomTextField
                                    id="contrasena"
                                    name="contrasena"
                                    type="password"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    placeholder="Ingrese la contraseña"
                                    fullWidth
                                />
                            </Box>

                            <Box>
                                <CustomFormLabel htmlFor="contrasenaConfirm">Confirmar Contraseña *</CustomFormLabel>
                                <CustomTextField
                                    id="contrasenaConfirm"
                                    type="password"
                                    value={contrasenaConfirm}
                                    onChange={(e) => setContrasenaConfirm(e.target.value)}
                                    placeholder="Confirme la contraseña"
                                    fullWidth
                                />
                            </Box>
                        </>
                    )}

                    <Box>
                        <FormControlLabel
                            control={
                                <CustomCheckbox
                                    name="esDoctor"
                                    checked={formData.esDoctor}
                                    onChange={handleChange}
                                />
                            }
                            label="Es Doctor"
                        />
                    </Box>

                    {formData.esDoctor && (
                        <Box>
                            <CustomFormLabel htmlFor="codigoProfesional">Código Profesional *</CustomFormLabel>
                            <CustomTextField
                                id="codigoProfesional"
                                name="codigoProfesional"
                                value={formData.codigoProfesional}
                                onChange={handleChange}
                                placeholder="Ingrese el código profesional"
                                fullWidth
                            />
                        </Box>
                    )}

                    <Box>
                        <CustomFormLabel htmlFor="telefono">Teléfono</CustomFormLabel>
                        <CustomTextField
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="Ingrese el teléfono"
                            fullWidth
                        />
                    </Box>

                    <Box>
                        <CustomFormLabel htmlFor="direccion">Dirección</CustomFormLabel>
                        <CustomTextField
                            id="direccion"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            placeholder="Ingrese la dirección"
                            fullWidth
                            multiline
                            rows={2}
                        />
                    </Box>

                    <Box>
                        <CustomFormLabel htmlFor="fechaNacimiento">Fecha de Nacimiento</CustomFormLabel>
                        <CustomTextField
                            id="fechaNacimiento"
                            name="fechaNacimiento"
                            type="date"
                            value={formData.fechaNacimiento}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>

                    <Box>
                        <FormControlLabel
                            control={
                                <CustomCheckbox
                                    name="esActivo"
                                    checked={formData.esActivo}
                                    onChange={handleChange}
                                />
                            }
                            label="Es Activo"
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
                    {loading ? <CircularProgress size={24} /> : 'Guardar'}
                </Button>
            </DialogActions>
        </>
    );
};

export default FormularioUsuario;

import React, { useState, useEffect } from 'react';
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControlLabel,
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
        idIdentityServer: '',
        email: '',
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

    useEffect(() => {
        if (modoEdicion && usuario) {
            setFormData({
                idIdentityServer: usuario.idIdentityServer || '',
                email: usuario.email || '',
                nombre: usuario.nombre || '',
                esDoctor: usuario.esDoctor || false,
                codigoProfesional: usuario.codigoProfesional || '',
                telefono: usuario.telefono || '',
                direccion: usuario.direccion || '',
                fechaNacimiento: usuario.fechaNacimiento
                    ? usuario.fechaNacimiento.substring(0, 10)
                    : '',
                esActivo: usuario.esActivo !== undefined ? usuario.esActivo : true,
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
        if (!formData.email) {
            setError('El email es requerido');
            return false;
        }
        if (!formData.nombre) {
            setError('El nombre es requerido');
            return false;
        }
        if (!formData.idIdentityServer) {
            setError('El ID del proveedor de identidad es requerido');
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
                resultado = await actualizarUsuario(usuario.idUsuario, formData);
            } else {
                resultado = await crearUsuario(formData);
            }

            if (resultado.esCorrecto) {
                onGuardar();
            } else {
                setError(resultado.mensaje || 'Error al guardar el usuario');
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
                        <CustomFormLabel htmlFor="idIdentityServer">ID Proveedor de Identidad *</CustomFormLabel>
                        <CustomTextField
                            id="idIdentityServer"
                            name="idIdentityServer"
                            value={formData.idIdentityServer}
                            onChange={handleChange}
                            placeholder="sub / ID del proveedor OIDC"
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

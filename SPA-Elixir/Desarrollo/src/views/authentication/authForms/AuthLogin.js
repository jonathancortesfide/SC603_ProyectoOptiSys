import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Alert,
} from '@mui/material';
import { Form, useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import useAuth from 'src/guards/authGuard/UseAuth';
import useMounted from 'src/guards/authGuard/UseMounted';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const mounted = useMounted();
  const { signin } = useAuth();
  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    nombreUsuario: Yup.string().required('El usuario es requerido'),
    password: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .required('La contraseña es requerida'),
  });

  const formik = useFormik({
    initialValues: {
      nombreUsuario: 'admin',
      password: 'password123',
      submit: null,
    },

    validationSchema: LoginSchema,

    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      try {
        await signin(values.nombreUsuario, values.password, true);

        if (mounted.current) {
          setStatus({ success: true });
          setSubmitting(false);
          navigate('/pacientes', { replace: true });
        }
      } catch (err) {
        if (mounted.current) {
          setStatus({ success: false });
          setErrors({ submit: err?.message || 'No se pudo iniciar sesión.' });
          setSubmitting(false);
        }
      }
    },
  });
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      {errors.submit && (
        <Box mt={2}>
          <Alert severity="error">{errors.submit}</Alert>
        </Box>
      )}
      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit}>
          <Stack>
            <Box>
              <CustomFormLabel htmlFor="nombreUsuario">Usuario</CustomFormLabel>
              <CustomTextField
                id="nombreUsuario"
                variant="outlined"
                fullWidth
                {...getFieldProps('nombreUsuario')}
                error={Boolean(touched.nombreUsuario && errors.nombreUsuario)}
                helperText={touched.nombreUsuario && errors.nombreUsuario}
              />
            </Box>
            <Box>
              <CustomFormLabel htmlFor="password">Contraseña</CustomFormLabel>
              <CustomTextField
                id="password"
                type="password"
                variant="outlined"
                fullWidth
                {...getFieldProps('password')}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />
            </Box>
          </Stack>
          <Box>
            <Button
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              type="submit"
              disabled={isSubmitting}
            >
              Iniciar sesión
            </Button>
          </Box>
        </Form>
      </FormikProvider>
      {subtitle}
    </>
  );
};

export default AuthLogin;

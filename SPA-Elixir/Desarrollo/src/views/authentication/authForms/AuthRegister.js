import React, { useState } from 'react';
import { Box, Typography, Button, Divider, Alert, Stack, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Form, useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import useAuth from 'src/guards/authGuard/UseAuth';
import useMounted from 'src/guards/authGuard/UseMounted';

const AuthRegister = ({ title, subtitle, subtext }) => {
  const mounted = useMounted();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const registerSchema = Yup.object().shape({
    firstName: Yup.string().required('El nombre es requerido'),
    lastName: Yup.string().required('El apellido es requerido'),
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      policy: true,
      submit: null,
      acceptTerms: false,
    },

    validationSchema: registerSchema,

    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      try {
        await signup(values.email, values.password, values.firstName, values.lastName);
        if (mounted.current) {
          setStatus({ success: true });
          setSubmitting(false);
        }
      } catch (err) {
        if (mounted.current) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
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

      <Box>
        {errors.submit && (
          <Box mt={2}>
            <Alert severity="error">{errors.submit}</Alert>
          </Box>
        )}
        <FormikProvider value={formik}>
          <Form onSubmit={handleSubmit}>
            <Stack mb={3}>
              <CustomFormLabel htmlFor="firstName">Nombre</CustomFormLabel>
              <CustomTextField
                id="firstName"
                variant="outlined"
                fullWidth
                {...getFieldProps('firstName')}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />
              <CustomFormLabel htmlFor="lastName">Apellido</CustomFormLabel>
              <CustomTextField
                id="lastName"
                variant="outlined"
                fullWidth
                {...getFieldProps('lastName')}
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />
              <CustomFormLabel htmlFor="email">Email Adddress</CustomFormLabel>
              <CustomTextField
                id="email"
                variant="outlined"
                fullWidth
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
              <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
              <CustomTextField
                id="password"
                variant="outlined"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                {...getFieldProps('password')}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            <Button
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              type="submit"
              disabled={isSubmitting}
            >
              Registrarse
            </Button>

            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                mt: 2,
                fontSize: '0.8rem',
                lineHeight: 1.4,
                maxWidth: '100%',
                px: 0.5,
                textAlign: 'left',
              }}
            >
              Si el usuario se registra pero aún no ha sido activado o no tiene un contexto de empresa/sucursal asignado, no podrá acceder a las funcionalidades del sistema hasta que se complete ese proceso.
            </Typography>
          </Form>
        </FormikProvider>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthRegister;

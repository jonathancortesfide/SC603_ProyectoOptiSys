import React from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import { Form, useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import useAuth from 'src/guards/authGuard/UseAuth';
import useMounted from 'src/guards/authGuard/UseMounted';
import authServices from "../../../guards/oidc/AuthService";



const AuthLogin = ({ title, subtitle, subtext }) => {
  const mounted = useMounted();
  const navigate = useNavigate();
  const location = useLocation();
  const { signin } = useAuth();
  const avisoContextoIncompleto = Boolean(location.state?.[STATE_CONTEXTO_OPERATIVO_INCOMPLETO]);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null,
    },

    validationSchema: LoginSchema,

    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      try {
        //authServices.signinRedirect();
        await signin(values.email, values.password, true);

        if (mounted.current) {
          setStatus({ success: true });
          setSubmitting(false);
          navigate('/resolver-contexto', { replace: true });
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

      {avisoContextoIncompleto ? (
        <Box mt={2} mb={1}>
          <Alert severity="warning">
            Debe iniciar sesión y completar la selección de empresa y sucursal. Sin ese contexto no puede
            acceder aunque conozca la URL; vuelva a autenticarse.
          </Alert>
        </Box>
      ) : null}

      {errors.submit && (
        <Box mt={2}>
          <Alert severity="error">{errors.submit}</Alert>
        </Box>
      )}
      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit}>
          <Stack>
            <Box>
              <CustomFormLabel htmlFor="email">Email Address</CustomFormLabel>
              <CustomTextField
                id="email"
                variant="outlined"
                fullWidth
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
            </Box>
            <Box>
              <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
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
            <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
              <FormGroup>
                <FormControlLabel
                  control={<CustomCheckbox defaultChecked />}
                  label="Remeber this Device"
                />
              </FormGroup>
              <Typography
                component={Link}
                to="/auth/reset-password"
                fontWeight="500"
                sx={{
                  textDecoration: 'none',
                  color: 'primary.main',
                }}
              >
                Forgot Password ?
              </Typography>
            </Stack>
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
              Sign In
            </Button>
          </Box>
        </Form>
      </FormikProvider>
      {subtitle}
    </>
  );
};

export default AuthLogin;

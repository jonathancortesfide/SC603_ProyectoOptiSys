import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material';

import PageContainer from 'src/components/container/PageContainer';
import { getEmailFromAccessToken } from 'src/utils/jwtClaims';
import { obtenerEmpresasPorUsuario } from 'src/requests/empresa/RequestsEmpresas';
import { setNoEmpresaSeleccionada, setNombreEmpresaSesion } from 'src/utils/empresa';
import LogoTarjetaSeleccion from './LogoTarjetaSeleccion';

const noEmpresaDe = (e) => e?.noEmpresa ?? e?.NoEmpresa ?? 0;
const nombreDe = (e) => e?.nombre ?? e?.Nombre ?? '';
const cedulaDe = (e) => e?.cedula ?? e?.Cedula ?? '';

/** Cuando el API responde bien pero no hay filas, no usar Mensaje genérico de éxito. */
const MENSAJE_SIN_EMPRESAS_ASIGNADAS =
  'Su usuario no tiene ninguna empresa asignada en el sistema. Sin una empresa autorizada no puede continuar. Comuníquese con el administrador del sistema o con soporte técnico para que configuren su acceso y le asignen al menos una empresa.';

const SeleccionEmpresa = () => {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [alertaBloqueanteSinOpciones, setAlertaBloqueanteSinOpciones] = useState(false);
  const [empresas, setEmpresas] = useState([]);

  const token = useMemo(() => window.localStorage.getItem('accessToken'), []);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    setAlertaBloqueanteSinOpciones(false);
    try {
      const email = getEmailFromAccessToken(token);
      if (!email) {
        setError('No se encontró el correo en el token. Inicie sesión de nuevo.');
        setEmpresas([]);
        return;
      }
      const { lista, esCorrecto, mensaje, raw } = await obtenerEmpresasPorUsuario(email);
      if (esCorrecto === false) {
        setError(mensaje || raw?.Mensaje || 'No fue posible obtener las empresas.');
        setEmpresas([]);
        return;
      }
      setEmpresas(lista);
      if (!lista.length) {
        setError(MENSAJE_SIN_EMPRESAS_ASIGNADAS);
        setAlertaBloqueanteSinOpciones(true);
      }
    } catch (e) {
      setError(
        e?.response?.data?.Mensaje ??
          e?.response?.data?.mensaje ??
          e?.message ??
          'Error al cargar empresas.',
      );
      setEmpresas([]);
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const alElegir = (empresa) => {
    const n = noEmpresaDe(empresa);
    if (!n) return;
    setNoEmpresaSeleccionada(n);
    setNombreEmpresaSesion(nombreDe(empresa));
    navigate('/seleccion-sucursal', { replace: true });
  };

  return (
    <PageContainer title="Elegir empresa" description="Seleccione la empresa con la que desea trabajar">
      <Box
        sx={{
          minHeight: 'calc(100vh - 180px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          px: 2,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'radial-gradient(ellipse at top, rgba(25,118,210,0.12), transparent 55%), radial-gradient(ellipse at bottom, rgba(156,39,176,0.08), transparent 50%)'
              : 'radial-gradient(ellipse at top, rgba(25,118,210,0.08), transparent 55%), radial-gradient(ellipse at bottom, rgba(156,39,176,0.06), transparent 50%)',
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              ¿Con qué empresa trabaja hoy?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Elija una empresa para continuar.
            </Typography>
          </Box>

          {cargando && (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          )}

          {!cargando && error && (
            <Alert
              severity={alertaBloqueanteSinOpciones ? 'error' : 'warning'}
              sx={{ maxWidth: 560, mx: 'auto', mb: 2 }}
            >
              {error}
            </Alert>
          )}

          {!cargando && empresas.length > 0 && (
            <Grid container spacing={3} justifyContent="center">
              {empresas.map((empresa, idx) => {
                const nombre = nombreDe(empresa);
                const cedula = cedulaDe(empresa);
                const key = noEmpresaDe(empresa) || idx;

                return (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: 3,
                        border: (t) => `1px solid ${t.palette.divider}`,
                        background: (t) =>
                          t.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(8px)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: (t) =>
                            t.palette.mode === 'dark'
                              ? '0 12px 40px rgba(0,0,0,0.45)'
                              : '0 12px 40px rgba(25,118,210,0.18)',
                        },
                      }}
                    >
                      <CardActionArea onClick={() => alElegir(empresa)} sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ textAlign: 'center', py: 4, px: 2 }}>
                          <Box display="flex" justifyContent="center" mb={2}>
                            <LogoTarjetaSeleccion imagenRaw={empresa?.imagen ?? empresa?.Imagen} />
                          </Box>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            gutterBottom
                            title={nombre}
                            sx={{
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 2,
                              minHeight: '3.5rem',
                            }}
                          >
                            {nombre || 'Sin nombre'}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontFeatureSettings: '"tnum"', letterSpacing: 0.3 }}
                          >
                            Cédula: {cedula || '—'}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>
    </PageContainer>
  );
};

export default SeleccionEmpresa;

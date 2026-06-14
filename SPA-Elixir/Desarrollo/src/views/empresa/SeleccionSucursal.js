import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { obtenerSucursalesPorUsuario } from 'src/requests/empresa/RequestsSucursales';
import { getNoEmpresa, hasEmpresaElegidaParaAcceso } from 'src/utils/empresa';
import { setIdentificadorSucursalSeleccionado, setNombreSucursalSesion } from 'src/utils/sucursal';
import LogoTarjetaSeleccion from './LogoTarjetaSeleccion';

/** Sin valor por defecto 0: si falta en el API, no confundir con id válido. */
const identificadorDe = (s) => {
  const v = s?.identificador ?? s?.Identificador;
  if (v === undefined || v === null || v === '') return undefined;
  const n = Number.parseInt(String(v), 10);
  return Number.isFinite(n) ? n : undefined;
};
const nombreDe = (s) => s?.nombre ?? s?.Nombre ?? '';
const subtituloDe = (s) => s?.siglas ?? s?.Siglas ?? s?.direccion ?? s?.Direccion ?? '';

/** Cuando el API responde bien pero no hay filas, no usar Mensaje genérico de éxito. */
const MENSAJE_SIN_SUCURSALES_ASIGNADAS =
  'Su usuario no tiene ninguna sucursal asignada para esta empresa (o no existen sucursales disponibles según su perfil). No puede ingresar al panel hasta contar con al menos una sucursal autorizada. Comuníquese con el administrador del sistema para que revise su usuario y habilite las sucursales correspondientes.';

const SeleccionSucursal = () => {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [alertaBloqueanteSinOpciones, setAlertaBloqueanteSinOpciones] = useState(false);
  const [sucursales, setSucursales] = useState([]);
  const autoSeleccionHecha = useRef(false);

  const token = useMemo(() => window.localStorage.getItem('accessToken'), []);

  const aplicarSucursalYEntrar = useCallback(
    (sucursal) => {
      const id = identificadorDe(sucursal);
      if (id === undefined) {
        setError(
          'El servidor no envió Identificador de sucursal. Use la API actualizada (SucursalDto.Identificador) o contacte soporte.',
        );
        return;
      }
      setError(null);
      setIdentificadorSucursalSeleccionado(id);
      setNombreSucursalSesion(nombreDe(sucursal));
      navigate('/sample-page', { replace: true });
    },
    [navigate],
  );

  const cargar = useCallback(async () => {
    if (!hasEmpresaElegidaParaAcceso()) {
      navigate('/resolver-contexto', { replace: true });
      return;
    }

    setCargando(true);
    setError(null);
    setAlertaBloqueanteSinOpciones(false);
    try {
      const email = getEmailFromAccessToken(token);
      if (!email) {
        setError('No se encontró el correo en el token. Inicie sesión de nuevo.');
        setSucursales([]);
        return;
      }

      const noEmpresa = getNoEmpresa();
      const { lista, esCorrecto, mensaje, raw } = await obtenerSucursalesPorUsuario(email, noEmpresa);
      if (esCorrecto === false) {
        setError(mensaje || raw?.Mensaje || 'No fue posible obtener las sucursales.');
        setSucursales([]);
        return;
      }
      setSucursales(lista);
      if (!lista.length) {
        setError(MENSAJE_SIN_SUCURSALES_ASIGNADAS);
        setAlertaBloqueanteSinOpciones(true);
      }
    } catch (e) {
      setError(
        e?.response?.data?.Mensaje ??
          e?.response?.data?.mensaje ??
          e?.message ??
          'Error al cargar sucursales.',
      );
      setSucursales([]);
    } finally {
      setCargando(false);
    }
  }, [navigate, token]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    if (cargando || sucursales.length !== 1 || autoSeleccionHecha.current) return;
    const id = identificadorDe(sucursales[0]);
    if (id === undefined) {
      setError(
        'El servidor no envió Identificador de sucursal. Publique la API con SucursalDto.Identificador.',
      );
      autoSeleccionHecha.current = true;
      return;
    }
    autoSeleccionHecha.current = true;
    setIdentificadorSucursalSeleccionado(id);
    setNombreSucursalSesion(nombreDe(sucursales[0]));
    navigate('/sample-page', { replace: true });
  }, [cargando, sucursales, navigate]);

  const idUnicaLista =
    !cargando && sucursales.length === 1 ? identificadorDe(sucursales[0]) : undefined;

  if (!cargando && sucursales.length === 1 && idUnicaLista !== undefined) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContainer title="Elegir sucursal" description="Seleccione la sucursal con la que desea trabajar">
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
              ¿En qué sucursal trabaja?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Elija una sucursal para continuar al panel.
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

          {!cargando && sucursales.length > 1 && (
            <Grid container spacing={3} justifyContent="center">
              {sucursales.map((sucursal, idx) => {
                const nombre = nombreDe(sucursal);
                const sub = subtituloDe(sucursal);
                const key = identificadorDe(sucursal) ?? idx;

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
                      <CardActionArea onClick={() => aplicarSucursalYEntrar(sucursal)} sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ textAlign: 'center', py: 4, px: 2 }}>
                          <Box display="flex" justifyContent="center" mb={2}>
                            <LogoTarjetaSeleccion imagenRaw={sucursal?.imagen ?? sucursal?.Imagen} />
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
                          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                            {sub || '—'}
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

export default SeleccionSucursal;

import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

import { getEmailFromAccessToken } from 'src/utils/jwtClaims';
import { obtenerEmpresasPorUsuario } from 'src/requests/empresa/RequestsEmpresas';
import { setNoEmpresaSeleccionada, setNombreEmpresaSesion } from 'src/utils/empresa';

const noEmpresaDe = (e) => e?.noEmpresa ?? e?.NoEmpresa ?? 0;
const nombreEmpresaDe = (e) => e?.nombre ?? e?.Nombre ?? '';

/**
 * Tras el login: si hay una sola empresa la guarda y va a sucursales;
 * si hay varias, envía a la pantalla de elegir empresa.
 */
const ResolverContexto = () => {
  const navigate = useNavigate();
  const token = useMemo(() => window.localStorage.getItem('accessToken'), []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const email = getEmailFromAccessToken(token);
      if (!email) {
        navigate('/auth/login', { replace: true });
        return;
      }

      try {
        const { lista, esCorrecto } = await obtenerEmpresasPorUsuario(email);
        if (cancelled) return;

        if (esCorrecto === false || !lista?.length) {
          navigate('/seleccion-empresa', { replace: true });
          return;
        }

        if (lista.length === 1) {
          const no = noEmpresaDe(lista[0]);
          if (no) {
            setNoEmpresaSeleccionada(no);
            setNombreEmpresaSesion(nombreEmpresaDe(lista[0]));
          }
          navigate('/seleccion-sucursal', { replace: true });
          return;
        }

        navigate('/seleccion-empresa', { replace: true });
      } catch {
        if (!cancelled) navigate('/seleccion-empresa', { replace: true });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [navigate, token]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress />
    </Box>
  );
};

export default ResolverContexto;

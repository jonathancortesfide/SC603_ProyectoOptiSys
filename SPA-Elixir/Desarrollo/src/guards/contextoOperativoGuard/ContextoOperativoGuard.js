import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import useAuth from 'src/guards/authGuard/UseAuth';
import { hasEmpresaElegidaParaAcceso } from 'src/utils/empresa';
import { hasSucursalElegidaParaAcceso } from 'src/utils/sucursal';

/** `location.state` al redirigir a login por falta de empresa/sucursal (leer en `AuthLogin`). */
export const STATE_CONTEXTO_OPERATIVO_INCOMPLETO = 'contextoOperativoIncompleto';

/**
 * El menú principal exige sesión con empresa y sucursal en `localStorage`.
 * Si el usuario autenticado abre una URL del app sin ese contexto, se cierra sesión y se envía a login.
 */
const ContextoOperativoGuard = ({ children }) => {
  const { isAuthenticated, isInitialized, logout } = useAuth();
  const navigate = useNavigate();

  const contextoCompleto = hasEmpresaElegidaParaAcceso() && hasSucursalElegidaParaAcceso();

  useEffect(() => {
    if (!isInitialized || !isAuthenticated) return;
    if (hasEmpresaElegidaParaAcceso() && hasSucursalElegidaParaAcceso()) return;

    let cancelled = false;
    (async () => {
      await logout();
      if (!cancelled) {
        navigate('/auth/login', {
          replace: true,
          state: { [STATE_CONTEXTO_OPERATIVO_INCOMPLETO]: true },
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isInitialized, isAuthenticated, navigate, logout]);

  if (!isInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return children;
  }

  if (!contextoCompleto) {
    return null;
  }

  return children;
};

ContextoOperativoGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContextoOperativoGuard;

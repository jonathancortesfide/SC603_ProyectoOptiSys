import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const { isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const contextoCompleto = hasEmpresaElegidaParaAcceso() && hasSucursalElegidaParaAcceso();

  useEffect(() => {
    if (!isInitialized || !isAuthenticated) return;
    if (contextoCompleto) return;

    const currentPath = `${location.pathname}${location.search}`;
    const isResolverFlow = currentPath.startsWith('/resolver-contexto') || currentPath.startsWith('/seleccion-empresa') || currentPath.startsWith('/seleccion-sucursal') || currentPath.startsWith('/sin-sucursal');

    if (!isResolverFlow) {
      navigate('/resolver-contexto', {
        replace: true,
        state: { [STATE_CONTEXTO_OPERATIVO_INCOMPLETO]: true },
      });
    }
  }, [isInitialized, isAuthenticated, contextoCompleto, location.pathname, location.search, navigate]);

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

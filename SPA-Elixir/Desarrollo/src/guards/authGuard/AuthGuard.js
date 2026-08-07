import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from './UseAuth';
import { useEffect } from 'react';

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      const currentPath = `${location.pathname}${location.search}`;
      const isAuthRoute = currentPath.startsWith('/auth');

      if (!isAuthRoute) {
        navigate('/auth/login', {
          replace: true,
          state: { from: currentPath },
        });
      }
    }
  }, [isInitialized, isAuthenticated, location.pathname, location.search, navigate]);

  if (!isInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default AuthGuard;

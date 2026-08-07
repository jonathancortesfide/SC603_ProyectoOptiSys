import { useNavigate } from 'react-router-dom';
import useAuth from './UseAuth';
import { useEffect } from 'react';

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true });
    }
  }, [isInitialized, isAuthenticated, navigate]);

  if (!isInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default AuthGuard;

import { Navigate } from 'react-router-dom';
import useAuth from './UseAuth';
import Spinner from '../../views/spinner/Spinner';

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  return children;
};

export default AuthGuard;

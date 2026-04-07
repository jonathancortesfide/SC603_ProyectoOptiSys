import { Navigate } from 'react-router-dom';
import useAuth from './UseAuth';
import Spinner from '../../views/spinner/Spinner';

const GuestGuard = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) return <Spinner />;
  if (isAuthenticated) return <Navigate to="/pacientes" replace />;

  return children;
};

export default GuestGuard;

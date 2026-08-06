import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import usePermissions from './usePermissions';

const ProtectedRoute = ({ children, requiredPermissions = [], fallbackPath = '/auth/404' }) => {
  const location = useLocation();
  const { hasAnyPermission, hasPermission } = usePermissions();

  const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
  const hasAccess = permissions.length === 0 || (permissions.some((permission) => permission.includes('|'))
    ? permissions.some((permission) => permission.split('|').some((entry) => hasPermission(entry)))
    : hasAnyPermission(permissions));

  if (!hasAccess) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

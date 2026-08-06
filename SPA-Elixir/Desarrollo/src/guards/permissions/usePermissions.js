import { useMemo } from 'react';
import { decodeToken } from 'react-jwt';
import { getSessionToken } from 'src/utils/session';
import { extractPermissionsFromTokenPayload } from './permissionUtils';

const extractPermissionsFromToken = (token) => {
  if (!token) return [];

  try {
    const decoded = decodeToken(token);
    return extractPermissionsFromTokenPayload(decoded);
  } catch {
    return [];
  }
};

const usePermissions = () => {
  const token = getSessionToken();

  return useMemo(() => {
    const permissions = extractPermissionsFromToken(token);
    const permissionSet = new Set(permissions.map((permission) => String(permission).toUpperCase()));

    return {
      permissions: Array.from(permissionSet),
      hasPermission: (permission) => permissionSet.has(String(permission).toUpperCase()),
      hasAnyPermission: (list = []) => list.some((permission) => permissionSet.has(String(permission).toUpperCase())),
    };
  }, [token]);
};

export default usePermissions;

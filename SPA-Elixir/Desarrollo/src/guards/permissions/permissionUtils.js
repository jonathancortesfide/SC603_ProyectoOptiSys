export const normalizePermissionList = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item : item?.permission ?? item?.code ?? item?.codigo ?? item?.codigoPermiso ?? ''))
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export const extractPermissionsFromTokenPayload = (decoded) => {
  if (!decoded || typeof decoded !== 'object') return [];

  const claimCandidates = [
    decoded.permission,
    decoded.permissions,
    decoded.permiso,
    decoded.permisos,
  ];

  const permissions = claimCandidates.flatMap((candidate) => normalizePermissionList(candidate));

  return Array.from(new Set(permissions.map((permission) => String(permission).toUpperCase())));
};

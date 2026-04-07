const parseOptionalInt = (value) => {
  if (value === undefined || value === null) return undefined;

  const normalized = String(value).trim().replace(/^['"]|['"]$/g, '');
  if (!normalized) return undefined;

  const parsed = Number.parseInt(normalized, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

// Placeholder: once user/session logic exists, implement it here.
// Examples could include reading an "identificador" claim from the JWT/OIDC token
// or from a user profile object stored in local/session storage.
export const resolveSucursalIdentificadorFromSession = () => undefined;

export const getSucursalIdentificador = () => {
  const fromEnv = parseOptionalInt(import.meta.env.VITE_SUCURSAL_IDENTIFICADOR);
  if (fromEnv !== undefined) return fromEnv;

  const fromSession = resolveSucursalIdentificadorFromSession();
  if (typeof fromSession === 'number' && Number.isFinite(fromSession)) return fromSession;

  // Temporary fallback to keep current behavior until session-based logic exists.
  return 7;
};

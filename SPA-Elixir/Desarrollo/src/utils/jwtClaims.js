import { decodeToken } from 'react-jwt';

/**
 * Lee el email del payload del JWT (mismo mecanismo que en jwt.io: decode del payload).
 */
export const getEmailFromAccessToken = (token) => {
  if (!token || typeof token !== 'string') return null;

  const decoded = decodeToken(token);
  if (!decoded || typeof decoded !== 'object') return null;

  return (
    decoded.email ??
    decoded.Email ??
    decoded.unique_name ??
    decoded.preferred_username ??
    decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ??
    decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ??
    null
  );
};

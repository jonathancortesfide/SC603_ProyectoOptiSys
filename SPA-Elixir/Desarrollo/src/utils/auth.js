import { decodeToken } from 'react-jwt';

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'usuario';
const FALLBACK_USERNAME = 'jonathan';

const safeParseJson = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const getCurrentUsername = () => {
  const rawUser = window.localStorage.getItem(USER_KEY);
  const storedUser = rawUser ? safeParseJson(rawUser) : null;
  const storedUsername =
    storedUser?.nombreUsuario ??
    storedUser?.username ??
    storedUser?.userName ??
    storedUser?.name ??
    '';

  if (String(storedUsername).trim()) {
    return String(storedUsername).trim();
  }

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  const decoded = accessToken ? decodeToken(accessToken) : null;
  const tokenUsername =
    decoded?.unique_name ??
    decoded?.name ??
    decoded?.preferred_username ??
    decoded?.sub ??
    '';

  if (String(tokenUsername).trim()) {
    return String(tokenUsername).trim();
  }

  return FALLBACK_USERNAME;
};
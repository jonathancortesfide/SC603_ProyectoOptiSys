/* eslint-disable react-hooks/rules-of-hooks */
import { decodeToken } from 'react-jwt';

import baseAxios from 'axios';
import axios from 'src/utils/axios';

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'usuario';
let authInterceptorsRegistered = false;

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const decoded = decodeToken(accessToken);
  if (!decoded?.exp) {
    return false;
  }

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem(USER_KEY);
    return rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    console.error('No se pudo leer el usuario autenticado.', error);
    return null;
  }
};

const getUserFromToken = (accessToken) => {
  const decoded = decodeToken(accessToken);
  if (!decoded) return null;

  return {
    noUsuario: Number(decoded.noUsuario ?? decoded.nameid ?? decoded.sub ?? 0) || 0,
    nombreUsuario: decoded.unique_name ?? decoded.name ?? '',
    correo: decoded.email ?? '',
  };
};

const clearSession = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  delete axios.defaults.headers.common.Authorization;
  delete baseAxios.defaults.headers.common.Authorization;
};

const setSession = (accessToken, user = null) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    const headerValue = `Bearer ${accessToken}`;
    axios.defaults.headers.common.Authorization = headerValue;
    baseAxios.defaults.headers.common.Authorization = headerValue;
  } else {
    clearSession();
  }
};

const registerAuthInterceptors = () => {
  if (authInterceptorsRegistered) return;

  const handleUnauthorized = (error) => {
    if (error?.response?.status === 401) {
      clearSession();
      if (window.location.pathname !== '/auth/login') {
        window.location.assign('/auth/login');
      }
    }

    return Promise.reject(error);
  };

  axios.interceptors.response.use((response) => response, handleUnauthorized);
  baseAxios.interceptors.response.use((response) => response, handleUnauthorized);
  authInterceptorsRegistered = true;
};

const sign = (payload, privateKey, header) => {
  const now = new Date();
  header.expiresIn = new Date(now.getTime() + header.expiresIn);
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(
    Array.from(encodedPayload)
      .map((item, key) =>
        String.fromCharCode(item.charCodeAt(0) ^ privateKey[key % privateKey.length].charCodeAt(0)),
      )
      .join(''),
  );

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

const verify = (token, privateKey) => {
  const [encodedHeader, encodedPayload, signature] = token.split('.');
  const header = JSON.parse(atob(encodedHeader));
  const payload = JSON.parse(atob(encodedPayload));
  const now = new Date();

  if (now < header.expiresIn) {
    throw new Error('Expired token');
  }

  const verifiedSignature = btoa(
    Array.from(encodedPayload)
      .map((item, key) =>
        String.fromCharCode(item.charCodeAt(0) ^ privateKey[key % privateKey.length].charCodeAt(0)),
      )
      .join(''),
  );

  /*if (verifiedSignature !== signature) {
    throw new Error('Invalid signature');
  }*/

  return payload;
};

export { ACCESS_TOKEN_KEY, USER_KEY, clearSession, getStoredUser, getUserFromToken, isValidToken, registerAuthInterceptors, setSession, sign, verify };

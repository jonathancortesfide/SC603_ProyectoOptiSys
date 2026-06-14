const STORAGE_IDENTIFICADOR_SUCURSAL = 'identificadorSucursalSeleccionado';
const STORAGE_NOMBRE_SUCURSAL = 'nombreSucursalSesion';

import { getSessionSucursalIdentificador } from './session';

const parseOptionalInt = (value) => {
  if (value === undefined || value === null) return undefined;

  const normalized = String(value).trim().replace(/^['"]|['"]$/g, '');
  if (!normalized) return undefined;

  const parsed = Number.parseInt(normalized, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/** Equivalente a lo que antes era `VITE_SUCURSAL_IDENTIFICADOR` — identificador Empresa_Sucursal. */
export const setIdentificadorSucursalSeleccionado = (identificador) => {
  const n = Number.parseInt(String(identificador), 10);
  if (!Number.isFinite(n)) return;
  window.localStorage.setItem(STORAGE_IDENTIFICADOR_SUCURSAL, String(n));
};

export const setNombreSucursalSesion = (nombre) => {
  const t = nombre == null ? '' : String(nombre).trim();
  if (t) window.localStorage.setItem(STORAGE_NOMBRE_SUCURSAL, t);
  else window.localStorage.removeItem(STORAGE_NOMBRE_SUCURSAL);
};

export const getNombreSucursalSesion = () => {
  const t = window.localStorage.getItem(STORAGE_NOMBRE_SUCURSAL);
  return t && String(t).trim() ? String(t).trim() : '';
};

export const clearIdentificadorSucursalSeleccionado = () => {
  window.localStorage.removeItem(STORAGE_IDENTIFICADOR_SUCURSAL);
  window.localStorage.removeItem(STORAGE_NOMBRE_SUCURSAL);
};

export const resolveSucursalIdentificadorFromSession = () =>
  parseOptionalInt(window.localStorage.getItem(STORAGE_IDENTIFICADOR_SUCURSAL));

/**
 * Identificador de sucursal en contexto empresa-sucursal (tabla Empresa_Sucursal).
 * Ya no usa `VITE_SUCURSAL_IDENTIFICADOR`.
 */
export const getSucursalIdentificador = () => {
  const fromLs = resolveSucursalIdentificadorFromSession();
  if (fromLs !== undefined) return fromLs;

  const fromSession = getSessionSucursalIdentificador();
  if (typeof fromSession === 'number' && Number.isFinite(fromSession)) return fromSession;

  const fromEnv = parseOptionalInt(import.meta.env.VITE_SUCURSAL_IDENTIFICADOR);
  if (fromEnv !== undefined) return fromEnv;

  // Temporary fallback to keep current behavior until session-based logic exists.
  return 7;
};

/** True si el usuario ya eligió sucursal (localStorage). */
export const hasSucursalElegidaParaAcceso = () =>
  parseOptionalInt(window.localStorage.getItem(STORAGE_IDENTIFICADOR_SUCURSAL)) !== undefined;

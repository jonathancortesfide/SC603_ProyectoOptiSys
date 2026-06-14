/**
 * Normaliza Imagen del API (byte[], base64, Buffer JSON, URL, rutas relativas).
 */

const padBase64 = (s) => {
  const pad = s.length % 4;
  if (pad === 0) return s;
  return s + '='.repeat(4 - pad);
};

export const base64StringToUint8 = (raw) => {
  const cleaned = String(raw)
    .trim()
    .replace(/^\uFEFF/, '')
    .replace(/\s/g, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const binary = atob(padBase64(cleaned));
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

const hexStringToUint8 = (hex) => {
  const t = String(hex).trim();
  if (t.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(t)) return null;
  const out = new Uint8Array(t.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = Number.parseInt(t.substr(i * 2, 2), 16);
  }
  return out;
};

/** Base del API (para rutas y comparar origen). */
export const apiBaseAbsoluto = () => {
  const raw = import.meta.env.VITE_ApiBase;
  const s = raw == null || raw === '' ? '/api' : String(raw).trim().replace(/^["']|["']$/g, '');
  return s.replace(/\/$/, '') || '/api';
};

/** Origen (protocolo + host + puerto) del API — útil para saber si hay que cargar la imagen con credenciales. */
export const obtenerOrigenDelApi = () => {
  try {
    const base = typeof window !== 'undefined' ? window.location.href : 'http://localhost/';
    return new URL(apiBaseAbsoluto(), base).origin;
  } catch {
    return '';
  }
};

/** /ruta/relativa → URL absoluta al API (mismo esquema si hace falta). */
export const absolutizarRutaApi = (pathRelativo) => {
  const t = String(pathRelativo).trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith('//')) return `${typeof window !== 'undefined' ? window.location.protocol : 'https:'}${t}`;
  const base = apiBaseAbsoluto();
  if (t.startsWith('/')) return `${base}${t}`;
  return `${base}/${t}`;
};

/**
 * Desenvuelve anidamiento típico (.NET / Mongo / Node Buffer en JSON).
 */
export const desenvolverCapasImagen = (x, depth = 0) => {
  if (x == null || depth > 10) return null;
  if (typeof x === 'string' || typeof x === 'number') return x;
  if (typeof x === 'boolean') return null;

  if (x instanceof ArrayBuffer) return new Uint8Array(x);
  if (ArrayBuffer.isView(x)) return new Uint8Array(x.buffer, x.byteOffset, x.byteLength);

  if (Array.isArray(x)) return x;

  if (typeof x === 'object') {
    const b64 =
      x.$binary?.base64 ??
      x.base64 ??
      (typeof x.$binary === 'string' ? x.$binary : null);
    if (typeof b64 === 'string') return b64;

    if (Array.isArray(x.data)) return x.data;
    if (Array.isArray(x.Data)) return x.Data;

    if (x.imagen != null) return desenvolverCapasImagen(x.imagen, depth + 1);
    if (x.Imagen != null) return desenvolverCapasImagen(x.Imagen, depth + 1);
  }

  return x;
};

export const mimeDesdeCabecera = (bytes) => {
  if (!bytes || bytes.length < 2) return null;
  const b = bytes;

  if (b[0] === 0xff && b[1] === 0xd8) return 'image/jpeg';

  if (b.length >= 4 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';

  if (b.length >= 6 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return 'image/gif';

  if (
    b.length >= 12 &&
    b[0] === 0x52 &&
    b[1] === 0x49 &&
    b[2] === 0x46 &&
    b[3] === 0x46 &&
    b[8] === 0x57 &&
    b[9] === 0x45 &&
    b[10] === 0x42 &&
    b[11] === 0x50
  ) {
    return 'image/webp';
  }

  if (b.length >= 2 && b[0] === 0x42 && b[1] === 0x4d) return 'image/bmp';

  /* ICO / CUR */
  if (b.length >= 4 && b[0] === 0 && b[1] === 0 && b[2] === 1 && b[3] === 0) return 'image/x-icon';

  /* TIFF */
  if (
    (b[0] === 0x49 && b[1] === 0x49 && b[2] === 0x2a && b[3] === 0x00) ||
    (b[0] === 0x4d && b[1] === 0x4d && b[2] === 0x00 && b[3] === 0x2a)
  ) {
    return 'image/tiff';
  }

  const previewLen = Math.min(512, b.length);
  const head = new TextDecoder('utf-8', { fatal: false }).decode(b.subarray(0, previewLen)).trimStart();
  if (head.startsWith('<svg') || head.startsWith('<?xml')) return 'image/svg+xml';

  return null;
};

/** True si los primeros bytes coinciden con un formato de imagen que el navegador suele mostrar en <img>. */
export const tieneFirmaImagenConocida = (bytes) => !!mimeDesdeCabecera(bytes);

const pareceRutaArchivoImagen = (t) =>
  /\.(png|jpe?g|gif|webp|svg|bmp|ico)(\?[^/]*)?$/i.test(t) ||
  /^[\w.-]+\/[\w./-]+\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i.test(t);

const uint8ToBase64Chunked = (u8) => {
  let s = '';
  for (let i = 0; i < u8.length; i += 1) {
    s += String.fromCharCode(u8[i]);
  }
  return btoa(s);
};

export const bytesToImagenDataUrl = (bytes) => {
  if (!bytes || !bytes.length) return null;
  const mime = mimeDesdeCabecera(bytes);
  if (mime === 'image/svg+xml') {
    const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(text)}`;
  }
  const tipo = mime || 'image/jpeg';
  return `data:${tipo};base64,${uint8ToBase64Chunked(bytes)}`;
};

/**
 * Resultado interpretado para mostrar en <img>.
 * @typedef {{ tipo: 'href', src: string } | { tipo: 'bytes', bytes: Uint8Array } | { tipo: 'vacío' }}} InterpretacionImagen
 */

/**
 * @param {unknown} imagen
 * @returns {InterpretacionImagen}
 */
export const interpretarImagenApi = (imagen) => {
  const v = desenvolverCapasImagen(imagen);

  if (v == null) return { tipo: 'vacío' };

  if (v instanceof Uint8Array) {
    if (!v.length) return { tipo: 'vacío' };
    return tieneFirmaImagenConocida(v) ? { tipo: 'bytes', bytes: v } : { tipo: 'vacío' };
  }

  if (typeof v === 'string') {
    const t = v.trim();
    if (!t) return { tipo: 'vacío' };
    if (t.startsWith('data:')) return { tipo: 'href', src: t };
    if (/^https?:\/\//i.test(t)) return { tipo: 'href', src: t };

    /*
     * Importante: el base64 de un JPEG casi siempre empieza por "/9j/" (FF D8 …).
     * Eso NO es una ruta web. Intentar base64 ANTES de tratar "/…" como URL.
     * Si atob produce bytes pero no son imagen, puede ser una ruta mal interpretada.
     */
    try {
      const bytes = base64StringToUint8(t);
      if (bytes.length && tieneFirmaImagenConocida(bytes)) {
        return { tipo: 'bytes', bytes };
      }
    } catch {
      /* no es base64 válido */
    }

    const hex = hexStringToUint8(t);
    if (hex && hex.length && tieneFirmaImagenConocida(hex)) {
      return { tipo: 'bytes', bytes: hex };
    }

    if (t.startsWith('/') && !t.startsWith('//')) {
      return { tipo: 'href', src: absolutizarRutaApi(t) };
    }

    if (pareceRutaArchivoImagen(t) && !/\s/.test(t) && t.length < 800) {
      const path = t.startsWith('/') ? t : `/${t}`;
      return { tipo: 'href', src: absolutizarRutaApi(path) };
    }

    return { tipo: 'vacío' };
  }

  if (v instanceof ArrayBuffer) {
    const bytes = new Uint8Array(v);
    return bytes.length && tieneFirmaImagenConocida(bytes) ? { tipo: 'bytes', bytes } : { tipo: 'vacío' };
  }

  if (Array.isArray(v) && v.length) {
    try {
      const bytes = new Uint8Array(v.length);
      for (let i = 0; i < v.length; i += 1) {
        const n = Number(v[i]);
        bytes[i] = Number.isFinite(n) ? n & 0xff : 0;
      }
      return tieneFirmaImagenConocida(bytes) ? { tipo: 'bytes', bytes } : { tipo: 'vacío' };
    } catch {
      return { tipo: 'vacío' };
    }
  }

  return { tipo: 'vacío' };
};

/** @deprecated Usar interpretarImagenApi + Blob o href */
export const resolverSrcLogotipoEmpresa = (imagen) => {
  const i = interpretarImagenApi(imagen);
  if (i.tipo === 'href') return i.src;
  if (i.tipo !== 'bytes') return null;
  return bytesToImagenDataUrl(i.bytes);
};

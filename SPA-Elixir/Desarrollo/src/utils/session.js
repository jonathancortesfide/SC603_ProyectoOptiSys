import { decodeToken } from 'react-jwt';

const readStorageValue = (storage, key) => {
    try {
        return storage?.getItem?.(key) ?? null;
    } catch {
        return null;
    }
};

const parseJson = (value) => {
    if (!value) return null;

    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
};

const isNonEmptyValue = (value) => value !== undefined && value !== null && String(value).trim() !== '';

const getOidcUserFromSession = () => {
    if (typeof window === 'undefined') return null;

    try {
        const sessionKeys = Object.keys(window.sessionStorage ?? {});
        const oidcKey = sessionKeys.find((key) => key.startsWith('oidc.user:'));
        return oidcKey ? parseJson(window.sessionStorage.getItem(oidcKey)) : null;
    } catch {
        return null;
    }
};

export const getSessionToken = () => {
    if (typeof window === 'undefined') return null;

    const localAccessToken = readStorageValue(window.localStorage, 'accessToken');
    if (localAccessToken) return localAccessToken;

    const oidcUser = getOidcUserFromSession();
    if (oidcUser?.access_token) return oidcUser.access_token;

    return null;
};

export const getSessionClaims = () => {
    const token = getSessionToken();
    if (token) {
        const decoded = decodeToken(token);
        if (decoded && typeof decoded === 'object') return decoded;
    }

    const oidcUser = getOidcUserFromSession();
    if (oidcUser?.profile && typeof oidcUser.profile === 'object') return oidcUser.profile;

    return {};
};

export const getSessionClaim = (...claimNames) => {
    const claims = getSessionClaims();

    for (const claimName of claimNames) {
        const value = claims?.[claimName];
        if (isNonEmptyValue(value)) return value;
    }

    return undefined;
};

export const getCurrentUsername = () => {
    const username = getSessionClaim(
        'preferred_username',
        'unique_name',
        'username',
        'login',
        'name',
        'email',
        'sub'
    );

    return isNonEmptyValue(username) ? String(username).trim() : 'sistema';
};

export const getSessionSucursalIdentificador = () => {
    const value = getSessionClaim(
        'identificador',
        'Identificador',
        'sucursal',
        'sucursalId',
        'branchId',
        'empresa_sucursal_identificador'
    );

    if (!isNonEmptyValue(value)) return undefined;

    const parsed = Number.parseInt(String(value).trim(), 10);
    return Number.isFinite(parsed) ? parsed : undefined;
};
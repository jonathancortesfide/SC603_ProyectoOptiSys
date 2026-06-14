
const apiBase = import.meta.env.VITE_ApiBase;
const apiAuthority = import.meta.env.VITE_Authority;
const apiBaseWithSlash = apiBase.endsWith('/') ? apiBase : `${apiBase}/`;

export const apiLogin = `${apiBaseWithSlash}Seguridad/ObtenerToken`;
export const apiRegistroUsuario = `${apiBaseWithSlash}Seguridad/RegistrarUsuario`;
export const apiObtenerTokenOauth = `${apiAuthority}/connect/token`;
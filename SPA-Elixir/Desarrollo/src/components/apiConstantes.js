
const apiBase = import.meta.env.VITE_ApiBase;
const apiAuthority = import.meta.env.VITE_Authority;

export const apiLogin = `${apiBase}Seguridad/ObtenerToken`;
export const apiRegistroUsuario = `${apiBase}Seguridad/RegistrarUsuario`;
export const apiObtenerTokenOauth = `${apiAuthority}/connect/token`;
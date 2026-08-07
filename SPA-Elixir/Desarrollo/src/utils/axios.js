 import axios from 'axios';

 const axiosServices = axios.create();

 const readStorageValue = (storage, key) => {
     try {
         return storage?.getItem?.(key) ?? null;
     } catch {
         return null;
     }
 };

 const getSessionToken = () => {
     if (typeof window === 'undefined') return null;

     const localAccessToken = readStorageValue(window.localStorage, 'accessToken');
     if (localAccessToken) return localAccessToken;

     try {
         const sessionKeys = Object.keys(window.sessionStorage ?? {});
         const oidcKey = sessionKeys.find((key) => key.startsWith('oidc.user:'));
         if (!oidcKey) return null;
         const oidcRaw = window.sessionStorage.getItem(oidcKey);
         const oidcUser = oidcRaw ? JSON.parse(oidcRaw) : null;
         return oidcUser?.access_token ?? null;
     } catch {
         return null;
     }
 };

 // Ensure protected requests include JWT even after page refresh.
 axiosServices.interceptors.request.use((config) => {
     const token = getSessionToken();
     if (!token) return config;

     config.headers = config.headers || {};
     if (!config.headers.Authorization) {
         config.headers.Authorization = token.startsWith('Bearer ')
             ? token
             : `Bearer ${token}`;
     }

     return config;
 });
 
 // interceptor for http
 axiosServices.interceptors.response.use(
     (response) => response,
     (error) => Promise.reject((error.response && error.response.data) || 'Wrong Services')
 );
 
 export default axiosServices;
 
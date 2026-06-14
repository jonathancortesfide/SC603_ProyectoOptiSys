# Endpoints de autenticación que el SPA necesita del API

Este documento describe exactamente qué endpoints debe exponer el proyecto API (ASP.NET Core, puerto `7159`) para que el SPA pueda autenticar usuarios. El SPA **ya no usará un IdentityServer separado** en puerto `5001`; todo debe estar en el mismo API.

---

## Contexto del SPA

- Framework: React + Vite
- Autenticación activa: **JWT** (flujo `password grant` simplificado, sin redirect OIDC)
- El token se guarda en `localStorage` con clave `accessToken`
- En cada request posterior se envía en el header: `Authorization: <token>` (sin prefijo `Bearer`)
- Base URL del API en el `.env`: `VITE_ApiBase = "/api"` (proxy Vite → `https://localhost:7159`)
- El endpoint de token está en: `VITE_Authority = "https://localhost:5001"` → **hay que moverlo al API principal** o hacer que el API en `7159` responda en esa ruta

---

## Endpoints requeridos

### 1. `POST /connect/token`

**Descripción:** Emite un JWT a partir de credenciales usuario/contraseña.  
El SPA lo llama así (desde `JwtContext.js`):

```http
POST https://localhost:5001/connect/token
Content-Type: application/x-www-form-urlencoded

client_id=js
grant_type=password
scope=openid profile scope2
username=<email>
password=<contraseña>
```

**Respuesta esperada (JSON):**

```json
{
  "access_token": "<JWT string>"
}
```

**Estructura mínima del payload del JWT** (el SPA decodifica el token con `react-jwt` y busca estas claims):

```json
{
  "sub": "<userId>",
  "email": "<email del usuario>",
  "exp": <unix timestamp de expiración>,
  "iat": <unix timestamp de emisión>
}
```

Campos alternativos que también acepta el SPA para el email (en orden de preferencia, ver `jwtClaims.js`):
- `email`
- `Email`
- `unique_name`
- `preferred_username`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name`

**Validaciones que hace el SPA sobre el token:**
- `decoded.exp > Date.now() / 1000` — si falla, considera el token inválido y redirige al login

---

### 2. `GET /api/account/my-account`

**Descripción:** Valida que el token guardado sigue siendo válido y retorna el usuario de la sesión.  
Se llama **automáticamente al recargar la app**, si ya hay un `accessToken` en `localStorage`.

**Header requerido:**

```http
GET /api/account/my-account
Authorization: <el JWT, sin prefijo Bearer>
```

**Respuesta esperada (JSON):**

```json
{
  "user": {
    "id": "<userId>",
    "email": "usuario@ejemplo.com",
    "displayName": "Nombre Usuario",
    "role": "user"
  }
}
```

Si el token es inválido o faltante → responder `401`.

---

### 3. `POST /api/Seguridad/RegistrarUsuario` *(opcional por ahora)*

**Descripción:** Registra un nuevo usuario.  
El SPA lo llama desde `JwtContext.js → signup()`.

**Body (JSON):**

```json
{
  "email": "nuevo@usuario.com",
  "password": "contraseña",
  "firstName": "Nombre",
  "lastName": "Apellido"
}
```

**Respuesta esperada:**

```json
{
  "accessToken": "<JWT>",
  "user": { ... }
}
```

---

## Resumen de cambios al `.env` del SPA

Una vez que el API implemente `/connect/token`, hay que actualizar el `.env` del SPA:

```dotenv
# Cambiar esto:
VITE_Authority = "https://localhost:5001"

# A esto (mismo host que el API):
VITE_Authority = "https://localhost:7159"
```

Con eso, el SPA hará `POST https://localhost:7159/connect/token` directamente al API.

---

## Flujo completo de autenticación (para referencia)

```
1. Usuario ingresa email + password en /auth/login
2. SPA → POST /connect/token (form-urlencoded)
3. API valida credenciales, retorna { access_token: "eyJ..." }
4. SPA guarda token en localStorage["accessToken"]
5. SPA navega a /resolver-contexto
6. En cada recarga: SPA lee localStorage["accessToken"], valida exp,
   luego llama GET /api/account/my-account para hidratar el usuario
7. Si cualquier paso falla → redirige a /auth/login
```

---

## Notas de implementación

- El JWT debe ser firmado con una clave secreta en el API (HS256 o RS256)
- El `exp` debe estar en segundos (Unix timestamp), no milisegundos
- CORS debe permitir `http://127.0.0.1:8090` (origen del SPA en desarrollo)
- El header `Authorization` **no lleva prefijo `Bearer`** — el SPA lo envía como el token puro
- Si se usa HTTPS con certificado auto-firmado en localhost, configurar `axios` para aceptarlo o usar HTTP en dev

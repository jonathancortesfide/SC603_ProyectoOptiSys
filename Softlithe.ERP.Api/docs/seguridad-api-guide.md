# Security Module — API Reference for UI Development

## Overview

This document is the **single source of truth** for all Security and User Management endpoints in the Softlithe ERP API.  
It is intended for consumption by a frontend AI agent or any frontend developer integrating with the security module.

---

## Base URL

```
http(s)://<host>/api
```

All requests and responses use **JSON (`application/json`)**.

---

## Global Response Conventions

### Write operations → `ModeloValidacion`

```json
{
  "mensaje": "string",
  "esCorrecto": true | false
}
```

- `esCorrecto: true` → operation succeeded.
- `esCorrecto: false` → business rule violation. Show `mensaje` to the user. HTTP status is still `200`.
- HTTP `400` → model validation failed (required field missing).
- HTTP `500` → unexpected server error.

### List queries → `<Entity>ConModeloDeValidacion`

```json
{
  "esCorrecto": true,
  "mensaje": "OK",
  "<dataKey>": [ ... ]
}
```

Always check `esCorrecto` before rendering the list.

### Single-object queries → `ModeloValidacionConDatos<T>`

```json
{
  "esCorrecto": true,
  "mensaje": "OK",
  "datos": { ... }
}
```

`datos` may be `null` if not found — check `esCorrecto` and `datos` before using.

### The `Usuario` field

Every write DTO includes a `Usuario` field. Pass the **username or email of the currently logged-in operator**. Used for audit logging. Required — never send an empty string.

### State management — NO deletes

The system **never deletes records**. To disable, call the corresponding `estado` endpoint with `EsActivo: false`. To re-enable, send `EsActivo: true`.

### Multi-company

Every record belongs to a company identified by `Identificador`. **All list queries require it.** Never call a list endpoint without it.

---

## Data Model Hierarchy

```
Seccion
 └── Modulo          (belongs to one Seccion)
      └── Permiso    (belongs to one Modulo; unique Codigo)

Rol
 └── Rol_Permiso     (Rol ↔ Permiso, many-to-many)

Usuario
 └── Usuario_Rol     (Usuario ↔ Rol, many-to-many)
```

**Typical setup flow:**
1. Create `Secciones`.
2. Create `Modulos` inside each section.
3. Create `Permisos` inside each module (use `SCREAMING_SNAKE_CASE` codes like `CREAR_FACTURA`).
4. Create `Roles`.
5. Assign `Permisos` to `Roles`.
6. Assign `Roles` to `Usuarios`.

---

## 1. Secciones

### `GET /api/Secciones`
Returns all sections.

**Response** — key: `secciones`
```json
{
  "esCorrecto": true,
  "mensaje": "OK",
  "secciones": [
    { "idSeccion": 1, "nombre": "Facturación", "activo": true }
  ]
}
```

---

### `POST /api/Secciones`
Creates a new section.

**Request**
```json
{ "nombre": "Facturación", "usuario": "admin@empresa.com" }
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `nombre` | string | ✅ | Must be unique (case-insensitive) |
| `usuario` | string | ✅ | Audit user |

**Response** → `ModeloValidacion`

---

### `POST /api/Secciones/estado`
Activates or inactivates a section.

**Request**
```json
{ "idSeccion": 1, "esActivo": false, "usuario": "admin@empresa.com" }
```

**Response** → `ModeloValidacion`

---

## 2. Módulos

### `GET /api/Modulos`
Returns all modules with their parent section name. Ordered by `nombreSeccion`, then `nombre`.

**Response** — key: `modulos`
```json
{
  "esCorrecto": true,
  "mensaje": "OK",
  "modulos": [
    {
      "idModulo": 1,
      "nombre": "Facturación Clientes",
      "descripcion": "Gestión de facturas para clientes",
      "idSeccion": 1,
      "nombreSeccion": "Facturación",
      "activo": true
    }
  ]
}
```

---

### `POST /api/Modulos`
Creates a new module.

**Request**
```json
{
  "nombre": "Facturación Clientes",
  "descripcion": "Gestión de facturas para clientes",
  "idSeccion": 1,
  "usuario": "admin@empresa.com"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `nombre` | string | ✅ | Unique within the same section |
| `descripcion` | string | ❌ | Optional |
| `idSeccion` | int | ✅ | Must exist |
| `usuario` | string | ✅ | Audit user |

**Response** → `ModeloValidacion`

---

### `POST /api/Modulos/estado`
```json
{ "idModulo": 1, "esActivo": false, "usuario": "admin@empresa.com" }
```
**Response** → `ModeloValidacion`

---

## 3. Permisos

### `GET /api/Permisos`
Returns all permissions with their parent module name. Ordered by `nombreModulo`, then `nombre`.

**Response** — key: `permisos`
```json
{
  "esCorrecto": true,
  "mensaje": "OK",
  "permisos": [
    {
      "idPermiso": 1,
      "nombre": "Crear Factura",
      "codigo": "CREAR_FACTURA",
      "descripcion": "Permite emitir facturas nuevas",
      "idModulo": 1,
      "nombreModulo": "Facturación Clientes",
      "activo": true
    }
  ]
}
```

---

### `POST /api/Permisos`
Creates a new permission.

**Request**
```json
{
  "nombre": "Crear Factura",
  "codigo": "CREAR_FACTURA",
  "descripcion": "Permite emitir facturas nuevas",
  "idModulo": 1,
  "usuario": "admin@empresa.com"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `nombre` | string | ✅ | |
| `codigo` | string | ✅ | Stored uppercase. Globally unique across all permissions. |
| `descripcion` | string | ❌ | Optional |
| `idModulo` | int | ✅ | Must exist |
| `usuario` | string | ✅ | Audit user |

**Response** → `ModeloValidacion`

---

### `POST /api/Permisos/estado`
```json
{ "idPermiso": 1, "esActivo": false, "usuario": "admin@empresa.com" }
```
**Response** → `ModeloValidacion`

---

## 4. Roles

### `GET /api/Roles`
Returns all roles.

**Response** — key: `roles`
```json
{
  "esCorrecto": true,
  "mensaje": "OK",
  "roles": [
    { "idRol": 1, "nombre": "Cajero", "descripcion": "Acceso a operaciones de caja", "activo": true }
  ]
}
```

---

### `POST /api/Roles`
Creates a new role.

**Request**
```json
{ "nombre": "Cajero", "descripcion": "Acceso a operaciones de caja", "usuario": "admin@empresa.com" }
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `nombre` | string | ✅ | Unique (case-insensitive) |
| `descripcion` | string | ❌ | Optional |
| `usuario` | string | ✅ | Audit user |

**Response** → `ModeloValidacion`

---

### `POST /api/Roles/estado`
```json
{ "idRol": 1, "esActivo": false, "usuario": "admin@empresa.com" }
```
**Response** → `ModeloValidacion`

---

## 5. Rol ↔ Permiso

### `GET /api/Roles/{idRol}/permisos`
Returns all permissions assigned to a role.

**URL param:** `idRol` — numeric role ID.

**Response** — key: `permisos`
```json
{
  "esCorrecto": true,
  "mensaje": "OK",
  "permisos": [
    {
      "idRolPermiso": 1,
      "idRol": 1,
      "nombreRol": "Cajero",
      "idPermiso": 3,
      "nombrePermiso": "Crear Factura",
      "codigoPermiso": "CREAR_FACTURA",
      "activo": true
    }
  ]
}
```

---

### `POST /api/Roles/permisos`
Assigns a permission to a role.

**Request**
```json
{ "idRol": 1, "idPermiso": 3, "usuario": "admin@empresa.com" }
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `idRol` | int | ✅ | Must exist |
| `idPermiso` | int | ✅ | Must exist |
| `usuario` | string | ✅ | Audit user |

Business rule: combination must not already be assigned.

**Response** → `ModeloValidacion`

---

### `POST /api/Roles/permisos/estado`
Activates or inactivates a role-permission assignment. Use `idRolPermiso` from the list above.

```json
{ "idRolPermiso": 1, "esActivo": false, "usuario": "admin@empresa.com" }
```
**Response** → `ModeloValidacion`

---

## 6. Usuarios — CRUD

### `POST /api/Usuario/ObtenerUsuario`
Lists users filtered by company branch, with optional name search.

**Request**
```json
{ "identificador": 2, "descripcion": "" }
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `identificador` | int | ✅ | Company/branch identifier |
| `descripcion` | string | ❌ | Partial name filter. Empty = return all users of that branch. |

**Response** — key: `listaUsuarios`
```json
{
  "esCorrecto": true,
  "mensaje": "OK",
  "listaUsuarios": [
    {
      "idUsuario": 12,
      "idIdentityServer": "abc-123",
      "identificador": 2,
      "nombre": "Juan Pérez",
      "esDoctor": false,
      "codigoProfesional": null,
      "email": "juan@empresa.com",
      "telefono": null,
      "direccion": null,
      "fechaNacimiento": null,
      "esActivo": true
    }
  ]
}
```

| Field | Type | Notes |
|---|---|---|
| `idUsuario` | int | Primary key — use in all subsequent calls |
| `idIdentityServer` | string | Identity provider external ID (e.g. Keycloak/Auth0 sub) |
| `identificador` | int | Company/branch |
| `nombre` | string | Full display name |
| `esDoctor` | bool? | Nullable. `true` if the user is a medical professional |
| `codigoProfesional` | string? | Medical license code, only relevant when `esDoctor = true` |
| `email` | string | Login email |
| `telefono` | string? | Optional |
| `direccion` | string? | Optional |
| `fechaNacimiento` | string? (ISO 8601) | Optional |
| `esActivo` | bool | Account state |

---

### `POST /api/Usuario/ObtenerUsuarioPorId`
Fetches a single user by numeric ID. Use to populate detail / edit panels.

**Request**
```json
{ "idUsuario": 12 }
```

**Response** — key: `datos` (`UsuarioDto` or `null`)
```json
{
  "esCorrecto": true,
  "mensaje": "OK",
  "datos": {
    "idUsuario": 12,
    "idIdentityServer": "abc-123",
    "identificador": 2,
    "nombre": "Juan Pérez",
    "esDoctor": false,
    "codigoProfesional": null,
    "email": "juan@empresa.com",
    "telefono": null,
    "direccion": null,
    "fechaNacimiento": null,
    "esActivo": true
  }
}
```

---

### `POST /api/Usuario/ObtenerUsuarioPorCorreo`
Fetches a single user by email. Use this right after OAuth login to resolve `idUsuario` from the identity token's `email` claim.

**Request**
```json
{ "email": "juan@empresa.com" }
```

**Response** — same shape as `ObtenerUsuarioPorId` (key: `datos`).

---

### `POST /api/Usuario/AgregarUsuario`
Creates a new user record (after the identity provider account already exists).

**Request**
```json
{
  "idIdentityServer": "abc-123",
  "identificador": 2,
  "nombre": "Juan Pérez",
  "esDoctor": false,
  "codigoProfesional": null,
  "email": "juan@empresa.com",
  "telefono": null,
  "direccion": null,
  "fechaNacimiento": null,
  "esActivo": true,
  "usuario": "admin@empresa.com"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `idIdentityServer` | string | ✅ | External identity provider sub/ID |
| `identificador` | int | ✅ | Company/branch |
| `nombre` | string | ✅ | |
| `esDoctor` | bool? | ❌ | |
| `codigoProfesional` | string? | ❌ | |
| `email` | string | ✅ | |
| `telefono` | string? | ❌ | |
| `direccion` | string? | ❌ | |
| `fechaNacimiento` | string? (ISO 8601) | ❌ | e.g. `"1990-05-15T00:00:00"` |
| `esActivo` | bool | ✅ | Default `true` |
| `usuario` | string | ✅ | Audit user |

**Response** → `ModeloValidacion`

---

### `POST /api/Usuario/ModificarUsuario`
Updates an existing user. Filtered only by `idUsuario` — `identificador` is not used in the WHERE clause.

**Request**
```json
{
  "idUsuario": 12,
  "idIdentityServer": "abc-123",
  "identificador": 2,
  "nombre": "Juan Pérez Actualizado",
  "esDoctor": false,
  "codigoProfesional": null,
  "email": "juan@empresa.com",
  "telefono": "8888-0000",
  "direccion": "San José, Costa Rica",
  "fechaNacimiento": "1990-05-15T00:00:00",
  "usuario": "admin@empresa.com"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `idUsuario` | int | ✅ | Record to update |
| `idIdentityServer` | string | ✅ | |
| `identificador` | int | ✅ | Stored for reference; not used in WHERE |
| `nombre` | string | ✅ | |
| `esDoctor` | bool? | ❌ | |
| `codigoProfesional` | string? | ❌ | |
| `email` | string | ✅ | |
| `telefono` | string? | ❌ | |
| `direccion` | string? | ❌ | |
| `fechaNacimiento` | string? (ISO 8601) | ❌ | |
| `usuario` | string | ✅ | Audit user |

**Response** → `ModeloValidacion`

---

### `POST /api/Usuario/ModificarEstadoUsuario`
Activates or inactivates a user account. Filtered only by `idUsuario`.

**Request**
```json
{
  "idUsuario": 12,
  "esActivo": false,
  "usuario": "admin@empresa.com",
  "identificador": 2
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `idUsuario` | int | ✅ | |
| `esActivo` | bool | ✅ | `false` = inactivate, `true` = reactivate |
| `usuario` | string | ✅ | Audit user |
| `identificador` | int | ✅ | Used for audit log only |

**Response** → `ModeloValidacion`

---

## 7. Usuario ↔ Rol

### `GET /api/usuarios/{idUsuario}/roles`
Returns all roles assigned to a user.

**URL param:** `idUsuario` — numeric user ID.

**Response** — key: `roles`
```json
{
  "esCorrecto": true,
  "mensaje": "OK",
  "roles": [
    {
      "idUsuarioRol": 5,
      "idUsuario": 12,
      "nombreUsuario": "Juan Pérez",
      "idRol": 1,
      "nombreRol": "Cajero",
      "activo": true
    }
  ]
}
```

---

### `POST /api/usuarios/{idUsuario}/roles`
Assigns a role to a user.

**URL param:** `idUsuario` — numeric user ID.  
The API sets `IdUsuario` from the URL. You may include it in the body or omit it — it will be overwritten.

**Request body**
```json
{ "idRol": 1, "usuario": "admin@empresa.com" }
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `idRol` | int | ✅ | Must exist |
| `usuario` | string | ✅ | Audit user |

Business rule: combination must not already be assigned.

**Response** → `ModeloValidacion`

---

### `POST /api/usuarios/{idUsuario}/roles/estado`
Activates or inactivates a user-role assignment. Use `idUsuarioRol` from the list above.

```json
{ "idUsuarioRol": 5, "esActivo": false, "usuario": "admin@empresa.com" }
```
**Response** → `ModeloValidacion`

---

### `GET /api/usuarios/{idUsuario}/roles/permisos`
Returns all **effective permissions** for a user — aggregated across all their active roles.  
Only returns permissions that are active AND belong to active roles.

**URL param:** `idUsuario` — numeric user ID.

**Response** — key: `permisos`
```json
{
  "esCorrecto": true,
  "mensaje": "OK",
  "permisos": [
    {
      "idPermiso": 3,
      "nombrePermiso": "Crear Factura",
      "codigoPermiso": "CREAR_FACTURA",
      "descripcionPermiso": "Permite emitir facturas nuevas",
      "idModulo": 1,
      "nombreModulo": "Facturación Clientes",
      "idSeccion": 1,
      "nombreSeccion": "Facturación",
      "idRol": 1,
      "nombreRol": "Cajero"
    }
  ]
}
```

| Field | Type | Notes |
|---|---|---|
| `codigoPermiso` | string | **Use this in permission guards** — unique SCREAMING_SNAKE_CASE code |
| `nombreSeccion` / `nombreModulo` | string | Useful for grouping permissions in a UI tree |
| `nombreRol` | string | Shows which role granted this permission |

> **This is the key endpoint for permission guards.** After login, call this and store all `codigoPermiso` values in a Set. Use that Set throughout the UI to show/hide/enable controls.

---

## 8. Permission Guard — Recommended Pattern

```
1. After OAuth login, extract email from the identity token.
2. POST /api/Usuario/ObtenerUsuarioPorCorreo  →  resolve idUsuario
3. GET  /api/usuarios/{idUsuario}/roles/permisos  →  load effective permissions
4. Store Set<string> permissionCodes in global auth state.
```

Gate UI elements:

```ts
const canCreate = permissionCodes.has('CREAR_FACTURA');
// hide or disable the button if !canCreate
```

Refresh after any role assignment change.

---

## 9. Role-Assignment UI Flow

Recommended flow when building the "Assign Roles to User" screen:

```
1. POST /api/Usuario/ObtenerUsuario  (filter by identificador)
   → pick a user from the list

2. GET /api/Roles
   → show available roles in a multi-select or checkboxes

3. GET /api/usuarios/{idUsuario}/roles
   → mark already-assigned roles

4. POST /api/usuarios/{idUsuario}/roles
   → assign selected role

5. POST /api/usuarios/{idUsuario}/roles/estado  (esActivo: false)
   → remove/inactivate a previously assigned role
```

---

## Error Handling Checklist

| Scenario | What to do |
|---|---|
| `esCorrecto: false` | Show `mensaje` as a user-facing warning/toast |
| `datos: null` + `esCorrecto: true` | Record not found — show not-found state |
| HTTP `400` | Validation failed — check all required fields |
| HTTP `500` | Show generic error, log details to console |
| Empty list + `esCorrecto: true` | Show empty-state UI — this is not an error |

---

## Quick Reference Table

| Entity | Query | Create / Assign | Toggle state |
|---|---|---|---|
| Sección | `GET /api/Secciones` | `POST /api/Secciones` | `POST /api/Secciones/estado` |
| Módulo | `GET /api/Modulos` | `POST /api/Modulos` | `POST /api/Modulos/estado` |
| Permiso | `GET /api/Permisos` | `POST /api/Permisos` | `POST /api/Permisos/estado` |
| Rol | `GET /api/Roles` | `POST /api/Roles` | `POST /api/Roles/estado` |
| Rol → Permisos | `GET /api/Roles/{idRol}/permisos` | `POST /api/Roles/permisos` | `POST /api/Roles/permisos/estado` |
| Listar usuarios | `POST /api/Usuario/ObtenerUsuario` | `POST /api/Usuario/AgregarUsuario` | `POST /api/Usuario/ModificarEstadoUsuario` |
| Usuario por ID | `POST /api/Usuario/ObtenerUsuarioPorId` | — | — |
| Usuario por correo | `POST /api/Usuario/ObtenerUsuarioPorCorreo` | — | — |
| Editar usuario | — | `POST /api/Usuario/ModificarUsuario` | — |
| Usuario → Roles | `GET /api/usuarios/{idUsuario}/roles` | `POST /api/usuarios/{idUsuario}/roles` | `POST /api/usuarios/{idUsuario}/roles/estado` |
| Permisos efectivos | `GET /api/usuarios/{idUsuario}/roles/permisos` | — | — |


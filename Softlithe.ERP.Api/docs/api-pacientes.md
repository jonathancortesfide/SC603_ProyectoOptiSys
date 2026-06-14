# API Reference — Módulo Pacientes

**Base URL:** `https://localhost:7159/api/Paciente`  
**Content-Type:** `application/json`  
**Auth header:** `Authorization: <token>` _(sin prefijo Bearer)_

---

## Tipos compartidos

### `ModeloValidacion` — respuesta base de comandos

```json
{
  "mensaje": "string",
  "esCorrecto": true
}
```

### `PacienteDto` — modelo completo de paciente

```json
{
  "noPaciente":                   0,                      // int    — 0 en crear, requerido en editar
  "identificador":                1,                      // int    — REQUERIDO (empresa/sucursal)
  "cedula":                       "string",               // string — REQUERIDO
  "nombre":                       "string",               // string — REQUERIDO
  "usuario":                      "string",               // string — REQUERIDO (email del usuario logueado)
  "tipoIdentificacion":           "string",               // opcional: "01"=cédula | "02"=dimex | "03"=pasaporte
  "direccion":                    "string",               // opcional
  "fechaNacimiento":              "2000-01-01T00:00:00",  // opcional — ISO 8601
  "email":                        "string",               // opcional
  "telefono1":                    "string",               // opcional
  "sexo":                         "string",               // opcional: "M" | "F"
  "nombreContactoEmergencia":     "string",               // opcional
  "telefonoContactoEmergencia":   "string",               // opcional
  "activo":                       true,                   // bool   — default true en crear
  "sinIdentificacion":            false,                  // bool   — default false
  "plazo":                        null,                   // int?   — opcional
  "limiteCredito":                null,                   // double? — opcional
  "fechaRegistro":                null,                   // datetime? — opcional, se autogenera si null
  "esEmpadronado":                null,                   // bool?  — IGNORADO, no se usa
  "email2":                       null,                   // string? — IGNORADO
  "telefono2":                    null,                   // string? — IGNORADO
  "codigoActividad":              null,                   // string? — IGNORADO
  "nombreActividadEconomica":     null                    // string? — solo lectura en consultas
}
```

---

## Endpoints

### 1. Listar pacientes

```
POST /api/Paciente/ObtenerPaciente
```

**Request:**

```json
{
  "identificador": 1,
  "textoBusqueda": "García"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `identificador` | `int` | ✅ | ID de empresa/sucursal |
| `textoBusqueda` | `string` | ❌ | Filtro parcial por nombre o cédula. Vacío = todos |

**Response:**

```json
{
  "mensaje": "string",
  "esCorrecto": true,
  "laListaDePacientes": [ /* array de PacienteDto */ ]
}
```

---

### 2. Obtener paciente por ID

```
POST /api/Paciente/ObtenerPacientePorId
```

**Request:**

```json
{
  "noPaciente": 42
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `noPaciente` | `int` | ✅ | ID del paciente |

**Response:**

```json
{
  "mensaje": "string",
  "esCorrecto": true,
  "paciente": { /* PacienteDto o null si no existe */ }
}
```

---

### 3. Crear paciente

```
POST /api/Paciente/AgregarPaciente
```

**Request:** `PacienteDto` con `noPaciente = 0`

```json
{
  "noPaciente": 0,
  "identificador": 1,
  "cedula": "123456789",
  "nombre": "Juan Pérez",
  "usuario": "admin@vision.com"
}
```

| Campo | Tipo | Requerido |
|---|---|---|
| `noPaciente` | `int` | ✅ debe ser `0` |
| `identificador` | `int` | ✅ |
| `cedula` | `string` | ✅ |
| `nombre` | `string` | ✅ |
| `usuario` | `string` | ✅ |
| resto de campos | — | ❌ todos opcionales |

**Response:** `ModeloValidacion`

```json
{ "mensaje": "Paciente agregado correctamente.", "esCorrecto": true }
```

---

### 4. Editar paciente

```
POST /api/Paciente/ModificarPaciente
```

**Request:** `PacienteDto` con `noPaciente` del registro existente

```json
{
  "noPaciente": 42,
  "identificador": 1,
  "cedula": "123456789",
  "nombre": "Juan Pérez Actualizado",
  "usuario": "admin@vision.com"
}
```

| Campo | Tipo | Requerido |
|---|---|---|
| `noPaciente` | `int` | ✅ debe ser > 0 |
| `identificador` | `int` | ✅ |
| `cedula` | `string` | ✅ |
| `nombre` | `string` | ✅ |
| `usuario` | `string` | ✅ |
| resto de campos | — | ❌ todos opcionales |

**Response:** `ModeloValidacion`

---

### 5. Activar / Inactivar paciente

```
POST /api/Paciente/ModificarEstadoPaciente
```

**Request:**

```json
{
  "noPaciente":    42,
  "identificador": 1,
  "esActivo":      false,
  "usuario":       "admin@vision.com"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `noPaciente` | `int` | ✅ | ID del paciente |
| `identificador` | `int` | ✅ | ID de empresa/sucursal |
| `esActivo` | `bool` | ✅ | `true` = activar, `false` = inactivar |
| `usuario` | `string` | ✅ | Email del usuario logueado |

**Response:** `ModeloValidacion`

---

## Reglas de negocio

| Regla | Detalle |
|---|---|
| **No hay DELETE** | Solo `ModificarEstadoPaciente` con `esActivo: false` para inactivar |
| **`identificador`** | Siempre requerido — identifica la empresa/sucursal del sistema multi-tenant |
| **`usuario`** | Siempre el email del usuario autenticado en sesión |
| **Campos ignorados** | `email2`, `telefono2`, `codigoActividad`, `esEmpadronado` — enviar `null`, no se validan ni persisten |
| **`noPaciente`** | `0` en crear, ID real en editar y cambiar estado |
| **Búsqueda** | `textoBusqueda` filtra por nombre **O** cédula (LIKE `%valor%`) |
| **Sin padrón** | No se consume ningún servicio de empadronamiento externo |

---

## Flujo típico de pantalla

```
1. Cargar lista    →  POST /ObtenerPaciente        { identificador, textoBusqueda: "" }
2. Buscar          →  POST /ObtenerPaciente        { identificador, textoBusqueda: "texto" }
3. Ver detalle     →  POST /ObtenerPacientePorId   { noPaciente }
4. Crear           →  POST /AgregarPaciente        { noPaciente:0, identificador, cedula, nombre, usuario }
5. Editar          →  POST /ModificarPaciente      { noPaciente, identificador, cedula, nombre, usuario, ...resto }
6. Inactivar       →  POST /ModificarEstadoPaciente { noPaciente, identificador, esActivo:false, usuario }
7. Reactivar       →  POST /ModificarEstadoPaciente { noPaciente, identificador, esActivo:true,  usuario }
```

---

## Errores comunes

| HTTP | `esCorrecto` | Causa |
|---|---|---|
| `200` | `false` | Validación fallida — leer `mensaje` para el detalle |
| `400` | — | Body inválido o campo requerido faltante |
| `401` | — | Token ausente, expirado o inválido |
| `200` | `true` | Operación exitosa |

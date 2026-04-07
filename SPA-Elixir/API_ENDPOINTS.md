# LENSYS – API Endpoints Requeridos

Este documento describe todos los endpoints que la SPA necesita para funcionar completamente.  
Los módulos de **Mantenimientos** ya están conectados a la API. Los módulos pendientes son: **Pacientes**, **Productos**, **Seguridad** y **Examenes**.

---

## Convención de Respuesta

Todas las operaciones de escritura (POST, PUT, DELETE) deben responder con el siguiente envelope:

```json
{
  "EsCorrecto": true,
  "Mensaje": "Descripción del resultado.",
  "Data": {}
}
```

Los endpoints de listado (`GET` que retornan colecciones) devuelven el arreglo directamente, sin envelope.

---

## Esquema de Base de Datos Sugerido

### Tablas ya existentes (referencia)

```sql
-- Moneda, GrupoProductos, TipoLente, ClasificacionPaciente, ListaPrecio
-- Ver script original del esquema.
```

### Nuevas tablas necesarias

```sql
-- ============================================================
-- PACIENTES
-- ============================================================

CREATE TABLE Paciente (
    no_paciente                     INT PRIMARY KEY IDENTITY(1,1),
    no_empresa                      INT NOT NULL,
    tipo_identificacion             VARCHAR(20),
    identificacion                  VARCHAR(50) NOT NULL,
    cedula                          VARCHAR(50),
    nombre                          NVARCHAR(200) NOT NULL,
    nombre_comercial                NVARCHAR(200),
    direccion                       NVARCHAR(400),
    fecha_nacimiento                DATE,
    sexo                            VARCHAR(10),
    telefono1                       VARCHAR(30),
    telefono2                       VARCHAR(30),
    email1                          VARCHAR(150),
    email2                          VARCHAR(150),
    nacionalidad                    VARCHAR(100),
    es_empadronado                  BIT DEFAULT 0,
    no_envia_factura_electronica    BIT DEFAULT 0,
    codigo_actividad_economica      VARCHAR(20),
    nombre_actividad_economica      NVARCHAR(150),
    es_validado_hacienda            BIT DEFAULT 0,
    contacto_emergencia_nombre      NVARCHAR(200),
    contacto_emergencia_telefono    VARCHAR(30),
    no_lista_precio                 INT REFERENCES ListaPrecio(no_lista),
    no_clasificacion                INT REFERENCES ClasificacionPaciente(no_clasificacion),
    observaciones                   NVARCHAR(1000),
    plazo                           INT DEFAULT 0,
    limite_credito                  DECIMAL(18,2) DEFAULT 0,
    bloqueo_facturas_credito        BIT DEFAULT 0,
    bloqueo_facturas_contado        BIT DEFAULT 0,
    permitir_facturas_saldo_vencido BIT DEFAULT 0,
    envia_cumpleanos                BIT DEFAULT 0,
    formato_factura_especial        BIT DEFAULT 0,
    es_activo                       BIT DEFAULT 1,
    fecha_creacion                  DATETIME DEFAULT GETDATE(),
    fecha_modificacion              DATETIME NULL
);

CREATE TABLE CuentaPaciente (
    no_cuenta       INT PRIMARY KEY IDENTITY(1,1),
    no_paciente     INT NOT NULL REFERENCES Paciente(no_paciente),
    no_moneda       INT NOT NULL REFERENCES Moneda(no_moneda),
    saldo           DECIMAL(18,2) DEFAULT 0,
    es_nacional     BIT DEFAULT 0,
    fecha_creacion  DATETIME DEFAULT GETDATE()
);

-- ============================================================
-- PRODUCTOS
-- ============================================================

CREATE TABLE Producto (
    no_producto                 INT PRIMARY KEY IDENTITY(1,1),
    no_empresa                  INT NOT NULL,
    tipo_articulo               VARCHAR(30) NOT NULL,    -- 'Material', 'Servicio', 'Servicio-Externo'
    tipo_impuesto               VARCHAR(30) NOT NULL,    -- 'Exento', 'IVA', 'Otro'
    porcentaje_impuesto         DECIMAL(5,2) DEFAULT 0,
    codigo_interno              VARCHAR(50) NOT NULL,
    codigo_barras               VARCHAR(100),
    codigo_auxiliar             VARCHAR(100),
    nombre                      NVARCHAR(200) NOT NULL,
    codigo_cabys                VARCHAR(20),
    es_activo                   BIT DEFAULT 1,
    unidad_medida               VARCHAR(30),
    no_grupo                    INT REFERENCES GrupoProductos(no_grupo),
    no_marca                    INT,                    -- FK a tabla Marca
    no_tipo_lente               INT REFERENCES TipoLente(no_tipo),
    existencia                  DECIMAL(18,4) DEFAULT 0,
    caracteristicas             NVARCHAR(1000),
    foto                        NVARCHAR(MAX),          -- base64
    minimo                      DECIMAL(18,4) DEFAULT 0,
    es_perecedero               BIT DEFAULT 0,
    costo_promedio_ponderado    DECIMAL(18,4) DEFAULT 0,
    costo_ultima_compra         DECIMAL(18,4) DEFAULT 0,
    costo_final                 DECIMAL(18,4) DEFAULT 0,
    fecha_creacion              DATETIME DEFAULT GETDATE(),
    fecha_modificacion          DATETIME NULL
);

CREATE TABLE ProductoListaPrecio (
    no_producto_lista   INT PRIMARY KEY IDENTITY(1,1),
    no_producto         INT NOT NULL REFERENCES Producto(no_producto),
    no_lista            INT NOT NULL REFERENCES ListaPrecio(no_lista),
    utilidad            DECIMAL(5,2) DEFAULT 0,
    precio_neto         DECIMAL(18,4) DEFAULT 0,
    precio_cliente      DECIMAL(18,4) DEFAULT 0
);

-- ============================================================
-- SEGURIDAD
-- ============================================================

CREATE TABLE Usuario (
    id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    login               VARCHAR(100) NOT NULL UNIQUE,
    email               VARCHAR(150) NOT NULL UNIQUE,
    contrasena_hash     NVARCHAR(500) NOT NULL,
    nombre              NVARCHAR(200) NOT NULL,
    es_doctor           BIT DEFAULT 0,
    codigo_profesional  VARCHAR(50),
    telefono            VARCHAR(30),
    direccion           NVARCHAR(400),
    fecha_nacimiento    DATE,
    es_activo           BIT DEFAULT 1,
    fecha_creacion      DATETIME DEFAULT GETDATE(),
    fecha_modificacion  DATETIME NULL
);

CREATE TABLE Modulo (
    id      UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    nombre  NVARCHAR(100) NOT NULL
);

CREATE TABLE Permiso (
    id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    nombre      NVARCHAR(150) NOT NULL,
    descripcion NVARCHAR(300),
    accion      VARCHAR(50),    -- 'crear', 'editar', 'eliminar', 'ver'
    no_modulo   UNIQUEIDENTIFIER NOT NULL REFERENCES Modulo(id)
);

CREATE TABLE Rol (
    id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    nombre      NVARCHAR(100) NOT NULL,
    descripcion NVARCHAR(300)
);

CREATE TABLE RolPermiso (
    id_rol      UNIQUEIDENTIFIER NOT NULL REFERENCES Rol(id),
    id_permiso  UNIQUEIDENTIFIER NOT NULL REFERENCES Permiso(id),
    PRIMARY KEY (id_rol, id_permiso)
);

CREATE TABLE UsuarioRol (
    id_usuario  UNIQUEIDENTIFIER NOT NULL REFERENCES Usuario(id),
    id_rol      UNIQUEIDENTIFIER NOT NULL REFERENCES Rol(id),
    PRIMARY KEY (id_usuario, id_rol)
);

-- ============================================================
-- EXAMENES
-- ============================================================

CREATE TABLE Examen (
    no_examen               INT PRIMARY KEY IDENTITY(1,1),
    no_empresa              INT NOT NULL,
    no_paciente             INT NOT NULL REFERENCES Paciente(no_paciente),
    fecha_examen            DATE NOT NULL,
    motivo                  NVARCHAR(700),
    tipo_examen             VARCHAR(50),
    dp_general              NVARCHAR(200),
    medio_transporte        NVARCHAR(200),
    fo                      NVARCHAR(200),
    pio                     NVARCHAR(200),
    ultimo_examen           DATE,
    tratamiento_anterior    NVARCHAR(500),
    tipo_patologias         NVARCHAR(500),
    xml_graduaciones        NVARCHAR(MAX),  -- tablas RX serializadas
    xml_disenos             NVARCHAR(MAX),  -- diseño de lente serializado
    codigo_aro              VARCHAR(50),
    codigo_examen           VARCHAR(50),
    codigo_profesional      VARCHAR(50),
    nombre_profesional      NVARCHAR(200),
    costo_aro               DECIMAL(18,2) DEFAULT 0,
    costo_lente             DECIMAL(18,2) DEFAULT 0,
    costo_material          DECIMAL(18,2) DEFAULT 0,
    costo_examen            DECIMAL(18,2) DEFAULT 0,
    tratamientos_costo      DECIMAL(18,2) DEFAULT 0,
    precio_final            DECIMAL(18,2) DEFAULT 0,
    fecha_creacion          DATETIME DEFAULT GETDATE(),
    fecha_modificacion      DATETIME NULL
);
```

---

## 1. Pacientes

### `GET /Pacientes`
Retorna todos los pacientes.

**Response:**
```json
[
  {
    "numeroDePaciente": 1,
    "tipoIdentificacion": "Cédula",
    "identificacion": "1-2345-6789",
    "cedula": "1-2345-6789",
    "nombre": "Juan Pérez",
    "nombreComercial": "",
    "direccion": "San José, Costa Rica",
    "fechaNacimiento": "1990-05-15",
    "sexo": "M",
    "telefono1": "8888-0000",
    "telefono2": null,
    "email1": "juan@example.com",
    "email2": null,
    "nacionalidad": "Costarricense",
    "esEmpadronado": true,
    "noEnviaFacturaElectronica": false,
    "codigoActividadEconomica": "4771",
    "nombreActividadEconomica": "Comercio al por menor",
    "esValidadoHacienda": false,
    "contactoEmergenciaNombre": "María Pérez",
    "contactoEmergenciaTelefono": "7777-0000",
    "listaPrecio": "Lista Estándar",
    "clasificacion": "A",
    "esActivo": true,
    "observaciones": "",
    "plazo": 30,
    "limiteCredito": 500000.00,
    "bloqueoFacturasCredito": false,
    "bloqueoFacturasContado": false,
    "permitirFacturasSaldoVencido": true,
    "enviaCumpleanos": true,
    "formatoFacturaEspecial": false
  }
]
```

---

### `GET /Pacientes/BuscarPacientePorNombreOIdentificacion?parametroDeBusqueda={value}`
Busca pacientes por nombre o número de identificación. Retorna el mismo arreglo que `GET /Pacientes` pero filtrado.

> **Campos mínimos requeridos** en la respuesta: `numeroDePaciente`, `cedula`, `nombre`, `email1` (la SPA lo mapea como `email` en el dropdown de búsqueda).

---

### `POST /Pacientes/AgregarPaciente`
Crea un nuevo paciente.

**Request body:** Mismo shape que el objeto retornado por `GET /Pacientes`, sin `numeroDePaciente`.

**Response:**
```json
{ "EsCorrecto": true, "Mensaje": "Paciente creado correctamente.", "Data": { "numeroDePaciente": 15 } }
```

---

### `PUT /Pacientes/{numeroDePaciente}` *(pendiente de implementar en la SPA)*
Actualiza los datos de un paciente existente.

**Request body:** Mismo shape que POST.

**Response:**
```json
{ "EsCorrecto": true, "Mensaje": "Paciente actualizado." }
```

---

### `GET /Pacientes/Cuentas?pacienteId={id}`
Retorna las cuentas por moneda de un paciente, incluyendo sus facturas y créditos.

**Response:**
```json
[
  {
    "moneda": "CRC",
    "esNacional": true,
    "saldo": 125000.00,
    "facturas": [
      {
        "noFactura": "001-01234",
        "noExamen": 7,
        "fecha": "2025-11-15",
        "tipo": "Contado",
        "moneda": "CRC",
        "monto": 75000.00,
        "saldo": 0.00
      }
    ],
    "creditos": [
      {
        "noDocumento": "NC-00023",
        "fecha": "2025-11-16",
        "tipoDocumento": "Nota de Crédito",
        "moneda": "CRC",
        "monto": 5000.00,
        "saldo": 5000.00
      }
    ]
  }
]
```

---

## 2. Productos

### `GET /productos/`
Retorna todos los productos.

**Response:**
```json
[
  {
    "id": 1,
    "tipoArticulo": "Material",
    "tipoImpuesto": "IVA",
    "porcentajeImpuesto": 13.00,
    "codigoInterno": "ARO-001",
    "codigoBarras": "7501234567890",
    "codigoAuxiliar": "AUX-001",
    "nombre": "Aro Ray-Ban RB2140",
    "codigoCabys": "49151101",
    "esActivo": true,
    "unidadMedida": "Unidad",
    "grupo": "Aros",
    "marca": "Ray-Ban",
    "tipoLente": null,
    "existencia": 12.0,
    "caracteristicas": "Color negro, redondo",
    "foto": null,
    "minimo": 2.0,
    "esPerecedero": false,
    "costoPromedioPonderado": 15000.00,
    "costoUltimaCompra": 14500.00,
    "costoFinal": 15000.00,
    "listasPrecios": [
      {
        "nombre": "Lista Estándar",
        "utilidad": 40.00,
        "precioNeto": 21000.00,
        "precioCliente": 23730.00
      }
    ]
  }
]
```

---

### `POST /productos/`
Crea o actualiza un producto.

**Request body:** Mismo shape que el objeto de `GET /productos/`, sin `id`.

**Response:**
```json
{ "EsCorrecto": true, "Mensaje": "Producto guardado.", "Data": { "id": 5 } }
```

---

### `DELETE /productos/{id}`
Elimina un producto.

**Response:**
```json
{ "EsCorrecto": true, "Mensaje": "Producto eliminado." }
```

---

## 3. Seguridad

### 3.1 Usuarios

#### `GET /usuarios/`
Retorna todos los usuarios.

**Response:**
```json
[
  {
    "id": "a1b2c3d4-0000-0000-0000-000000000000",
    "login": "jperez",
    "email": "jperez@empresa.com",
    "nombre": "Juan Pérez",
    "esDoctor": true,
    "codigoProfesional": "MO-12345",
    "telefono": "8888-0000",
    "direccion": "San José",
    "fechaNacimiento": "1985-03-20",
    "esActivo": true
  }
]
```

---

#### `GET /usuarios/{id}`
Retorna un solo usuario (mismo shape que el elemento del listado).

---

#### `GET /usuarios/buscar/?parametro={value}`
Busca usuarios por nombre, login o email. Retorna arreglo filtrado (mismo shape).

---

#### `POST /usuarios/`
Crea un nuevo usuario.

**Request body:**
```json
{
  "login": "jperez",
  "email": "jperez@empresa.com",
  "contrasena": "secret123",
  "nombre": "Juan Pérez",
  "esDoctor": true,
  "codigoProfesional": "MO-12345",
  "telefono": "8888-0000",
  "direccion": "San José",
  "fechaNacimiento": "1985-03-20",
  "esActivo": true
}
```

**Response:**
```json
{ "EsCorrecto": true, "Mensaje": "Usuario creado.", "Data": { "id": "a1b2c3d4-..." } }
```

---

#### `PUT /usuarios/{id}`
Actualiza un usuario existente. El body es igual al de POST pero **sin `contrasena`** y **sin `login`**.

**Response:**
```json
{ "EsCorrecto": true, "Mensaje": "Usuario actualizado.", "Data": { ...usuarioObject } }
```

---

#### `POST /usuarios/cambiar-contrasena/{id}`
Cambia la contraseña de un usuario.

**Request body:**
```json
{ "contrasenaActual": "old123", "contrasenaNueva": "new456" }
```

**Response:**
```json
{ "EsCorrecto": true, "Mensaje": "Contraseña actualizada." }
```

---

#### `DELETE /usuarios/{id}`
Elimina un usuario.

**Response:**
```json
{ "EsCorrecto": true, "Mensaje": "Usuario eliminado." }
```

---

### 3.2 Permisos

#### `GET /permisos/`
Retorna todos los permisos disponibles, agrupables por módulo.

**Response:**
```json
[
  {
    "id": "p1-uuid",
    "nombre": "Ver Pacientes",
    "descripcion": "Permite ver el listado de pacientes",
    "accion": "ver",
    "moduloId": "m1-uuid",
    "moduloNombre": "Pacientes"
  }
]
```

---

### 3.3 Roles

#### `GET /roles/`
Retorna todos los roles con sus permisos incluidos.

**Response:**
```json
[
  {
    "id": "r1-uuid",
    "nombre": "Recepcionista",
    "descripcion": "Acceso a pacientes y examenes",
    "permisos": [
      {
        "id": "p1-uuid",
        "nombre": "Ver Pacientes",
        "descripcion": "Permite ver el listado de pacientes",
        "accion": "ver",
        "moduloId": "m1-uuid",
        "moduloNombre": "Pacientes"
      }
    ]
  }
]
```

---

#### `GET /roles/{id}`
Retorna un solo rol (mismo shape que el elemento del listado).

---

#### `POST /roles/`
Crea un nuevo rol.

**Request body:**
```json
{ "nombre": "Recepcionista", "descripcion": "Acceso básico", "permisos": ["p1-uuid", "p2-uuid"] }
```

**Response:**
```json
{ "EsCorrecto": true, "Mensaje": "Rol creado.", "Data": { ...rolObject } }
```

---

#### `PUT /roles/{id}`
Actualiza un rol. Body idéntico al de POST.

**Response:**
```json
{ "EsCorrecto": true, "Mensaje": "Rol actualizado.", "Data": { ...rolObject } }
```

---

#### `DELETE /roles/{id}`
Elimina un rol.

**Response:**
```json
{ "EsCorrecto": true, "Mensaje": "Rol eliminado." }
```

---

### 3.4 Asignación de Roles a Usuarios

#### `GET /usuarios-roles/usuario/{usuarioId}`
Retorna los roles asignados a un usuario.

**Response:**
```json
[
  { "id": "r1-uuid", "nombre": "Recepcionista", "descripcion": "Acceso básico" }
]
```

---

#### `POST /usuarios-roles/asignar/`
Asigna un rol a un usuario.

**Request body:**
```json
{ "usuarioId": "u1-uuid", "rolId": "r1-uuid" }
```

**Response:**
```json
{ "EsCorrecto": true, "Mensaje": "Rol asignado." }
```

---

#### `POST /usuarios-roles/desvincular/`
Desvincula un rol de un usuario.

**Request body:**
```json
{ "usuarioId": "u1-uuid", "rolId": "r1-uuid" }
```

**Response:**
```json
{ "EsCorrecto": true, "Mensaje": "Rol desvinculado." }
```

---

## 4. Examenes

### `POST /Examenes/AgregarExamen`
Crea un nuevo examen.

**Request body:**
```json
{
  "NoPaciente": 1,
  "FechaExamen": "2026-04-07",
  "Motivo": "Control anual",
  "TipoExamen": "Refracción",
  "DpGeneral": "",
  "MedioTransp": "",
  "Fo": "",
  "Pio": "",
  "UltimoExamen": "2025-04-01",
  "TratamientoAnterior": "",
  "TipoPatologias": "",
  "XmlGraduaciones": "<rx>...</rx>",
  "XmlDisenos": "<diseno>...</diseno>",
  "CodigoAro": "ARO-001",
  "CodigoExamen": "",
  "CodigoProfesional": "MO-12345",
  "NombreProfesional": "Dra. Pérez",
  "RxBase": {
    "OD": { "Esfera": -1.75, "Cilindro": -0.5, "Eje": 90, "Adiccion": null, "DNP": 32.0, "AVC": "20/20", "AVL": null, "Altura": null, "Base": null, "Prisma": null, "CB": null, "Diam": null, "AVSC": null, "PIO": null, "LH": null },
    "OI": { "Esfera": -2.0, "Cilindro": -0.25, "Eje": 85, "Adiccion": null, "DNP": 31.5, "AVC": "20/20", "AVL": null, "Altura": null, "Base": null, "Prisma": null, "CB": null, "Diam": null, "AVSC": null, "PIO": null, "LH": null },
    "observaciones": ""
  },
  "RxActual": {
    "OD": { "Esfera": -1.5, "Cilindro": -0.5, "Eje": 90, "Adiccion": null, "DNP": 32.0, "AVC": "20/25", "AVL": null, "Altura": null, "Base": null, "Prisma": null, "CB": null, "Diam": null, "AVSC": null, "PIO": null, "LH": null },
    "OI": {},
    "observaciones": ""
  },
  "RxCerca": {
    "OD": { "Esfera": 1.0, "Cilindro": 0, "Eje": 0, "DNP": 31.0, "AVC": "J1" },
    "OI": { "Esfera": 1.0, "Cilindro": 0, "Eje": 0, "DNP": 30.5, "AVC": "J1" },
    "observaciones": ""
  },
  "RxContacto": {
    "OD": { "Esfera": -1.75, "Cilindro": -0.25, "Eje": 90, "Adiccion": null },
    "OI": { "Esfera": -2.0, "Cilindro": 0, "Eje": 0, "Adiccion": null },
    "observaciones": ""
  },
  "observacionesGenerales": "",
  "CostoAro": 25000.00,
  "CostoLente": 18000.00,
  "CostoMaterial": 0.00,
  "CostoExamen": 15000.00,
  "TratamientosCosto": 0.00,
  "PrecioFinal": 58000.00
}
```

**Response:**
```json
{ "EsCorrecto": true, "Mensaje": "Examen guardado.", "Data": { "NoExamen": 42 } }
```

---

### `GET /Examenes?NoPaciente={id}` *(endpoint faltante — requerido por ConsultaExamenVista)*
Retorna todos los exámenes. Si se provee `NoPaciente`, filtra por paciente.

**Response:**
```json
[
  {
    "NoExamen": 1,
    "NoPaciente": 7,
    "FechaExamen": "2025-11-15",
    "Motivo": "Control anual",
    "CodigoProfesional": "MO-12345",
    "NombreProfesional": "Dra. Pérez",
    "RxBase":    { "OD": {}, "OI": {}, "observaciones": "" },
    "RxActual":  { "OD": {}, "OI": {}, "observaciones": "" },
    "RxCerca":   { "OD": {}, "OI": {}, "observaciones": "" },
    "RxContacto":{ "OD": {}, "OI": {}, "observaciones": "" },
    "DisenoDeLente": {
      "tipoLente": "Bifocal",
      "material": { "id": 1, "label": "CR-39" },
      "aroSeleccionado": { "id": 1, "sku": "ARO-001", "name": "Ray-Ban RB2140", "price": 25000 },
      "laboratorioSeleccionado": { "id": 1, "name": "Óptica Central" },
      "numeroOrden": "ORD-001",
      "numeroPedido": "PED-001"
    },
    "CostoAro": 25000.00,
    "CostoLente": 18000.00,
    "CostoMaterial": 0.00,
    "CostoExamen": 15000.00,
    "TratamientosCosto": 0.00,
    "PrecioFinal": 58000.00
  }
]
```

---

## 5. Endpoints de Catálogo / Lookup

Estos son usados en dropdowns a lo largo de los formularios de pacientes y productos.

| Endpoint | Usado en | Response esperado |
|---|---|---|
| `GET /Moneda/` | Selector de moneda en CuentasTab, ListaPrecio | `[{ id, codigoIso, descripcion, simbolo, esNacional }]` |
| `GET /Moneda/Nacional` | Moneda nacional por defecto en CuentasTab | `{ id, codigoIso, descripcion, simbolo }` |
| `GET /ClasificacionPaciente/` | Selector de clasificación en InformaciónAdicional del paciente | `[{ id, descripcion, porcentajeDescuento }]` |
| `GET /ListaPrecio/` | Selector de lista de precios en InformaciónAdicional del paciente | `[{ id, nombre }]` *(ya implementado)* |
| `GET /TipoLente/` | Selector de tipo de lente en FormularioProducto (solo si tipoArticulo = 'Material') | `[{ id, descripcion }]` *(ya implementado)* |
| `GET /GrupoProductos/` | Selector de grupo en FormularioProducto | `[{ id, descripcion }]` *(ya implementado)* |
| `GET /Marca/` | Selector de marca en FormularioProducto | `[{ id, descripcion }]` *(asumir ya implementado)* |

---

## 6. Notas de Implementación

1. **`PUT /Pacientes/{id}`** no está definido en el frontend aún — el botón "Guardar Cambios" del paciente tiene un `setTimeout` como stub. Al agregar el endpoint en la API, se debe también conectar en `PacientesUnificado.js`.

2. **`AgregarExamen`** existe en `RequestsExamenes.js` pero no está conectado al botón "Guardar examen" en `ExamenVista.jsx` — `handleFinish()` solo hace `console.log`. La llamada debe ser añadida ahí.

3. **`GET /Examenes`** no existe en la SPA — `ConsultaExamenVista.jsx` lee de un archivo JSON local (`examenes.json`). Al crear el endpoint en la API, se debe reemplazar esa lectura.

4. Las pestañas **Cuentas**, **Información Adicional** e **Información de Facturación** del paciente tienen la lógica de guardado pendiente de conectar a la API.

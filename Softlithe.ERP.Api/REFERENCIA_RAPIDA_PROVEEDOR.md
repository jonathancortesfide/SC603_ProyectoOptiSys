# Referencia Rápida - Proveedor

## ?? Archivos por Capa

### ABSTRACCIONES (Interfaces + DTOs)

| Archivo | Ruta | Contenido |
|---------|------|----------|
| `MensajeDeProveedorDto.cs` | `Abstracciones/Contenedores/Proveedores/` | Constantes de mensajes |
| `ProveedorDto.cs` | `Abstracciones/Contenedores/Proveedores/` | DTO + Modelo de Respuesta |
| `ParametroConsultaProveedor.cs` | `Abstracciones/Contenedores/Proveedores/` | Parámetros de búsqueda |
| `ProveedorInActivaDto.cs` | `Abstracciones/Contenedores/Proveedores/` | DTO para cambiar estado |
| `IObtenerProveedorBW.cs` | `Abstracciones/BW/Proveedores/` | Interface obtener |
| `IAgregarProveedorBW.cs` | `Abstracciones/BW/Proveedores/` | Interface agregar |
| `IModificarProveedorBW.cs` | `Abstracciones/BW/Proveedores/` | Interface modificar |
| `IModificarEstadoProveedorBW.cs` | `Abstracciones/BW/Proveedores/` | Interface estado |
| `IProveedorBC.cs` | `Abstracciones/BC/Proveedores/` | Interface validaciones |
| `IProveedorRepository.cs` | `Abstracciones/DA/Proveedores/` | Interface data access |

### BUSINESS WORKFLOW

| Archivo | Responsabilidad | Métodos |
|---------|-----------------|---------|
| `ObtenerProveedorBW.cs` | Obtener con paginación | `ObtenerProveedores()` |
| `AgregarProveedorBW.cs` | Insertar nuevo | `AgregarProveedor()` |
| `ModificarProveedorBW.cs` | Actualizar existente | `ModificarProveedor()` |
| `ModificarEstadoProveedorBW.cs` | Cambiar estado | `ModificaEstadoProveedor()` |

### BUSINESS COMPONENT

| Archivo | Responsabilidad | Métodos |
|---------|-----------------|---------|
| `ProveedorBC.cs` | Validaciones negocio | `ValidarProveedorParaInsertar()`, `ValidarProveedorParaActualizar()`, `ValidarProveedorParaCambiarEstado()` |

### DATA ACCESS

| Archivo | Responsabilidad | Métodos |
|---------|-----------------|---------|
| `ProveedorRepository.cs` | Acceso datos (Dapper) | `ObtenerProveedoresAsync()`, `InsertarProveedorAsync()`, `ActualizarProveedorAsync()`, `ModificaEstadoProveedorAsync()` |
| `SP_Proveedor.sql` | Stored Procedures | `sp_Proveedor_Obtener`, `sp_Proveedor_Insertar`, `sp_Proveedor_Actualizar`, `sp_Proveedor_ModificaEstado` |

### API CONTROLLER

| Archivo | Endpoints |
|---------|-----------|
| `ProveedoresController.cs` | `/api/proveedores/ObtenerProveedor`, `/api/proveedores/AgregarProveedor`, `/api/proveedores/ActualizarProveedor`, `/api/proveedores/ModificaEstadoProveedor` |

---

## ?? Endpoints Resumen

### 1. ObtenerProveedor
```
POST /api/proveedores/ObtenerProveedor
Input:  ParametroConsultaProveedor
Output: ProveedorConModeloDeValidacion
```

### 2. AgregarProveedor
```
POST /api/proveedores/AgregarProveedor
Input:  ProveedorDto
Output: ModeloValidacion
```

### 3. ActualizarProveedor
```
POST /api/proveedores/ActualizarProveedor
Input:  ProveedorDto
Output: ModeloValidacion
```

### 4. ModificaEstadoProveedor
```
POST /api/proveedores/ModificaEstadoProveedor
Input:  ProveedorInActivaDto
Output: ModeloValidacion
```

---

## ??? Stored Procedures

| SP | Tipo | Parámetros Entrada | Parámetro Salida |
|----|------|-------------------|-----------------|
| `sp_Proveedor_Obtener` | SELECT | @Identificador, @NoProveedor, @Cedula, @Nombre, @EsActivo, @Pagina, @TamanoPagina | @TotalRegistros |
| `sp_Proveedor_Insertar` | INSERT | @Identificador, @Nombre, @Cedula, @Direccion, @Telefono, @Email, @Usuario, @EsActivo | @@ROWCOUNT |
| `sp_Proveedor_Actualizar` | UPDATE | @NoProveedor, @Identificador, @Nombre, @Cedula, @Direccion, @Telefono, @Email, @Usuario, @EsActivo | @@ROWCOUNT |
| `sp_Proveedor_ModificaEstado` | UPDATE | @NoProveedor, @Identificador, @Usuario, @EsActivo | @@ROWCOUNT |

---

## ?? Modelos de Datos

### ProveedorDto
```csharp
{
  int NoProveedor,
  int Identificador,          // [Required]
  string Nombre,              // [Required]
  string Cedula,              // [Required]
  string Direccion,
  string Telefono,
  string Email,
  string Usuario,             // [Required]
  bool EsActivo               // [Required]
}
```

### ParametroConsultaProveedor
```csharp
{
  int Identificador,          // [Required]
  int? NoProveedor,
  string Cedula,
  string Nombre,
  bool? EsActivo,
  int Pagina = 1,
  int TamanoPagina = 10
}
```

### ProveedorInActivaDto
```csharp
{
  int NoProveedor,            // [Required]
  string Usuario,             // [Required]
  bool EsActivo,              // [Required]
  int Identificador           // [Required]
}
```

### ProveedorConModeloDeValidacion
```csharp
{
  List<ProveedorDto> LaListaDeProveedores,
  int TotalRegistros,
  int Pagina,
  int TamanoPagina,
  string Mensaje,             // Heredado
  bool EsCorrecto             // Heredado
}
```

---

## ?? Flujos Rápidos

### Obtener Proveedores
```
Controller ? ObtenerProveedorBW ? Repository ? sp_Proveedor_Obtener
```

### Agregar Proveedor
```
Controller ? AgregarProveedorBW ? BC.Validar ? Repository ? sp_Proveedor_Insertar ? Bitácora
```

### Actualizar Proveedor
```
Controller ? ModificarProveedorBW ? BC.Validar ? Repository ? sp_Proveedor_Actualizar ? Bitácora
```

### Cambiar Estado
```
Controller ? ModificarEstadoProveedorBW ? BC.Validar ? Repository ? sp_Proveedor_ModificaEstado ? Bitácora
```

---

## ?? Inyección de Dependencias

```csharp
// Program.cs
builder.Services.AddScoped<IObtenerProveedorBW, ObtenerProveedorBW>();
builder.Services.AddScoped<IAgregarProveedorBW, AgregarProveedorBW>();
builder.Services.AddScoped<IModificarProveedorBW, ModificarProveedorBW>();
builder.Services.AddScoped<IModificarEstadoProveedorBW, ModificarEstadoProveedorBW>();
builder.Services.AddScoped<IProveedorBC, ProveedorBC>();
builder.Services.AddScoped<IProveedorRepository>(sp => 
    new ProveedorRepository(connectionString));
```

---

## ?? Validaciones

### Insertar
- ? Identificador > 0
- ? Nombre no vacío
- ? Cedula no vacía
- ? Usuario no vacío

### Actualizar
- ? Todas las de Insertar
- ? NoProveedor > 0

### Cambiar Estado
- ? NoProveedor > 0
- ? Identificador > 0
- ? Usuario no vacío

---

## ?? Códigos de Respuesta

| Código | Significado | EsCorrecto |
|--------|-------------|-----------|
| Operación exitosa | La operación se completó | `true` |
| Error validación | Falló validación de negocio | `false` |
| Error BD | Error en base de datos | `false` |
| Error del sistema | Excepción no controlada | `false` |

---

## ?? Tips Útiles

### Paginación
- Para obtener segundo página: `"pagina": 2`
- Para cambiar registros por página: `"tamanoPagina": 20`
- Total de páginas = `Math.Ceiling(totalRegistros / tamanoPagina)`

### Búsqueda
- `Cedula` y `Nombre` son LIKE '%' + parámetro
- Dejar vacío o null para no filtrar
- `EsActivo` null = todos (activos e inactivos)

### Multiempresa
- SIEMPRE incluir `Identificador` en request
- Todos los datos filtran por `Identificador`
- No es posible ver datos de otra empresa

---

## ?? Documentación

- **Completa**: `IMPLEMENTACION_PROVEEDOR_COMPLETA.md`
- **Diseño**: `RESUMEN_DISENO_PROVEEDOR.md`
- **Configuración**: `GUIA_CONFIGURACION_PROVEEDOR.md`
- **Referencia**: Este archivo

---

## ? Status

```
? Implementación COMPLETA
? Compilación EXITOSA
? Arquitectura VALIDADA
? SQL GENERADO
? DOCUMENTACIÓN COMPLETA
```

**Ready to Deploy** ??

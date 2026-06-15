# Guía de Configuración - Proveedor

## ?? Checklist de Implementación

### 1?? Base de Datos

- [ ] Ejecutar script `SP_Proveedor.sql` en SQL Server
- [ ] Verificar que los 4 SP se hayan creado correctamente
- [ ] Crear tabla `Proveedor` si no existe
- [ ] Verificar permisos de EXECUTE en los SP

```sql
-- Verificar SP creados
SELECT * FROM sys.procedures 
WHERE name LIKE 'sp_Proveedor%'

-- Verificar tabla
SELECT * FROM information_schema.tables 
WHERE table_name = 'Proveedor'
```

### 2?? Dependency Injection (Program.cs)

Agregar las siguientes líneas en `Program.cs`:

```csharp
// Importar namespaces
using Softlithe.ERP.Abstracciones.BW.Proveedores;
using Softlithe.ERP.Abstracciones.BC.Proveedores;
using Softlithe.ERP.Abstracciones.DA.Proveedores;
using Softlithe.ERP.BW.Proveedores;
using Softlithe.ERP.BC.Proveedores;
using Softlithe.ERP.DA.Proveedores;

// En la sección de builder.Services
var builder = WebApplicationBuilder.CreateBuilder(args);

// Agregar después de otros servicios...

// ===== PROVEEDOR =====
// Business Workflow
builder.Services.AddScoped<IObtenerProveedorBW, ObtenerProveedorBW>();
builder.Services.AddScoped<IAgregarProveedorBW, AgregarProveedorBW>();
builder.Services.AddScoped<IModificarProveedorBW, ModificarProveedorBW>();
builder.Services.AddScoped<IModificarEstadoProveedorBW, ModificarEstadoProveedorBW>();

// Business Component
builder.Services.AddScoped<IProveedorBC, ProveedorBC>();

// Data Access
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddScoped<IProveedorRepository>(sp => 
    new ProveedorRepository(connectionString));
```

### 3?? Connection String (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=TU_SERVIDOR;Database=TU_BASE_DATOS;User Id=tu_usuario;Password=tu_password;Encrypt=true;TrustServerCertificate=false;Connection Timeout=30;"
  }
}
```

### 4?? NuGet Packages

Verificar que el proyecto DA tenga:

```xml
<!-- Softlithe.ERP.DA.csproj -->
<ItemGroup>
    <PackageReference Include="Dapper" Version="2.0.123" />
    <PackageReference Include="Microsoft.Data.SqlClient" Version="5.0.0" />
</ItemGroup>
```

Si falta Dapper, instalar:
```bash
dotnet add package Dapper
dotnet add package Microsoft.Data.SqlClient
```

### 5?? Validar Compilación

```bash
dotnet build
```

Debe compiles sin errores.

---

## ?? Testing de Endpoints

### Usando Postman

#### 1. Obtener Proveedores

**Crear nuevo request:**
- Método: `POST`
- URL: `https://localhost:5001/api/proveedores/ObtenerProveedor`
- Headers: 
  - `Content-Type: application/json`
- Body (raw - JSON):

```json
{
  "identificador": 1,
  "noProveedor": null,
  "cedula": "",
  "nombre": "",
  "esActivo": null,
  "pagina": 1,
  "tamanoPagina": 10
}
```

**Respuesta esperada:**
```json
{
  "laListaDeProveedores": [
    {
      "noProveedor": 1,
      "identificador": 1,
      "nombre": "Proveedor Test",
      "cedula": "12345678",
      "direccion": "Calle Test 123",
      "telefono": "2562-1234",
      "email": "test@proveedor.com",
      "usuario": "admin",
      "esActivo": true
    }
  ],
  "totalRegistros": 1,
  "pagina": 1,
  "tamanoPagina": 10,
  "mensaje": "Datos obtenidos de manera correcta",
  "esCorrecto": true
}
```

#### 2. Agregar Proveedor

- Método: `POST`
- URL: `https://localhost:5001/api/proveedores/AgregarProveedor`
- Body:

```json
{
  "noProveedor": 0,
  "identificador": 1,
  "nombre": "Nuevo Proveedor SA",
  "cedula": "87654321",
  "direccion": "Avenida Principal 999",
  "telefono": "2565-9999",
  "email": "nuevo@proveedor.com",
  "usuario": "admin",
  "esActivo": true
}
```

**Respuesta esperada:**
```json
{
  "mensaje": "El proveedor  fue agregado correctamente.",
  "esCorrecto": true
}
```

#### 3. Actualizar Proveedor

- Método: `POST`
- URL: `https://localhost:5001/api/proveedores/ActualizarProveedor`
- Body:

```json
{
  "noProveedor": 1,
  "identificador": 1,
  "nombre": "Proveedor Actualizado",
  "cedula": "12345678",
  "direccion": "Calle Actualizada 456",
  "telefono": "2562-5678",
  "email": "actualizado@proveedor.com",
  "usuario": "admin",
  "esActivo": true
}
```

**Respuesta esperada:**
```json
{
  "mensaje": "El proveedor  fue modificado correctamente.",
  "esCorrecto": true
}
```

#### 4. Cambiar Estado

- Método: `POST`
- URL: `https://localhost:5001/api/proveedores/ModificaEstadoProveedor`
- Body:

```json
{
  "noProveedor": 1,
  "usuario": "admin",
  "esActivo": false,
  "identificador": 1
}
```

**Respuesta esperada:**
```json
{
  "mensaje": "El proveedor No. 1 fue modificado su estado a Inactivo.",
  "esCorrecto": true
}
```

---

## ?? Debugging

### 1. Verificar Stored Procedures en SSMS

```sql
-- Listar todos los SP de Proveedor
EXEC sp_helptext 'sp_Proveedor_Obtener'
EXEC sp_helptext 'sp_Proveedor_Insertar'
EXEC sp_helptext 'sp_Proveedor_Actualizar'
EXEC sp_helptext 'sp_Proveedor_ModificaEstado'

-- Probar SP directamente
DECLARE @TotalRegistros INT
EXEC sp_Proveedor_Obtener 
    @Identificador = 1,
    @NoProveedor = NULL,
    @Cedula = NULL,
    @Nombre = NULL,
    @EsActivo = NULL,
    @Pagina = 1,
    @TamanoPagina = 10,
    @TotalRegistros = @TotalRegistros OUTPUT

SELECT @TotalRegistros AS TotalRegistros
```

### 2. Verificar Datos en Base de Datos

```sql
-- Ver todos los proveedores
SELECT * FROM Proveedor

-- Ver por Identificador
SELECT * FROM Proveedor WHERE Identificador = 1

-- Contar registros
SELECT COUNT(*) AS Total FROM Proveedor
```

### 3. Logs de Aplicación

Revisar logs en:
- Visual Studio Output window
- Application Insights (si está configurado)
- Archivo de logs (si está configurado)

### 4. Puntos de Quiebre (Breakpoints)

Agregar breakpoints en:
1. `ProveedoresController` - Para verificar entrada de datos
2. `ProveedorBW` - Para verificar flujo de orquestación
3. `ProveedorBC` - Para verificar validaciones
4. `ProveedorRepository` - Para verificar ejecución de SP

---

## ?? Troubleshooting

### Error: "Connection string not found"
**Solución:** Verificar que `DefaultConnection` esté en `appsettings.json` y en `Program.cs`

### Error: "Stored procedure not found"
**Solución:** Ejecutar `SP_Proveedor.sql` en SQL Server

### Error: "Timeout expired"
**Solución:** 
- Aumentar `Connection Timeout` en connection string
- Verificar que el servidor SQL sea accesible
- Revisar permisos en base de datos

### Error: "Login failed"
**Solución:**
- Verificar credenciales en connection string
- Verificar que el usuario tenga permisos EXECUTE en SP
- Verificar que el usuario tenga SELECT/INSERT/UPDATE en tabla Proveedor

### Error: "Identificador no encontrado"
**Solución:**
- Verificar que el Identificador (Empresa) existe en tabla correspondiente
- Asegurar que el parámetro Identificador no sea NULL

---

## ?? Monitoreo

### Verificar Ejecución de SP

```sql
-- Crear tabla temporal para log
CREATE TABLE sp_Proveedor_Log (
    Id INT IDENTITY(1,1),
    NombreSP VARCHAR(100),
    Identificador INT,
    FechaEjecucion DATETIME,
    Exitoso BIT,
    Mensaje VARCHAR(500)
)

-- Agregar al inicio de cada SP:
INSERT INTO sp_Proveedor_Log (NombreSP, Identificador, FechaEjecucion, Exitoso)
VALUES ('sp_Proveedor_Obtener', @Identificador, GETDATE(), 1)

-- Consultar
SELECT * FROM sp_Proveedor_Log ORDER BY FechaEjecucion DESC
```

### Revisar Bitácora

```sql
-- Ver eventos de Proveedor en bitácora
SELECT * FROM Bitacora 
WHERE Tabla = 'Proveedor' 
ORDER BY FechaDeRegistro DESC
```

---

## ?? Registros Recomendados

### Estructura de Log

```csharp
// En ProveedorRepository
_logger.LogInformation($"Obteniendo proveedores para Identificador: {identificador}");
_logger.LogError($"Error en sp_Proveedor_Obtener: {ex.Message}");
```

### Niveles de Log
- **Debug**: Detalles técnicos
- **Information**: Operaciones normales
- **Warning**: Algo inusual pero no es error
- **Error**: Problemas que requieren atención
- **Critical**: Fallo del sistema

---

## ? Checklist Final

- [ ] SQL Server accesible
- [ ] SP creados correctamente
- [ ] Tabla Proveedor existe
- [ ] Connection string configurada
- [ ] Paquetes NuGet instalados
- [ ] Dependency Injection configurado
- [ ] Proyecto compila sin errores
- [ ] API inicia correctamente
- [ ] Endpoints responden (Postman test)
- [ ] Bitácora registra operaciones
- [ ] Datos se guardan en base de datos
- [ ] Paginación funciona
- [ ] Validaciones funcionan
- [ ] Cambio de estado funciona

---

**Soporte:** Para problemas específicos, revisar logs y ejecutar queries de verificación en SSMS.

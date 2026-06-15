# Arquitectura del sistema Softlithe ERP

## Descripción general

Softlithe ERP es un sistema empresarial orientado a ópticas o clinicas de salud, desarrollado con:

- C# .NET 8
- ASP.NET Web API
- SQL Server
- Entity Framework Core (LINQ)
- Dapper (opcional para Stored Procedures)

El sistema sigue una arquitectura por capas con separación clara de responsabilidades y uso de contratos (Abstracciones).

---

# Estructura de proyectos

La solución está dividida en los siguientes proyectos:

---

## 1. Abstracciones

Contiene todos los contratos (interfaces) y modelos de datos del sistema.

### Contenedores

Ubicación: `Abstracciones/Contenedores/`

Contiene:
- DTOs de entrada y salida
- Modelos de parámetros
- Modelos de respuesta
- Modelos de validación

Ejemplos:
- `MarcaDto`
- `ParametroConsultaMarca`
- `MarcaConModeloDeValidacion`
- `ModeloValidacion`

### Carpetas por entidad - Interfaces

Ejemplo: `Abstracciones/BW/Marcas/`, `Abstracciones/BC/Marcas/`, `Abstracciones/DA/Marcas/`

Contiene las interfaces:
- `IMarcaBW.cs`
- `IMarcaBC.cs` (si aplica)
- `IMarcaRepository.cs` (interfaz DA)

**Regla importante**: Todas las interfaces van en Abstracciones, separadas por capa (BW, BC, DA).

---

## 2. API (Presentación)

Responsabilidad:
- Manejo de solicitudes HTTP
- Exposición de endpoints REST
- Orquestación básica de las solicitudes

Reglas:
- **No contiene lógica de negocio**
- Solo invoca BW mediante interfaces
- Usa DTOs desde Contenedores
- Los endpoints deben ser simples orchestadores
- Los controladores heredan de `ControllerBase`

Patrón de endpoint:
````````
GET /api/marcas
GET /api/marcas/{id}
POST /api/marcas
PUT /api/marcas/{id}

````````
- Utilizar verbos HTTP y nombres representativos
- Ejemplo de acción: `ObtenerMarcas` → `GET api/marcas`
- Respuestas estandarizadas usando modelos de validación

---

## 3. BW (Business Workflow)

Responsabilidad:
- Orquestar el flujo de la aplicación
- Coordinar BC (Business Components) y DA (Data Access)
- Ejecutar casos de uso
- Manejo de errores y logging

Reglas:
- **No contiene SQL**
- **No accede directamente a la base de datos**
- Depende de interfaces de BC y DA
- Inyección de dependencias en el constructor
- Implementa las interfaces de BW desde Abstracciones
- Manejo de excepciones con ModeloValidacion

Patrón:
````````
MarcaController  
→ IMarcaBW  
→ MarcaBW  
→ IMarcaBC  
→ MarcaBC  
→ IMarcaRepository  
→ MarcaRepository  
→ Stored Procedure (opcional)  
```
- La API recibe una solicitud HTTP
- Los controladores validan y traducen a DTOs
- BW orquesta llamando a BC y DA
- DA realiza operaciones en la base de datos
- Se devuelve respuesta a través de los mismos niveles

---

## 4. BC (Business Components)

Responsabilidad:
- Validaciones
- Reglas de negocio
- Consistencia del dominio
- Cálculos y transformaciones

Ejemplos:
- Validación de datos obligatorios
- Validación de duplicados
- Validación de Identificador (multiempresa)
- Reglas específicas del negocio

Reglas:
- **No accede a base de datos directamente**
- Solo opera sobre datos en memoria
- Retorna ModeloValidacion o datos procesados
- Puede tener métodos estáticos para validaciones genéricas

Patrón:
````````
PrestamoController  
→ IPrestamoBW  
→ PrestamoBW  
→ IPrestamoBC  
→ PrestamoBC  
→ ValidarDatosPrestamo() (método estático)  
→ CalcularInteres() (método estático)  
```
- La API recibe una solicitud HTTP
- Los controladores validan y traducen a DTOs
- BW orquesta llamando a BC y DA
- BC realiza validaciones y cálculos
- DA realiza operaciones en la base de datos
- Se devuelve respuesta a través de los mismos niveles

---

## 5. DA (Data Access)

Responsabilidad:
- Acceso a base de datos
- Ejecución de consultas y comandos
- Mapeo de datos

Tecnologías:
- **Entity Framework Core (LINQ)** → Consultas simples, queries con tablas directas
- **Dapper** → Procedimientos almacenados complejos (opcional)

Reglas:
- **No contiene lógica de negocio**
- Solo acceso a datos
- Métodos siempre async
- Implementa interfaces de DA desde Abstracciones
- Inyección de DbContext (EF Core) o IConexion (Dapper)

Patrón con EF Core:
````````
DbContext (SoftlitheERPDb)
  ├── DbSet<Marca> Marcas
  ├── DbSet<Producto> Productos
  └── DbSet<Cliente> Clientes
```
- Usar propiedades DbSet<> para cada entidad
- Configuración fluida en OnModelCreating
- Ejemplo de consulta:
````````csharp
public async Task<List<Marca>> ObtenerMarcasAsync()
{
    using (var context = new SoftlitheERPDb())
    {
        return await context.Marcas.ToListAsync();
    }
}
````````


# Flujo de ejecución

Ejemplo: Marca

```
MarcaController  
→ IMarcaBW  
→ MarcaBW  
→ IMarcaBC  
→ MarcaBC  
→ IMarcaRepository  
→ MarcaRepository  
→ Stored Procedure (opcional)  
```
- La API recibe una solicitud HTTP
- Los controladores validan y traducen a DTOs
- BW orquesta llamando a BC y DA
- DA realiza operaciones en la base de datos
- Se devuelve respuesta a través de los mismos niveles

---

# Acceso a datos

## Estrategia

- Persistencia mediante Stored Procedures (opcional)
- Dapper para ejecución (opcional)
- LINQ con Entity Framework Core para consultas y comandos

## Repositorios

- Implementar el patrón repositorio para abstraer acceso a datos
- Cada entidad debe tener un repositorio correspondiente
- Ejemplo: `MarcaRepository` implementa `IMarcaRepository`

## Contexto de base de datos

- Usar DbContext de Entity Framework Core
- Configurar cadenas de conexión en appsettings.json
- Ejemplo:
```
"ConnectionStrings": {
  "DefaultConnection": "Server=.;Database=SoftlitheERP;Trusted_Connection=True;"
}
```

---

# Modelo de Validación

## Modelo base

ModeloValidacion:

- string Mensaje
- bool EsCorrecto

Define si la operación fue exitosa.

---

## Respuestas de consultas (Query)

Se utiliza un modelo que hereda de `ModeloValidacion`.

Ejemplo:

MarcaConModeloDeValidacion

Contiene:

- Datos (lista o entidad)
- Estado de la operación

---

## Respuestas de comandos (Command)

Para:
- Insertar
- Actualizar
- Modificar estado (Activar/Inactivar)

Se retorna:

ModeloValidacion

---

## Regla Multiempresa

**Importante**: Todos los `ParametroConsulta` deben incluir `NoEmpresa` o `Identificador`.

---

# Manejo de estado (Activar / Inactivar)

## Regla general

**El sistema NO elimina registros.**

En su lugar se utiliza control lógico mediante el campo:
- `EsActivo` (boolean)

## Método estándar

Debe existir una operación: `ModificaEstado{Entidad}`

Ejemplo: `ModificaEstadoMarca`

## DTO utilizado

`{Entidad}InActivaDto`

Ejemplo: `MarcaInActivaDto`

Debe contener:
- Id de la entidad (ej: `NoMarca`)
- Usuario que realiza la acción
- `EsActivo` (true/false)
- `NoEmpresa` o `Identificador` (multiempresa)

Ejemplo:

```csharp
public async Task<ModeloValidacion> ModificaEstadoMarcaAsync(MarcaInActivaDto dto)
{
    using (var context = new SoftlitheERPDb())
    {
        var marca = await context.Marcas.FindAsync(dto.NoMarca);
        if (marca == null)
        {
            return new ModeloValidacion { EsCorrecto = false, Mensaje = "Marca no encontrada." };
        }

        marca.EsActivo = dto.EsActivo;
        context.Marcas.Update(marca);
        await context.SaveChangesAsync();

        return new ModeloValidacion { EsCorrecto = true };
    }
}
```

---

# Soporte Multiempresa / Multisucursal

## Concepto

El sistema es multiempresa.

Cada registro pertenece a una empresa identificada por:

- Identificador
o
- NoEmpresa

---

## Diseño de base de datos

- Llave primaria: Identity (incremental)
- No se usan llaves compuestas
- El campo Identificador define la pertenencia

---

## Regla de acceso a datos

TODAS las consultas deben filtrar por:

- Identificador
o
- NoEmpresa

---

## Stored Procedures

Deben:

- Recibir Identificador como parámetro
- Filtrar los datos utilizando ese campo

Ejemplo:

WHERE Identificador = @Identificador

---

## DTOs

Todos los modelos de consulta deben incluir:

- Identificador

Ejemplo:

ParametroConsultaMarca

---

## Validación

BC debe validar:

- Que Identificador esté presente
- Que sea válido

---

## Riesgos controlados

Esta regla evita:

- Mezcla de datos entre empresas
- Exposición incorrecta de información
- Problemas de seguridad

---

# Base de datos

- SQL Server
- Uso intensivo de Stored Procedures (opcional)
- No eliminación física de datos
- Control lógico de estado (EsActivo)

---

# Convenciones del proyecto

- Interfaces en Abstracciones
- DTOs en Contenedores
- Implementaciones en BW, BC, DA
- Controllers en API
- Separación estricta de responsabilidades

---

# Objetivo de la arquitectura

- Bajo acoplamiento
- Alta mantenibilidad
- Escalabilidad
- Seguridad en datos multiempresa
- Claridad en responsabilidades

## Flujo

1. API recibe `MarcaInActivaDto`
2. BW orquesta (IMarcaBW)
3. BC valida datos (IValidarDatoBC)
4. DA ejecuta actualización
5. Se retorna `ModeloValidacion`

---

# Endpoints

## Queryendpoints (Consultas)

- **Método HTTP**: `POST`
- **Recibe**: `ParametroConsulta{Entidad}`
- **Retorna**: `{Entidad}ConModeloDeValidacion` (con datos)

Ejemplo:

`POST /api/marcas/consultar`

Cuerpo:
```json
{
  "NoEmpresa": 1,
  "Marca": "Acme"
}
```
Respuesta:
```json
{
  "EsCorrecto": true,
  "Mensaje": "",
  "Datos": [
    {
      "NoMarca": 1,
      "Descripcion": "Marca Acme",
      "EsActivo": true
    }
  ]
}
```

## Command Endpoints (Crear/Actualizar/Cambiar Estado)

- **Método HTTP**: `POST`
- **Recibe**: `{Entidad}Dto` o `{Entidad}InActivaDto`
- **Retorna**: `ModeloValidacion`

Ejemplos:

`POST /api/marcas`

Cuerpo:
```json
{
  "Descripcion": "Marca Acme",
  "EsActivo": true
}
```
Respuesta:
```json
{
  "EsCorrecto": true,
  "Mensaje": ""
}
```

`POST /api/marcas/modificar-estado`

Cuerpo:
```json
{
  "NoMarca": 1,
  "EsActivo": false
}
```
Respuesta:
```json
{
  "EsCorrecto": true,
  "Mensaje": ""
}
```

---
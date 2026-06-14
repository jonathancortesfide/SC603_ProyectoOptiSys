# Copilot Instructions for Softlithe ERP

## Role

Act as a senior .NET enterprise developer.

Generate production-ready C# code strictly aligned to this architecture.

---

# Coding Principles

Always follow:

- SOLID
- Clean Code
- DRY
- KISS
- Separation of Concerns
- Dependency Injection

---

# Naming Conventions

## PascalCase (MANDATORY)

Use PascalCase for:

- Classes
- Methods
- Properties
- DTOs
- Interfaces
- Parameters

Examples:

- `IMarcaBW`
- `MarcaBW`
- `MarcaDto`
- `ParametroConsultaMarca`

Do NOT use:

- `snake_case`
- `camelCase` in public members

---

# Architecture Overview

Projects:

- **Abstracciones** → Interfaces (BW, BC, DA folders) + DTOs (Contenedores)
- **Api** → Controllers only (ControllerBase)
- **BW** → Business Workflow implementations
- **BC** → Business Components (rules/validations)
- **DA** → Data Access (Entity Framework Core or Dapper)

---

# Project Structure (CRITICAL)

## Abstracciones

Contains:

### Contenedores

Location: `Abstracciones/Contenedores/`

- All DTOs
- Request / Response models
- Validation models

### Interfaces Folders

**By Layer**: `Abstracciones/BW/`, `Abstracciones/BC/`, `Abstracciones/DA/`

**By Entity**: `Abstracciones/BW/Marcas/`, `Abstracciones/BC/Marcas/`, etc.

Contains per entity:
- `I{Entidad}BW.cs` (Business Workflow interface)
- `I{Entidad}BC.cs` (Business Component interface, if needed)
- `I{Entidad}Repository.cs` or `I{Entidad}DA.cs` (Data Access interface)

---

## Implementation Projects

### API

- Controllers only
- Inherit from `ControllerBase`
- Route, HttpPost, HttpGet attributes
- Inject interfaces from Abstracciones
- Return DTOs and ModeloValidacion
- **No business logic**

### BW (Business Workflow)

- Implements `IBW` interfaces
- Orchestrates workflows
- Coordinates BC and DA via interfaces
- Handles exceptions and logging
- **No SQL**

### BC (Business Components)

- Implements `IBC` interfaces (if needed)
- Business rules and validations
- Works with in-memory data
- **No database access**

### DA (Data Access)

- Implements `IDA` or `IRepository` interfaces
- Uses Entity Framework Core (LINQ) for standard queries
- Uses Dapper for complex stored procedures (optional)
- Async methods required
- **No business logic**

---

# Interfaces Rule (VERY IMPORTANT)

- **ALL interfaces MUST be in Abstracciones**
- NEVER create interfaces in BW, BC, or DA
- ALWAYS implement interfaces in corresponding layers
- Organize interfaces by layer folder: `BW/`, `BC/`, `DA/`

Example structure:

````````
Abstracciones
│
├── BW
│   ├── IMarcaBW.cs
│   └── IOtraEntidadBW.cs
│
├── BC
│   ├── IMarcaBC.cs
│   └── IOtraEntidadBC.cs
│
└── DA
    ├── IMarcaRepository.cs
    └── IOtraEntidadRepository.cs
````````

# DTO Rule

- DTOs MUST be in:
  Abstracciones/Contenedores/
- NEVER duplicate DTOs

---

# Layer Responsibilities

## API

- Only orchestrates HTTP
- No business logic
- Calls BW only
- Uses DTOs

---

## BW

- Orchestrates application logic
- Calls BC and DA via interfaces
- No SQL

---

## BC

- Business rules
- Validations
- No database access

---

## DA

- Data access only
- Uses:
  - Dapper → Stored Procedures
  - LINQ → simple queries
- Async methods required

---

# Result Handling (CRITICAL)

## Base Model

ModeloValidacion:

- string Mensaje (required)
- bool EsCorrecto

---

## Query Results

- MUST return model inheriting from ModeloValidacion

Example:

MarcaConModeloDeValidacion

---

## Command Results

For:

- Insert
- Update
- ModificaEstado

Return:

ModeloValidacion

---

## Forbidden

- Do NOT use Result<T>
- Do NOT return raw lists
- Do NOT return primitive types
- Do NOT mix patterns

---

# Parameter Handling

## Rule

If parameters > 3:

Use:

ParametroConsulta{Entidad}

Example:

ParametroConsultaMarca

---

# API Endpoint Rules

## Queries

- Use HttpPost
- Receive ParametroConsulta{Entidad}
- Return {Entidad}ConModeloDeValidacion

---

## Commands

- Use HttpPost
- Receive {Entidad}Dto
- Return ModeloValidacion

---

# State Management (CRITICAL)

## NO DELETE OPERATIONS

The system does NOT allow delete.

---

## Use:

Activate / Inactivate

Field:

- EsActivo / Activo / activo

---

## Required Method

ModificaEstado{Entidad}

Example:

ModificaEstadoMarca

---

## DTO

{Entidad}InActivaDto

Must include:

- Entity Id
- Usuario
- EsActivo
- Identificador

---

## Forbidden

- Do NOT generate Delete methods
- Do NOT generate DELETE endpoints
- Do NOT remove records physically

---

# Multi-Company Rule (CRITICAL)

The system is multi-company.

Each record belongs to a company identified by:

- Identificador
or
- NoEmpresa

---

## Rules

- ALL queries MUST filter by Identificador or NoEmpresa
- NEVER return data without this filter

---

## Stored Procedures

MUST include:

@Identificador

and filter by it.

---

## DTOs

All query DTOs MUST include:

Identificador

---

## BC Validation

MUST validate Identificador

---

## Forbidden

- Do NOT generate queries without Identificador
- Do NOT assume single-tenant system

---

# Dependency Injection

- Always use constructor injection
- Always depend on interfaces

Forbidden:

new SomeClass()

---

# Data Access Rules

- Use Dapper for Stored Procedures
- Use LINQ only for simple queries
- Always parameterized queries
- Never build SQL manually

---

# Coding Standards

- async/await required
- Small methods
- Single responsibility
- Use ILogger

Avoid:

- Regions
- Static helper abuse
- Duplicate logic

---

# Error Handling

- Use ModeloValidacion for business errors
- Use middleware for exceptions
- Always log errors

---

# Before Writing Code

Always:

1. Check Abstracciones for interfaces
2. Create missing interfaces there
3. Implement in correct layer
4. Use DTOs from Contenedores

---

# Response Format

1. Explain design
2. Mention layers involved
3. Generate code
4. Suggest improvements

---

# Feature Generation Rule

ALWAYS generate full implementation:

## Abstracciones

- DTOs
- Interfaces

## BW

- Implementation

## BC

- Implementation

## DA

- Repository

## API

- Controller

Never generate partial implementations.
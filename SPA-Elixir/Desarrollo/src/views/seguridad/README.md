# Módulo de Seguridad - Gestión de Usuarios, Roles y Permisos

## 📋 Descripción General

Este módulo proporciona una interfaz completa para la gestión de usuarios, roles y permisos del sistema. Integra con un Identity Server para la autenticación y autorización.

## 📁 Estructura de Archivos

```
src/
├── requests/
│   ├── usuarios/
│   │   ├── DireccionesRequest.js      # URLs de API para usuarios
│   │   └── RequestsUsuarios.js         # Funciones CRUD de usuarios
│   └── roles/
│       ├── DireccionesRequest.js       # URLs de API para roles
│       └── RequestsRoles.js            # Funciones CRUD de roles
└── views/
    └── seguridad/
        ├── Seguridad.js                # Vista principal con tabs
        ├── usuarios/
        │   ├── ListadoUsuarios.js      # Tabla de usuarios
        │   ├── FormularioUsuario.js    # Crear/Editar usuario
        │   └── CambiarContrasena.js    # Cambiar contraseña
        ├── roles/
        │   ├── ListadoRoles.js         # Tabla de roles
        │   └── FormularioRol.js        # Crear/Editar rol con permisos
        └── permisos/
            └── AsignarPermisos.js      # Asignar roles a usuarios
```

## ✨ Características

### 1. Gestión de Usuarios

#### Listado de Usuarios
- **Columnas mostradas:**
  - Login usuario
  - Email
  - Nombre
  - Es Doctor (checkbox visual)
  - Código Profesional (condicional)
  - Teléfono
  - Fecha de Nacimiento
  - Edad (calculada automáticamente)
  - Es Activo (estado)

#### Opciones del Listado
- 🆕 **Crear Usuario** - Abre formulario de creación
- ✏️ **Modificar Usuario** - Abre formulario de edición
- 🔐 **Cambiar Contraseña** - Abre diálogo para cambiar contraseña
- 🗑️ **Eliminar Usuario** - Elimina el usuario con confirmación

#### Formulario de Usuario
- **Campos obligatorios:** Login, Email, Nombre, Contraseña (en creación)
- **Campo condicional:** Código Profesional (visible solo si Es Doctor = true)
- **Checkboxes:**
  - Es Doctor (inicia en false)
  - Es Activo (inicia en true)
- **Cambios en Identity Server:** Los datos se registran y actualizan automáticamente

#### Cambiar Contraseña
- Validación de contraseña actual
- Confirmación de contraseña nueva
- Requisito mínimo de 6 caracteres

### 2. Gestión de Roles

#### Listado de Roles
- **Columnas mostradas:**
  - Nombre del Rol
  - Descripción

#### Opciones del Listado
- 🆕 **Crear Rol** - Abre formulario de creación
- ✏️ **Modificar Rol** - Abre formulario de edición
- 🗑️ **Eliminar Rol** - Elimina el rol con confirmación

#### Formulario de Rol
- **Campo obligatorio:** Nombre del Rol
- **Opciones de Sistema:** Estructura jerárquica de permisos
  - **Funcionalidad de Checkboxes:**
    - Al seleccionar un módulo, se seleccionan automáticamente todas sus opciones y acciones
    - Al deseleccionar un módulo, se desseleccionan todas sus opciones
    - Estados indeterminados cuando está parcialmente seleccionado

### 3. Asignación de Permisos

#### Layout de Tres Columnas
1. **Usuarios** (izquierda)
   - Búsqueda por nombre, login o email
   - Selección de usuario

2. **Roles Disponibles** (centro)
   - Roles no asignados al usuario seleccionado
   - Botón para asignar (+)

3. **Roles Asignados** (derecha)
   - Roles actualmente asignados
   - Botón para desvincular (🗑️)

#### Funcionalidades
- ➕ **Asignar Rol** - Añade un rol disponible al usuario
- ➖ **Desvincular Rol** - Elimina un rol asignado del usuario

## 🔧 Configuración

### URLs de API

Actualizar las URLs en los archivos de direcciones según tu infraestructura:

**`src/requests/usuarios/DireccionesRequest.js`**
```javascript
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
```

**`src/requests/roles/DireccionesRequest.js`**
```javascript
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
```

### Variables de Entorno

Agregar a `.env`:
```env
REACT_APP_API_BASE_URL=http://tu-api.com/api
```

## 📊 Estructura de Datos

### Usuario
```javascript
{
  id: string,
  login: string,
  email: string,
  contrasena: string (solo en creación),
  nombre: string,
  esDoctor: boolean (default: false),
  codigoProfesional: string (condicional),
  telefono: string,
  direccion: string,
  fechaNacimiento: date,
  edad: number (calculado),
  esActivo: boolean (default: true)
}
```

### Rol
```javascript
{
  id: string,
  nombre: string,
  descripcion: string,
  permisos: [
    {
      id: string,
      nombre: string,
      moduloId: string,
      moduloNombre: string,
      descripcion: string,
      accion: string
    }
  ]
}
```

### Permiso
```javascript
{
  id: string,
  nombre: string,
  moduloId: string,
  moduloNombre: string,
  descripcion: string,
  accion: string
}
```

## 🎯 Rutas Recomendadas

Agregar a tu Router:

```javascript
import Seguridad from './views/seguridad/Seguridad';

// En tu configuración de rutas
{
  path: 'seguridad',
  element: <Seguridad />,
  // Proteger con guard de autenticación y permisos
}
```

## 🔐 Seguridad

- ✅ Los usuarios se registran en Identity Server
- ✅ Validaciones de email único
- ✅ Contraseñas hasheadas en el backend
- ✅ Confirmación requerida para cambios críticos
- ✅ Logs de auditoría recomendados

## 📝 Notas Importantes

1. **Edad Calculada**: Se calcula automáticamente basada en la fecha de nacimiento
2. **Código Profesional**: Solo se muestra/requiere cuando Es Doctor = true
3. **Es Activo**: Inicia en true para nuevos usuarios
4. **Identity Server**: Asegurar que el backend integre correctamente con Identity Server
5. **Permisos Jerárquicos**: La selección de módulos es automática (cascada)

## 🚀 Próximas Mejoras

- [ ] Exportar usuarios/roles a Excel
- [ ] Importar usuarios desde CSV
- [ ] Auditoria de cambios
- [ ] Historial de contraseñas
- [ ] Políticas de contraseña configurable
- [ ] Multi-factor authentication
- [ ] Bloqueo de cuenta tras intentos fallidos

## 📞 Soporte

Para reportar problemas o sugerencias, contactar al equipo de desarrollo.

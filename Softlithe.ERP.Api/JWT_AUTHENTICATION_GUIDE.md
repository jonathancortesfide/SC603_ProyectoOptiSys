# JWT Authentication Implementation Guide

## Overview
Your API now has complete JWT (JSON Web Token) authentication system. All endpoints except the login endpoint require a valid JWT token.

---

## Database Setup

### 1. Create the Usuario Table

Run the `SetupAuthDatabase.sql` script in your SQL Server:

```sql
CREATE TABLE [Usuario] (
    [no_usuario] INT PRIMARY KEY IDENTITY(1,1),
    [nombre_usuario] NVARCHAR(100) NOT NULL UNIQUE,
    [correo] NVARCHAR(100) NOT NULL UNIQUE,
    [contraseña_hash] NVARCHAR(MAX) NOT NULL,
    [es_activo] BIT NOT NULL DEFAULT 1,
    [fecha_creacion] DATETIME NOT NULL DEFAULT GETDATE(),
    [fecha_modificacion] DATETIME NULL
);
```

### 2. Insert Test User

The SQL script includes a test user:
- **Username:** `admin`
- **Password:** `password123`

To use a different password, generate a BCrypt hash:

```csharp
// In your C# code:
using Softlithe.ERP.Utilidades;

string hash = PasswordHelper.HashPassword("YourNewPassword");
// Then insert this hash into the database
```

---

## How to Use

### 1. Login Endpoint

**POST** `/api/autenticacion/login`

**Request Body:**
```json
{
  "nombreUsuario": "admin",
  "contraseña": "password123"
}
```

**Response (Success):**
```json
{
  "esCorrecto": true,
  "mensaje": "Autenticación exitosa.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "noUsuario": 1,
    "nombreUsuario": "admin",
    "correo": "admin@softlithe.com"
  }
}
```

**Response (Failure):**
```json
{
  "esCorrecto": false,
  "mensaje": "Usuario o contraseña incorrectos.",
  "data": null
}
```

### 2. Use Token in Protected Endpoints

After login, include the JWT token in the Authorization header of all requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example: Get Patients**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:8090/api/Pacientes
```

### 3. Protected Endpoints

The following endpoints now require authentication:
- `GET /api/Pacientes` - Get all patients
- `GET /api/Pacientes/BuscarPacientePorNombreOIdentificacion` - Search patients
- `POST /api/Pacientes/AgregarPaciente` - Add patient
- `PUT /api/Pacientes/{numeroDePaciente}` - Update patient
- `GET /api/Pacientes/Cuentas` - Get patient accounts

The following endpoint is **public** (no token required):
- `POST /api/autenticacion/login` - Login

---

## Configuration

### appsettings.json

JWT settings are configured in `appsettings.json`:

```json
"Jwt": {
  "SecretKey": "tu_clave_secreta_muy_larga_para_jwt_debe_tener_al_menos_32_caracteres",
  "Issuer": "SoftlitheERP",
  "Audience": "SoftlitheERPApp",
  "ExpirationMinutes": 60
}
```

**Important for Production:**
- Change `SecretKey` to a long, random value (at least 32 characters)
- Use a strong, unique secret
- Store the secret in Azure Key Vault or environment variables, NOT in source code

---

## Frontend Implementation

### 1. Login and Store Token

```javascript
async function login(username, password) {
  const response = await fetch('http://localhost:8090/api/autenticacion/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombreUsuario: username,
      contraseña: password
    })
  });

  const data = await response.json();
  
  if (data.esCorrecto) {
    // Store token in localStorage
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('usuario', JSON.stringify(data.data));
    return true;
  } else {
    console.error(data.mensaje);
    return false;
  }
}
```

### 2. Add Token to Requests

```javascript
async function getPacientes() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:8090/api/Pacientes', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return await response.json();
}
```

### 3. Handle Token Expiration

```javascript
async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem('token');
  
  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  let response = await fetch(url, options);

  // If token expired (401), redirect to login
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  }

  return response;
}
```

---

## Adding New Users

### Option 1: SQL Insert

```sql
-- First, generate the hash using BCrypt
-- Password: YourPassword
-- Hash: $2a$11/[generated-hash-here]

INSERT INTO [admin_user] ([nombre_usuario], [correo], [contraseña_hash], [es_activo])
VALUES ('newuser', 'user@softlithe.com', '[generated-hash]', 1);
```

### Option 2: Create an Admin Endpoint (Optional)

You can create a registration endpoint that:
1. Validates the input
2. Generates a BCrypt hash
3. Inserts the new user into the database

---

## Token Claims

Each JWT token contains the following claims:

- `NameIdentifier`: User ID (noUsuario)
- `Name`: Username (nombreUsuario)
- `Email`: User email (correo)
- `noUsuario`: User ID (custom claim)
- `exp`: Expiration time (60 minutes by default)
- `iss`: Issuer (SoftlitheERP)
- `aud`: Audience (SoftlitheERPApp)

You can access these claims in your controllers:

```csharp
[Authorize]
[HttpGet]
public IActionResult GetUserInfo()
{
  var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
  var username = User.FindFirst(ClaimTypes.Name)?.Value;
  var email = User.FindFirst(ClaimTypes.Email)?.Value;
  
  return Ok(new { userId, username, email });
}
```

---

## Troubleshooting

### "Invalid token" error

- Token has expired (generate a new one by logging in again)
- Token is malformed
- Secret key in appsettings.json doesn't match the one used to create the token

### "Unauthorized" response

- Missing Authorization header
- Token format is incorrect (should be `Bearer [token]`)
- User is not active in the database (`es_activo = 0`)

### "Username or password incorrect"

- Check username and password in the Usuario table
- Ensure the user's `es_activo` column is set to 1 (true)
- Verify the BCrypt hash is correct

---

## Security Best Practices

1. **Use HTTPS** in production
2. **Store secret key securely** (not in source code)
3. **Use strong passwords** for users
4. **Rotate tokens** periodically
5. **Implement token refresh** for long-lived sessions
6. **Log authentication** events
7. **Add rate limiting** to login endpoint
8. **Validate all inputs** on both frontend and backend

---

## Files Modified/Created

- ✅ `Softlithe.ERP.DA/Modelos/Usuario.cs` - User model
- ✅ `Softlithe.ERP.DA/Modelos/ContextoBasedeDatos.cs` - Added Usuarios DbSet
- ✅ `Softlithe.ERP.DA/Autenticacion/AutenticacionDA.cs` - Data access layer
- ✅ `Softlithe.ERP.BW/Autenticacion/AutenticacionBW.cs` - Business logic layer
- ✅ `Softlithe.ERP.BW/Servicios/TokenService.cs` - JWT token generation
- ✅ `Softlithe.ERP.Api/Controllers/AutenticacionController.cs` - Authentication endpoint
- ✅ `Softlithe.ERP.Api/Program.cs` - JWT configuration and middleware
- ✅ `Softlithe.ERP.Api/Controllers/PacientesController.cs` - Added [Authorize] attribute
- ✅ `appsettings.json` - JWT settings
- ✅ Abstracciones interfaces for authentication
- ✅ `SetupAuthDatabase.sql` - Database setup script
- ✅ `Softlithe.ERP.Abstracciones/Utilidades/PasswordHelper.cs` - Password utility

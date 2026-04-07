-- Drop old Usuario table if it exists
IF OBJECT_ID('[Usuario]', 'U') IS NOT NULL
    DROP TABLE [Usuario];

-- Drop admin_user table if it exists (to ensure fresh start)
IF OBJECT_ID('[admin_user]', 'U') IS NOT NULL
    DROP TABLE [admin_user];

-- Create the admin_user table
CREATE TABLE [admin_user] (
    [no_usuario] INT PRIMARY KEY IDENTITY(1,1),
    [nombre_usuario] NVARCHAR(100) NOT NULL UNIQUE,
    [correo] NVARCHAR(100) NOT NULL UNIQUE,
    [contraseña_hash] NVARCHAR(MAX) NOT NULL,
    [es_activo] BIT NOT NULL DEFAULT 1,
    [fecha_creacion] DATETIME NOT NULL DEFAULT GETDATE(),
    [fecha_modificacion] DATETIME NULL
);

-- Insert a test admin user
-- Password: password123
-- This hash was generated with BCrypt.Net.BCrypt.HashPassword("password123")

INSERT INTO [admin_user] ([nombre_usuario], [correo], [contraseña_hash], [es_activo], [fecha_creacion])
VALUES (
    'admin',
    'admin@softlithe.com',
    '$2a$11$YRanKBuLvGFqfO.2P.1tNeXpY9Qfv/VNCbYj2K7QQc6B1xLNLhVvW', -- "password123"
    1,
    GETDATE()
);

-- To generate your own password hash, you can use this C# code:
-- string password = "YourPassword";
-- string hash = BCrypt.Net.BCrypt.HashPassword(password);
-- Then update the INSERT statement with your hash

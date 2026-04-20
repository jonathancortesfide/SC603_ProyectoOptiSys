-- Query to check the current admin user in the database
SELECT 
    [no_usuario],
    [nombre_usuario],
    [correo],
    [contraseña_hash],
    [es_activo],
    [fecha_creacion],
    [fecha_modificacion]
FROM [admin_user]
WHERE [nombre_usuario] = 'admin';

-- If you want to update the hash directly, use this SQL:
-- UPDATE [admin_user]
-- SET [contraseña_hash] = '$2a$11$YRanKBuLvGFqfO.2P.1tNeXpY9Qfv/VNCbYj2K7QQc6B1xLNLhVvW'
-- WHERE [nombre_usuario] = 'admin';

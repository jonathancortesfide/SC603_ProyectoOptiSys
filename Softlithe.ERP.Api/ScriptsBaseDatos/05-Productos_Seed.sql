-- ================================================================
-- Script para insertar productos de ejemplo
-- Base de datos: dbDesarrollo
-- Tablas: Producto, ProductoDetalle
-- ================================================================

-- Verificar que la tabla Producto existe
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Producto')
BEGIN
    PRINT 'ERROR: La tabla Producto no existe. Verifica la estructura de la base de datos.'
    RETURN
END

-- Verificar que la tabla ProductoDetalle existe
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ProductoDetalle')
BEGIN
    PRINT 'ERROR: La tabla ProductoDetalle no existe. Verifica la estructura de la base de datos.'
    RETURN
END

-- ================================================================
-- INSERTAR PRODUCTOS
-- ================================================================

INSERT INTO [dbo].[Producto] (
    [codigo],
    [no_empresa],
    [codigo_barra],
    [codigo_proveedor],
    [descripcion],
    [no_grupo],
    [activo],
    [no_unidad_medida],
    [costo_promedio],
    [ultimo_costo],
    [ultimo_precio_costo],
    [tipo_producto],
    [no_tipo],
    [no_marca],
    [codigo_material],
    [codigo_impuesto],
    [no_tarifa],
    [codigo_cabys]
)
VALUES
-- Producto 1: Laptop
('PROD001', 1, '123456789012', 'PROV001', 'Laptop Dell XPS 13 - Aluminio', 5, 1, 1, 800.00, 850.00, 900.00, 'IN', 2, 10, 'MAT001', '01', '13', 'CABYS001'),

-- Producto 2: Mouse
('PROD002', 1, '123456789013', 'PROV002', 'Mouse Logitech MX Master 3S', 5, 1, 1, 25.00, 30.00, 35.00, 'AC', 3, 20, 'MAT002', '01', '13', 'CABYS002'),

-- Producto 3: Teclado
('PROD003', 1, '123456789014', 'PROV003', 'Teclado Mecánico RGB Corsair K95', 5, 1, 1, 80.00, 90.00, 100.00, 'AC', 3, 30, 'MAT003', '01', '13', 'CABYS003'),

-- Producto 4: Monitor
('PROD004', 1, '123456789015', 'PROV004', 'Monitor Samsung 27" 4K UltraHD', 5, 1, 1, 200.00, 220.00, 240.00, 'IN', 4, 40, 'MAT004', '01', '13', 'CABYS004'),

-- Producto 5: Cable HDMI
('PROD005', 1, '123456789016', 'PROV005', 'Cable HDMI 2.0 de 3 metros', 5, 1, 1, 5.00, 6.00, 7.00, 'AC', 5, 50, 'MAT005', '01', '13', 'CABYS005'),

-- Producto 6: Webcam
('PROD006', 1, '123456789017', 'PROV006', 'Webcam Logitech C920 Pro', 5, 1, 1, 45.00, 50.00, 60.00, 'IN', 6, 60, 'MAT006', '01', '13', 'CABYS006'),

-- Producto 7: Micrófono
('PROD007', 1, '123456789018', 'PROV007', 'Micrófono Blue Yeti Nano', 5, 1, 1, 60.00, 70.00, 80.00, 'IN', 7, 70, 'MAT007', '01', '13', 'CABYS007'),

-- Producto 8: Auriculares
('PROD008', 1, '123456789019', 'PROV008', 'Auriculares Sony WH-1000XM5', 5, 1, 1, 150.00, 180.00, 200.00, 'IN', 8, 80, 'MAT008', '01', '13', 'CABYS008'),

-- Producto 9: SSD
('PROD009', 1, '123456789020', 'PROV009', 'SSD Samsung 970 EVO Plus 1TB', 5, 1, 1, 120.00, 130.00, 150.00, 'IN', 9, 90, 'MAT009', '01', '13', 'CABYS009'),

-- Producto 10: RAM
('PROD010', 1, '123456789021', 'PROV010', 'RAM Corsair DDR4 32GB 3200MHz', 5, 1, 1, 110.00, 120.00, 140.00, 'IN', 10, 100, 'MAT010', '01', '13', 'CABYS010');

-- ================================================================
-- INSERTAR DETALLES DE PRODUCTOS
-- ================================================================

INSERT INTO [dbo].[ProductoDetalle] (
    [id_producto],
    [existencia],
    [minimo],
    [perecedero],
    [caracteristicas_adic]
)
SELECT 
    p.[id_producto],
    CASE 
        WHEN p.[codigo] = 'PROD001' THEN 5
        WHEN p.[codigo] = 'PROD002' THEN 25
        WHEN p.[codigo] = 'PROD003' THEN 10
        WHEN p.[codigo] = 'PROD004' THEN 8
        WHEN p.[codigo] = 'PROD005' THEN 50
        WHEN p.[codigo] = 'PROD006' THEN 15
        WHEN p.[codigo] = 'PROD007' THEN 12
        WHEN p.[codigo] = 'PROD008' THEN 6
        WHEN p.[codigo] = 'PROD009' THEN 20
        WHEN p.[codigo] = 'PROD010' THEN 18
        ELSE 0
    END AS existencia,
    CASE 
        WHEN p.[codigo] = 'PROD001' THEN 2.0
        WHEN p.[codigo] = 'PROD002' THEN 10.0
        WHEN p.[codigo] = 'PROD003' THEN 5.0
        WHEN p.[codigo] = 'PROD004' THEN 3.0
        WHEN p.[codigo] = 'PROD005' THEN 20.0
        ELSE 5.0
    END AS minimo,
    0 AS perecedero,
    CASE 
        WHEN p.[codigo] = 'PROD001' THEN 'Pantalla FHD, Procesador Intel i7, 16GB RAM, SSD 512GB'
        WHEN p.[codigo] = 'PROD002' THEN 'Sensor 4K, Batería 8 días, Bluetooth 5.0'
        WHEN p.[codigo] = 'PROD003' THEN 'Switches mecánicos Cherry MX, iluminación RGB personalizable'
        WHEN p.[codigo] = 'PROD004' THEN 'Resolución 4K, Panel IPS, tiempo respuesta 1ms'
        WHEN p.[codigo] = 'PROD005' THEN 'Soporta 4K 60Hz, cable de alta calidad'
        WHEN p.[codigo] = 'PROD006' THEN 'Resolución 1080p, autofocus automático'
        WHEN p.[codigo] = 'PROD007' THEN 'Micrófono USB, filtro pop incluido'
        WHEN p.[codigo] = 'PROD008' THEN 'Cancelación de ruido adaptativa, batería 8 horas'
        WHEN p.[codigo] = 'PROD009' THEN 'NVMe, velocidad lectura 3500 MB/s'
        WHEN p.[codigo] = 'PROD010' THEN 'Doble canal, compatibilidad amplia'
        ELSE ''
    END AS caracteristicas_adic
FROM [dbo].[Producto] p
WHERE p.[no_empresa] = 1 
  AND p.[codigo] IN ('PROD001', 'PROD002', 'PROD003', 'PROD004', 'PROD005', 'PROD006', 'PROD007', 'PROD008', 'PROD009', 'PROD010');

-- ================================================================
-- VERIFICACIÓN Y REPORTE
-- ================================================================

PRINT '========================================';
PRINT 'Productos insertados exitosamente!';
PRINT '========================================';

SELECT 
    COUNT(*) AS [Total Productos]
FROM [dbo].[Producto] 
WHERE [no_empresa] = 1;

SELECT 
    COUNT(*) AS [Total Detalles]
FROM [dbo].[ProductoDetalle];

PRINT '';
PRINT 'Listado de productos insertados:';
PRINT '';

SELECT 
    p.[id_producto] AS [ID],
    p.[codigo] AS [Código],
    p.[descripcion] AS [Descripción],
    pd.[existencia] AS [Existencia],
    p.[costo_promedio] AS [Costo Promedio],
    p.[activo] AS [Activo]
FROM [dbo].[Producto] p
LEFT JOIN [dbo].[ProductoDetalle] pd ON p.[id_producto] = pd.[id_producto]
WHERE p.[no_empresa] = 1
ORDER BY p.[id_producto];


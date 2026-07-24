-- ============================================================
-- Script: 08-TipoLente_Precios_Seed.sql
-- Descripcion: Asigna precios iniciales en colones costarricenses (CRC)
--              a los tipos de lente existentes.
-- Fecha: 2026-07-24
-- ============================================================

UPDATE TipoLente SET Price = 15000.00 WHERE descripcion = 'Monofocal';
UPDATE TipoLente SET Price = 25000.00 WHERE descripcion = 'Bifocal';
UPDATE TipoLente SET Price = 35000.00 WHERE descripcion = 'Trifocal';
UPDATE TipoLente SET Price = 55000.00 WHERE descripcion = 'Progresivo';
UPDATE TipoLente SET Price = 18000.00 WHERE descripcion = 'Cóncavas';
UPDATE TipoLente SET Price = 22000.00 WHERE descripcion = 'Mouse';

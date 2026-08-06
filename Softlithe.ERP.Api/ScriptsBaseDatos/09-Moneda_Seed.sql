-- ============================================================
-- Script: 09-Moneda_Seed.sql
-- Descripcion: Inserta las monedas base: Colón costarricense y
--              Dólar estadounidense.
-- Fecha: 2026-07-24
-- ============================================================

INSERT INTO Moneda (no_moneda, descripcion, signo, url)
VALUES (1, 'Colón CR', '₡', 'CRC');

INSERT INTO Moneda (no_moneda, descripcion, signo, url)
VALUES (2, 'Dólar USD', '$', 'USD');

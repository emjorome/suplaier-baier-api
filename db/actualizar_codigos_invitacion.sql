-- Script para actualizar códigos de invitación de usuarios existentes
-- Base de datos: DbContabilly

USE DbContabilly;

-- Actualizar códigos de invitación para usuarios que no tienen uno
-- El formato es: primera letra del nombre + apellido + identificación

-- Walther Duran
UPDATE Usuario 
SET codigo_invitacion = 'wduran1205801515' 
WHERE IdUsuario = 1 AND codigo_invitacion IS NULL;

-- Karla Duran
UPDATE Usuario 
SET codigo_invitacion = 'kduran1205801516' 
WHERE IdUsuario = 2 AND codigo_invitacion IS NULL;

-- Verificar los cambios
SELECT IdUsuario, Nombre, Email, codigo_invitacion 
FROM Usuario 
WHERE IdRol = 1;

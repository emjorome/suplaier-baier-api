-- ============================================================================
-- Admin_Recompensas_ReporteRegistrados.sql
-- Niveles de recompensa + reporte de usuarios registrados
-- Base de datos: DbContabilly
-- ============================================================================

USE DbContabilly;

-- ============================================================================
-- 1) TABLA NivelRecompensa
-- ============================================================================

CREATE TABLE IF NOT EXISTS NivelRecompensa (
  IdNivelRecompensa    INT AUTO_INCREMENT PRIMARY KEY,
  UmbralMinInvitados   INT NOT NULL,
  EstrellasPorInvitado INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Asegurar que exista al menos el nivel 1 (DEFAULT)
INSERT INTO NivelRecompensa (IdNivelRecompensa, UmbralMinInvitados, EstrellasPorInvitado)
VALUES (1, 0, 50)
ON DUPLICATE KEY UPDATE IdNivelRecompensa = IdNivelRecompensa;

-- ============================================================================
-- 2) Modificar USUARIO:
--    - estrellas_acumuladas
--    - IdNivelRecompensa (DEFAULT 1)
-- ============================================================================

-- Asegurar columna estrellas_acumuladas
SET @existe_estrellas := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'Usuario'
    AND COLUMN_NAME  = 'estrellas_acumuladas'
);

SET @sql_estrellas := IF(
  @existe_estrellas = 0,
  'ALTER TABLE Usuario ADD COLUMN estrellas_acumuladas INT NOT NULL DEFAULT 0',
  'SELECT "ok"'
);
PREPARE stmt FROM @sql_estrellas;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Asegurar columna IdNivelRecompensa con DEFAULT 1 (dejándola NULLable)
SET @existe_nivel := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'Usuario'
    AND COLUMN_NAME  = 'IdNivelRecompensa'
);

SET @sql_nivel := IF(
  @existe_nivel = 0,
  'ALTER TABLE Usuario ADD COLUMN IdNivelRecompensa INT NULL DEFAULT 1',
  'ALTER TABLE Usuario MODIFY COLUMN IdNivelRecompensa INT NULL DEFAULT 1'
);
PREPARE stmt2 FROM @sql_nivel;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- Poner en 1 cualquier usuario que tenga NULL
UPDATE Usuario
SET IdNivelRecompensa = 1
WHERE IdNivelRecompensa IS NULL;

-- Asegurar FK Usuario -> NivelRecompensa
SET @existe_fk_nivel := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'Usuario'
    AND CONSTRAINT_NAME = 'fk_usuario_nivelrecompensa'
);

SET @sql_fk_nivel := IF(
  @existe_fk_nivel = 0,
  'ALTER TABLE Usuario
     ADD CONSTRAINT fk_usuario_nivelrecompensa
       FOREIGN KEY (IdNivelRecompensa)
       REFERENCES NivelRecompensa (IdNivelRecompensa)',
  'SELECT "ok"'
);
PREPARE stmt3 FROM @sql_fk_nivel;
EXECUTE stmt3;
DEALLOCATE PREPARE stmt3;

-- ============================================================================
-- 3) PROCEDURE CanjearCodigoInvitacion
-- ============================================================================

DELIMITER $$

DROP PROCEDURE IF EXISTS CanjearCodigoInvitacion$$
CREATE PROCEDURE CanjearCodigoInvitacion(
  IN p_IdUsuario INT,
  IN p_Codigo    VARCHAR(64),
  IN p_Estrellas INT
)
BEGIN
  DECLARE dup TINYINT DEFAULT 0;

  DECLARE CONTINUE HANDLER FOR 1062 SET dup = 1;

  INSERT INTO InvitacionCanje (IdUsuario, Codigo, Estrellas)
  VALUES (p_IdUsuario, p_Codigo, p_Estrellas);

  IF dup = 1 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Este código ya fue canjeado por este usuario.';
  ELSE
    UPDATE Usuario
    SET estrellas_acumuladas = estrellas_acumuladas + p_Estrellas
    WHERE IdUsuario = p_IdUsuario;
  END IF;

  SELECT u.IdUsuario,
         u.Nombre,
         u.estrellas_acumuladas
  FROM Usuario u
  WHERE u.IdUsuario = p_IdUsuario;
END$$

-- ============================================================================
-- 4) PROCEDURE AsignarNivelRecompensa
-- ============================================================================

DROP PROCEDURE IF EXISTS AsignarNivelRecompensa$$
CREATE PROCEDURE AsignarNivelRecompensa(
  IN p_IdAdmin           INT,
  IN p_IdUsuarioObjetivo INT,
  IN p_IdNivelRecompensa INT
)
BEGIN
  DECLARE v_esAdmin INT;

  -- Acepta 'ADMIN', 'ADMINISTRADOR' o cualquier rol que empiece por 'admin'
  SELECT COUNT(*)
  INTO v_esAdmin
  FROM Usuario u
  INNER JOIN Rol r ON u.IdRol = r.IdRol
  WHERE u.IdUsuario = p_IdAdmin
    AND (
         UPPER(r.Rol) = 'ADMIN'
         OR UPPER(r.Rol) = 'ADMINISTRADOR'
         OR UPPER(r.Rol) LIKE 'ADMIN%'
        );

  IF v_esAdmin = 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'El usuario no tiene permisos de administrador.';
  ELSE
    UPDATE Usuario
    SET IdNivelRecompensa = p_IdNivelRecompensa
    WHERE IdUsuario = p_IdUsuarioObjetivo;

    SELECT u.IdUsuario,
           u.Nombre,
           u.Email,
           u.estrellas_acumuladas,
           u.IdNivelRecompensa,
           n.UmbralMinInvitados,
           n.EstrellasPorInvitado
    FROM Usuario u
    LEFT JOIN NivelRecompensa n
           ON u.IdNivelRecompensa = n.IdNivelRecompensa
    WHERE u.IdUsuario = p_IdUsuarioObjetivo;
  END IF;
END$$

-- ============================================================================
-- 5) VISTA Y REPORTE DE USUARIOS REGISTRADOS
-- ============================================================================

DROP VIEW IF EXISTS vw_UsuariosRegistrados$$
CREATE VIEW vw_UsuariosRegistrados AS
SELECT 
    u.IdUsuario,
    u.Nombre,
    u.Identificacion,
    u.Usuario,
    u.Email,
    u.Numero,
    u.Pais,
    u.Provincia,
    u.Ciudad,
    u.Direccion,
    u.estrellas_acumuladas,
    u.IdNivelRecompensa,
    n.UmbralMinInvitados,
    n.EstrellasPorInvitado,
    u.codigo_invitacion
FROM Usuario u
LEFT JOIN NivelRecompensa n
       ON u.IdNivelRecompensa = n.IdNivelRecompensa$$

DROP PROCEDURE IF EXISTS ReporteUsuariosRegistrados$$
CREATE PROCEDURE ReporteUsuariosRegistrados(
  IN p_Pais              VARCHAR(50),
  IN p_IdNivelRecompensa INT
)
BEGIN
  SELECT *
  FROM vw_UsuariosRegistrados
  WHERE (p_Pais IS NULL OR p_Pais = '' OR Pais = p_Pais)
    AND (p_IdNivelRecompensa IS NULL OR p_IdNivelRecompensa = 0 
         OR IdNivelRecompensa = p_IdNivelRecompensa)
  ORDER BY Nombre;
END$$

DELIMITER ;

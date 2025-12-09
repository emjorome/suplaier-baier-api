-- ============================================================================
-- Sistema_Descuentos_Estrellas.sql
-- Sistema de canje de estrellas por descuentos
-- Base de datos: DbContabilly
-- Versión: 1.0
-- ============================================================================

USE DbContabilly;

-- ============================================================================
-- 1) TABLA opciones_descuento
-- ============================================================================

CREATE TABLE IF NOT EXISTS opciones_descuento (
  IdOpcion INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(50) NOT NULL,
  CostoEstrellas INT NOT NULL,
  Porcentaje DECIMAL(5,2) NOT NULL,
  Activo BOOL DEFAULT TRUE,
  FechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_porcentaje CHECK (Porcentaje >= 0 AND Porcentaje <= 100),
  CONSTRAINT chk_estrellas CHECK (CostoEstrellas > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- 2) MODIFICAR TABLA Compra - Agregar IdOpcionDescuento
-- ============================================================================

-- Verificar si la columna ya existe antes de agregarla
SET @existe_opcion := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Compra'
    AND COLUMN_NAME = 'IdOpcionDescuento'
);

SET @sql_opcion := IF(
  @existe_opcion = 0,
  'ALTER TABLE Compra ADD COLUMN IdOpcionDescuento INT NULL',
  'SELECT "La columna IdOpcionDescuento ya existe" AS Mensaje'
);

PREPARE stmt FROM @sql_opcion;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Crear Foreign Key si no existe
SET @existe_fk_opcion := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Compra'
    AND CONSTRAINT_NAME = 'fk_compra_opcion_descuento'
);

SET @sql_fk_opcion := IF(
  @existe_fk_opcion = 0,
  'ALTER TABLE Compra
     ADD CONSTRAINT fk_compra_opcion_descuento
       FOREIGN KEY (IdOpcionDescuento)
       REFERENCES opciones_descuento (IdOpcion)
       ON DELETE SET NULL
       ON UPDATE CASCADE',
  'SELECT "La FK fk_compra_opcion_descuento ya existe" AS Mensaje'
);

PREPARE stmt2 FROM @sql_fk_opcion;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- ==========================================================
-- 2.2. PRIMER PRODUCTO: Manzanas (Categoría 2 - Frutas)
-- ==========================================================

-- A) Insertar el Producto
INSERT INTO producto (IdProveedor, IdCatProducto, Descripcion, Activo, UrlImg, Name, FechaCreacion, FechaModificacion, Valoracion)
VALUES (
    6,              -- IdProveedor
    2,              -- IdCatProducto
    'Manzanas rojas frescas importadas', 
    1,              -- Activo
    'no-img.jpeg',  -- Imagen por defecto
    'Manzanas Gala', 
    NOW(), 
    NOW(), 
    5.0             -- Valoración inicial
);

-- Guardamos el ID del producto recién creado en una variable
SET @idProd1 = LAST_INSERT_ID();

-- B) Crear la Oferta para este Producto
INSERT INTO oferta (IdProducto, IdProveedor, IdEstadosOferta, Minimo, Maximo, Descripcion, ActualProductos, FechaLimite, FechaCreacion, FechaModificacion, Estado, ValorUProducto, ValorUInstantaneo)
VALUES (
    @idProd1,       -- Usamos el ID del producto creado arriba
    6,              -- IdProveedor (Mismo que el producto)
    1,              -- IdEstadosOferta (1 = Activa)
    10,             -- Mínimo
    500,            -- Máximo
    'Oferta de Manzanas por cajón', 
    0,              -- ActualProductos
    '2025-12-31 23:59:59', -- Fecha Límite (Formato correcto)
    NOW(), 
    NOW(), 
    1,              -- Estado
    1.50,           -- Precio Normal
    1.20            -- Precio Instantáneo
);


-- ==========================================================
-- 2.3 SEGUNDO PRODUCTO: Cemento (Categoría 6 - Construcción)
-- ==========================================================

-- A) Insertar el Producto
INSERT INTO producto (IdProveedor, IdCatProducto, Descripcion, Activo, UrlImg, Name, FechaCreacion, FechaModificacion, Valoracion)
VALUES (
    3,              -- IdProveedor
    6,              -- IdCatProducto
    'Saco de cemento de 50kg alta resistencia', 
    1,              -- Activo
    'no-img.jpeg', 
    'Cemento Holcim', 
    NOW(), 
    NOW(), 
    4.5             -- Valoración inicial
);

-- Guardamos el ID del segundo producto
SET @idProd2 = LAST_INSERT_ID();

-- B) Crear la Oferta para este Producto
INSERT INTO oferta (IdProducto, IdProveedor, IdEstadosOferta, Minimo, Maximo, Descripcion, ActualProductos, FechaLimite, FechaCreacion, FechaModificacion, Estado, ValorUProducto, ValorUInstantaneo)
VALUES (
    @idProd2,       -- Usamos el ID del segundo producto
    3,              -- IdProveedor
    1,              -- IdEstadosOferta
    50,             -- Mínimo
    200,            -- Máximo
    'Cemento al por mayor para obras', 
    0,              -- ActualProductos
    '2025-12-31 23:59:59', 
    NOW(), 
    NOW(), 
    1, 
    8.50,           -- Precio Normal
    7.90            -- Precio Instantáneo
);

-- ============================================================================
-- 3) DATOS SEMILLA - Opciones de Descuento (Bronce, Plata, Oro)
-- ============================================================================

INSERT INTO opciones_descuento (Nombre, CostoEstrellas, Porcentaje, Activo)
VALUES 
  ('Bronce', 100, 5.00, TRUE),
  ('Plata', 250, 10.00, TRUE),
  ('Oro', 500, 20.00, TRUE)
ON DUPLICATE KEY UPDATE IdOpcion = IdOpcion;

-- ============================================================================
-- 4) PROCEDIMIENTO ALMACENADO - Validar y Aplicar Descuento
-- ============================================================================
-- Este procedimiento es útil para el backend cuando procesa el POST /compras
-- ============================================================================

DELIMITER $$

DROP PROCEDURE IF EXISTS ValidarYAplicarDescuento$$

CREATE PROCEDURE ValidarYAplicarDescuento(
  IN p_IdUsuario INT,
  IN p_IdOpcionDescuento INT,
  IN p_TotalOriginal DECIMAL(10,2),
  OUT p_TotalFinal DECIMAL(10,2),
  OUT p_EstrellasGastadas INT,
  OUT p_PorcentajeDescuento DECIMAL(5,2),
  OUT p_Valido BOOLEAN,
  OUT p_MensajeError VARCHAR(255)
)
BEGIN
  DECLARE v_CostoEstrellas INT;
  DECLARE v_EstrellasDisponibles INT;
  DECLARE v_Porcentaje DECIMAL(5,2);
  DECLARE v_Activo BOOLEAN;
  
  -- Inicializar valores de salida
  SET p_Valido = FALSE;
  SET p_MensajeError = NULL;
  SET p_TotalFinal = p_TotalOriginal;
  SET p_EstrellasGastadas = 0;
  SET p_PorcentajeDescuento = 0.00;
  
  -- Obtener información de la opción de descuento
  SELECT CostoEstrellas, Porcentaje, Activo
  INTO v_CostoEstrellas, v_Porcentaje, v_Activo
  FROM opciones_descuento
  WHERE IdOpcion = p_IdOpcionDescuento;
  
  -- Verificar si la opción existe
  IF v_CostoEstrellas IS NULL THEN
    SET p_MensajeError = 'La opción de descuento no existe.';
    SET p_Valido = FALSE;
  
  -- Verificar si la opción está activa
  ELSEIF v_Activo = FALSE THEN
    SET p_MensajeError = 'La opción de descuento no está disponible.';
    SET p_Valido = FALSE;
  
  ELSE
    -- Obtener estrellas disponibles del usuario
    SELECT estrellas_acumuladas
    INTO v_EstrellasDisponibles
    FROM Usuario
    WHERE IdUsuario = p_IdUsuario;
    
    -- Verificar si tiene suficientes estrellas
    IF v_EstrellasDisponibles < v_CostoEstrellas THEN
      SET p_MensajeError = CONCAT('Estrellas insuficientes. Tienes: ', v_EstrellasDisponibles, ', necesitas: ', v_CostoEstrellas);
      SET p_Valido = FALSE;
    
    ELSE
      -- TODO VÁLIDO: Calcular el total final con descuento
      SET p_TotalFinal = p_TotalOriginal - (p_TotalOriginal * v_Porcentaje / 100);
      SET p_EstrellasGastadas = v_CostoEstrellas;
      SET p_PorcentajeDescuento = v_Porcentaje;
      SET p_Valido = TRUE;
    END IF;
  END IF;
  
END$$

-- ============================================================================
-- 5) PROCEDIMIENTO - Aplicar Descuento en Compra (Post-Creación)
-- ============================================================================
-- Este se usa después de crear la compra para registrar el canje
-- ============================================================================

DROP PROCEDURE IF EXISTS AplicarDescuentoCompra$$

CREATE PROCEDURE AplicarDescuentoCompra(
  IN p_IdCompra INT,
  IN p_IdUsuario INT,
  IN p_IdOpcionDescuento INT
)
BEGIN
  DECLARE v_CostoEstrellas INT;
  DECLARE v_EstrellasDisponibles INT;
  DECLARE v_Porcentaje DECIMAL(5,2);
  DECLARE v_Total DECIMAL(10,2);
  DECLARE v_NuevoTotal DECIMAL(10,2);
  
  -- Obtener información de la opción de descuento
  SELECT CostoEstrellas, Porcentaje
  INTO v_CostoEstrellas, v_Porcentaje
  FROM opciones_descuento
  WHERE IdOpcion = p_IdOpcionDescuento AND Activo = TRUE;
  
  -- Verificar si la opción existe
  IF v_CostoEstrellas IS NULL THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'La opción de descuento no existe o no está activa.';
  END IF;
  
  -- Obtener estrellas disponibles del usuario
  SELECT estrellas_acumuladas
  INTO v_EstrellasDisponibles
  FROM Usuario
  WHERE IdUsuario = p_IdUsuario;
  
  -- Verificar si tiene suficientes estrellas
  IF v_EstrellasDisponibles < v_CostoEstrellas THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'No tienes suficientes estrellas para este descuento.';
  END IF;
  
  -- Obtener el total de la compra
  SELECT Total
  INTO v_Total
  FROM Compra
  WHERE IdCompra = p_IdCompra AND IdComprador = p_IdUsuario;
  
  -- Verificar que la compra existe y pertenece al usuario
  IF v_Total IS NULL THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'La compra no existe o no pertenece a este usuario.';
  END IF;
  
  -- Calcular nuevo total con descuento
  SET v_NuevoTotal = v_Total - (v_Total * v_Porcentaje / 100);
  
  -- Actualizar la compra con el descuento aplicado
  UPDATE Compra
  SET IdOpcionDescuento = p_IdOpcionDescuento,
      Total = v_NuevoTotal
  WHERE IdCompra = p_IdCompra;
  
  -- Descontar las estrellas del usuario
  UPDATE Usuario
  SET estrellas_acumuladas = estrellas_acumuladas - v_CostoEstrellas
  WHERE IdUsuario = p_IdUsuario;
  
  -- Registrar el canje en el historial
  INSERT INTO historial_canjes (IdCompra, IdUsuario, EstrellasGastadas)
  VALUES (p_IdCompra, p_IdUsuario, v_CostoEstrellas);
  
  -- Retornar información del descuento aplicado
  SELECT 
    p_IdCompra AS IdCompra,
    v_Total AS TotalOriginal,
    v_NuevoTotal AS TotalConDescuento,
    v_Porcentaje AS PorcentajeDescuento,
    v_CostoEstrellas AS EstrellasGastadas,
    (v_EstrellasDisponibles - v_CostoEstrellas) AS EstrellasRestantes;
    
END$$

-- ============================================================================
-- 6) PROCEDIMIENTO - Consultar Opciones Disponibles para Usuario
-- ============================================================================
-- Para el endpoint GET /recompensas/canjes
-- ============================================================================

DROP PROCEDURE IF EXISTS ConsultarOpcionesDescuento$$

CREATE PROCEDURE ConsultarOpcionesDescuento(
  IN p_IdUsuario INT
)
BEGIN
  DECLARE v_EstrellasDisponibles INT;
  
  -- Obtener estrellas del usuario
  SELECT estrellas_acumuladas
  INTO v_EstrellasDisponibles
  FROM Usuario
  WHERE IdUsuario = p_IdUsuario;
  
  -- Listar opciones con indicador de disponibilidad
  -- ORDENADAS POR COSTO (requisito del Scrum Master)
  SELECT 
    IdOpcion,
    Nombre,
    CostoEstrellas,
    Porcentaje,
    v_EstrellasDisponibles AS EstrellasUsuario,
    CASE 
      WHEN v_EstrellasDisponibles >= CostoEstrellas THEN TRUE
      ELSE FALSE
    END AS PuedeAplicar,
    CASE
      WHEN v_EstrellasDisponibles >= CostoEstrellas THEN 0
      ELSE (CostoEstrellas - v_EstrellasDisponibles)
    END AS EstrellasFaltantes,
    Activo
  FROM opciones_descuento
  WHERE Activo = TRUE
  ORDER BY CostoEstrellas ASC;
  
END$$

-- ============================================================================
-- 7) PROCEDIMIENTO - Obtener Saldo de Estrellas del Usuario
-- ============================================================================
-- Para el endpoint GET /usuarios/{id}/estrellas o incluir en perfil
-- ============================================================================

DROP PROCEDURE IF EXISTS ObtenerSaldoEstrellas$$

CREATE PROCEDURE ObtenerSaldoEstrellas(
  IN p_IdUsuario INT
)
BEGIN
  SELECT 
    IdUsuario,
    Nombre,
    Email,
    estrellas_acumuladas AS SaldoEstrellas,
    (SELECT COUNT(*) FROM historial_canjes WHERE IdUsuario = p_IdUsuario) AS TotalCanjes,
    (SELECT COALESCE(SUM(EstrellasGastadas), 0) FROM historial_canjes WHERE IdUsuario = p_IdUsuario) AS TotalEstrellasGastadas
  FROM Usuario
  WHERE IdUsuario = p_IdUsuario;
END$$

-- ============================================================================
-- 8) PROCEDIMIENTO - Historial de Canjes del Usuario
-- ============================================================================

DROP PROCEDURE IF EXISTS ObtenerHistorialCanjes$$

CREATE PROCEDURE ObtenerHistorialCanjes(
  IN p_IdUsuario INT
)
BEGIN
  SELECT 
    hc.IdCanje,
    hc.IdCompra,
    hc.EstrellasGastadas,
    hc.FechaCanje,
    c.Total AS TotalCompra,
    od.Nombre AS NombreDescuento,
    od.Porcentaje AS PorcentajeDescuento,
    od.CostoEstrellas
  FROM historial_canjes hc
  INNER JOIN Compra c ON hc.IdCompra = c.IdCompra
  INNER JOIN opciones_descuento od ON c.IdOpcionDescuento = od.IdOpcion
  WHERE hc.IdUsuario = p_IdUsuario
  ORDER BY hc.FechaCanje DESC;
END$$

DELIMITER ;

-- ============================================================================
-- 9) VERIFICACIÓN DE INSTALACIÓN
-- ============================================================================

SELECT '========================================' AS '';
SELECT 'INSTALACIÓN COMPLETADA' AS RESULTADO;
SELECT '========================================' AS '';

-- Verificar tabla opciones_descuento
SELECT 'Tabla opciones_descuento:' AS Verificacion;
SELECT * FROM opciones_descuento;

-- Verificar columna en Compra
SELECT 'Columna IdOpcionDescuento en Compra:' AS Verificacion;
SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'Compra'
  AND COLUMN_NAME = 'IdOpcionDescuento';

-- Verificar Foreign Key
SELECT 'Foreign Key creada:' AS Verificacion;
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    REFERENCED_TABLE_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'Compra'
  AND CONSTRAINT_NAME = 'fk_compra_opcion_descuento';

-- Verificar procedimientos almacenados
SELECT 'Procedimientos almacenados creados:' AS Verificacion;
SELECT ROUTINE_NAME 
FROM INFORMATION_SCHEMA.ROUTINES
WHERE ROUTINE_SCHEMA = DATABASE()
  AND ROUTINE_TYPE = 'PROCEDURE'
  AND ROUTINE_NAME IN (
    'ValidarYAplicarDescuento',
    'AplicarDescuentoCompra',
    'ConsultarOpcionesDescuento',
    'ObtenerSaldoEstrellas',
    'ObtenerHistorialCanjes'
  );

SELECT '========================================' AS '';
SELECT 'SISTEMA LISTO PARA BACKEND' AS RESULTADO;
SELECT '========================================' AS '';
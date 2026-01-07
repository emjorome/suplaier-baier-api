USE DbContabilly;

DROP PROCEDURE IF EXISTS CanjearCodigoInvitacion;

DELIMITER //
CREATE PROCEDURE CanjearCodigoInvitacion(
  IN p_IdUsuario INT,        -- quien canjea
  IN p_Codigo    VARCHAR(64),
  IN p_Estrellas INT
)
BEGIN
  DECLARE dup TINYINT DEFAULT 0;
  DECLARE vCodigo VARCHAR(64);
  DECLARE vOwnerId INT DEFAULT NULL;

  DECLARE CONTINUE HANDLER FOR 1062 SET dup = 1;

  SET vCodigo = UPPER(TRIM(p_Codigo));

  -- 1) Validar que el usuario que canjea exista
  IF NOT EXISTS (SELECT 1 FROM Usuario WHERE IdUsuario = p_IdUsuario) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Usuario que canjea no existe';
  END IF;

  -- 2) Buscar dueño del código
  SELECT IdUsuario
    INTO vOwnerId
  FROM Usuario
  WHERE UPPER(TRIM(codigo_invitacion)) = vCodigo
  LIMIT 1;

  IF vOwnerId IS NULL THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Código de invitación inválido';
  END IF;

  -- 3) Evitar auto-canje
  IF vOwnerId = p_IdUsuario THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'No puedes canjear tu propio código';
  END IF;

  -- 4) Registrar canje (evita duplicado por UNIQUE si existe)
  INSERT INTO InvitacionCanje (IdUsuario, Codigo, Estrellas)
  VALUES (p_IdUsuario, vCodigo, p_Estrellas);

  IF dup = 1 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Este código ya fue canjeado por este usuario.';
  END IF;

  -- 5) Guardar referencia del invitador (si estaba null/0)
  UPDATE Usuario
     SET invitado_por_id = vOwnerId
   WHERE IdUsuario = p_IdUsuario
     AND (invitado_por_id IS NULL OR invitado_por_id = 0);

  -- 6) Acreditar estrellas SOLO al dueño del código
  UPDATE Usuario
     SET estrellas_acumuladas = COALESCE(estrellas_acumuladas, 0) + p_Estrellas
   WHERE IdUsuario = vOwnerId;

  SELECT vOwnerId AS ownerId, p_IdUsuario AS redeemerId;
END//
DELIMITER ;

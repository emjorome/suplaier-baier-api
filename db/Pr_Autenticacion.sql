USE DbContabilly;
DELIMITER $$
CREATE PROCEDURE Autenticacion(IN usuario VARCHAR(20), IN contrasenia VARCHAR(20))
BEGIN
    SELECT EXISTS(
		SELECT 1 FROM Usuario u 
        WHERE u.Usuario = usuario 
        AND u.Contrasena = contransenia
	) as autenticacion;
END $$
DELIMITER ;

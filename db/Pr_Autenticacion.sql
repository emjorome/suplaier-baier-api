-- USE DbContabilly;
-- DELIMITER $$
-- CREATE PROCEDURE Autenticacion(IN usuario VARCHAR(20), IN contrasenia VARCHAR(20))
-- BEGIN
-- 		SELECT EXISTS(
-- 			SELECT 1 FROM Usuario u 
--         		WHERE u.Usuario = usuario 
--         		AND u.Contrasena = contrasenia
-- 		) as autenticacion;
-- END $$
-- DELIMITER ;

USE DbContabilly;
DELIMITER $$
CREATE PROCEDURE Autenticacion(IN usuario VARCHAR(20), IN contrasenia VARCHAR(20))
BEGIN
    SELECT IdUsuario, Nombre, Identificacion, Usuario, Email, Numero, Pais, Provincia, Ciudad, Direccion, Rol, UrlLogoEmpresa
    FROM Usuario
    JOIN Rol 
    WHERE Usuario.IdRol = Rol.IdRol
    AND Usuario.Usuario = usuario AND Usuario.Contrasena = contrasenia;
END $$
DELIMITER ;

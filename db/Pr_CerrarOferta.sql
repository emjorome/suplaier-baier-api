USE DbContabilly;
DELIMITER $$
CREATE PROCEDURE CerrarOferta(IN IdUsuario INT, IN IdPublicacion INT)
BEGIN
	#Este procedure sera invocado por el proveedor cuando el total actual de productos sea mayor al minimo 
    #Crear job para cerrar oferta cuando se llegue a la fecha limite
END$$

DELIMITER ;
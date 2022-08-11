USE DbContabilly;
DELIMITER $$
CREATE PROCEDURE UnirseOferta(IN IdUsuario INT, IN IdPublicacion INT, IN Cantidad INT)
BEGIN
	#Se podria agregar fecha de union a la publicacion
    DECLARE totalCantidad INT;
    DECLARE maximoProductos INT;
    SELECT totalCantidad = (ActualProductos + Cantidad), maximoProductos = Maximo FROM Publicacion p WHERE p.IdPublicacion = IdPublicacion;
	IF ( totalCantidad <= maximoProductos) THEN
		INSERT INTO OfertaComprador(IdPublicacion, IdComprador, Cantidad) 
		VALUES(IdPublicacion, IdUsuario, Cantidad);
        
        #Se crea la compra con estados para el proveedor y flujo de oferta
        INSERT INTO Compra(IdProveedor, IdComprador, IdOferta, Cantidad, Fecha, PagadoAProveedor)
        VALUES(1, 1, 1, Cantidad,NOW(), False);
		IF (totalCantidad < maximoProductos) THEN
			UPDATE Publicacion p #En este punto inicia la compra para el comprador CREA REGISTRO EN COMPRA Y MANEJAR ESTADOS DESDE AHI!!! 
			SET p.ActualProductos = (p.ActualProductos + Cantidad), p.Estado = (SELECT IdEstadosOferta FROM EstadosOferta WHERE Descripcion = 'EN CURSO');
            
        ELSE
			UPDATE Publicacion p 
            SET p.ActualProductos = (p.ActualProductos + Cantidad), p.Estado = (SELECT IdEstadosOferta FROM EstadosOferta WHERE Descripcion = 'CERRADA');
        END IF;
    ELSE
		SIGNAL SQLSTATE '01000'
		SET MESSAGE_TEXT = 'Cantidad de productos seleccionados supera el stock actual', MYSQL_ERRNO = 1000;
    END IF;
END $$
DELIMITER ;
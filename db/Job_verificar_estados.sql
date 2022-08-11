SET GLOBAL event_scheduler = ON;

CREATE EVENT `verificar_estados` 
ON SCHEDULE EVERY 1 DAY STARTS '2022-08-11 00:00:00'
ON COMPLETION NOT PRESERVE ENABLE 
DO 

UPDATE OFERTA
SET IdEstadosOferta = (SELECT IdEstado FROM EstadosOferta es WHERE Descripcion = 'Por confirmar cierre')
WHERE IdEstadosOferta = (SELECT IdEstado FROM EstadosOferta es WHERE Descripcion = 'En curso')
AND DATE(FechaLimite) <= DATE(CURDATE())
AND ActualProductos < Minimo;

UPDATE OFERTA 
SET IdEstadosOferta = (SELECT IdEstado FROM EstadosOferta es WHERE Descripcion = 'Verificacion de pagos')
WHERE IdEstadosOferta = (SELECT IdEstado FROM EstadosOferta es WHERE Descripcion = 'En curso')
AND DATE(FechaLimite) <= DATE(CURDATE())
AND ActualProductos > Minimo;
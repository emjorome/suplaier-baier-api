USE dbcontabilly;
-- Create the Audit Log Table
CREATE TABLE OfertaAuditLog (
  AuditLogId INT AUTO_INCREMENT PRIMARY KEY,
  OfertaId INT,
  OldIdEstadosOferta INT,
  ActualProductosChange INT,
  ChangeType ENUM('INSERT', 'UPDATE', 'DELETE'),
  ChangeTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (OfertaId) REFERENCES Oferta(IdOferta)
);

-- Trigger for INSERTs
DELIMITER //
CREATE TRIGGER AfterInsertOferta
AFTER INSERT ON Oferta
FOR EACH ROW
BEGIN
  INSERT INTO OfertaAuditLog (OfertaId, OldIdEstadosOferta, ActualProductosChange, ChangeType)
  VALUES (NEW.IdOferta, NEW.IdEstadosOferta, NULL, 'INSERT');
END;
//

-- Trigger for UPDATEs
DELIMITER //
CREATE TRIGGER AfterUpdateOferta
AFTER UPDATE ON Oferta
FOR EACH ROW
BEGIN
  INSERT INTO OfertaAuditLog (OfertaId, OldIdEstadosOferta, ActualProductosChange, ChangeType)
  VALUES (NEW.IdOferta, NEW.IdEstadosOferta, NEW.ActualProductos - OLD.ActualProductos, 'UPDATE');
END;
//

-- Trigger for DELETEs
DELIMITER //
CREATE TRIGGER AfterDeleteOferta
AFTER DELETE ON Oferta
FOR EACH ROW
BEGIN
  INSERT INTO OfertaAuditLog (OfertaId, OldIdEstadosOferta, ActualProductosChange, ChangeType)
  VALUES (OLD.IdOferta, OLD.IdEstadosOferta, NULL, 'DELETE');
END;
//

DELIMITER ;
UPDATE Oferta
SET IdEstadosOferta = 2, ActualProductos = 50
WHERE IdOferta = 3;



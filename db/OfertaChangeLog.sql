CREATE TABLE OfertaChangeLog (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  IdOferta INT,
  IdUsuario INT,
  ChangeType ENUM('INSERT', 'UPDATE', 'DELETE'),
  ChangeTime DATETIME,
  Details JSON
  FOREIGN KEY (IdOferta) REFERENCES Oferta(IdOferta),
  FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
);


CREATE TRIGGER AfterInsertOferta
AFTER INSERT ON Oferta
FOR EACH ROW
BEGIN
  INSERT INTO OfertaChangeLog (IdOferta, IdUsuario, ChangeType, ChangeTime, Details)
  VALUES (NEW.IdOferta, :UserId, 'INSERT', NOW(), JSON_OBJECT('message', 'Record inserted'));
END;


CREATE TRIGGER AfterUpdateOferta
AFTER UPDATE ON Oferta
FOR EACH ROW
BEGIN
  INSERT INTO OfertaChangeLog (IdOferta, IdUsuario, ChangeType, ChangeTime, Details)
  VALUES (NEW.IdOferta, :UserId, 'UPDATE', NOW(), JSON_OBJECT('message', 'Record updated'));
END;


CREATE TRIGGER AfterDeleteOferta
AFTER DELETE ON Oferta
FOR EACH ROW
BEGIN
  INSERT INTO OfertaChangeLog (IdOferta, IdUsuario, ChangeType, ChangeTime, Details)
  VALUES (OLD.IdOferta, :UserId, 'DELETE', NOW(), JSON_OBJECT('message', 'Record deleted'));
END;

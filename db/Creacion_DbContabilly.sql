CREATE DATABASE IF NOT EXISTS DbContabilly;
USE DbContabilly;

CREATE TABLE Administrador (
	IdProveedor INT AUTO_INCREMENT PRIMARY KEY,
	Nombre VARCHAR(100),
	Identificacion VARCHAR(13),
	Usuario VARCHAR(20),
	Contrasena VARCHAR(50),
	Email VARCHAR(50),
	Numero VARCHAR(20),
	Pais VARCHAR(50),
	Ciudad VARCHAR(50),
	Direccion VARCHAR(200)
);

CREATE TABLE Proveedor (
	IdProveedor INT AUTO_INCREMENT PRIMARY KEY,
	Nombre VARCHAR(100),
	Identificacion VARCHAR(13),
	Usuario VARCHAR(20),
	Contrasena VARCHAR(50),
	Email VARCHAR(50),
	Numero VARCHAR(20),
	Pais VARCHAR(50),
	Ciudad VARCHAR(50),
	Direccion VARCHAR(200)
);

CREATE TABLE CatProducto(
	IdCatProducto INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50),
    GoogleCodeRoundedIcon VARCHAR(20)
);
                        
CREATE TABLE Producto (
	IdProducto INT AUTO_INCREMENT PRIMARY KEY,
	Descripcion VARCHAR(100),
	Stock INT,
	ValorU FLOAT,
	ValorCompra FLOAT,
	ValorVenta FLOAT,
	Activo BOOL, 
	FechaCreacion DATETIME,
	FechaModificacion DATETIME,
	Valoracion FLOAT
);

#DROP COLUMNS: VALORCOMPRA VALORVENTA FROM PRODUCTO
ALTER TABLE Producto
DROP COLUMN ValorCompra,
DROP COLUMN ValorVenta;

#ADD ID_PROVEEDOR TO PRODUCT
ALTER TABLE Producto
ADD IdProveedor INT,
ADD	FOREIGN KEY (IdProveedor) REFERENCES Proveedor(IdProveedor);

#ADD ID_CATEGORY TO PRODUCT
ALTER TABLE Producto
ADD IdCatProducto INT,
ADD FOREIGN KEY (IdCatProducto) REFERENCES CatProducto(IdCatProducto); 

#ADD BLOB TO PRODUCT
ALTER TABLE Producto
ADD UrlImg TEXT;

#ALTER TABLE Producto
#DROP COLUMN UrlImg;

#ADD NAME TO PRODUCT
ALTER TABLE Producto
ADD Name VARCHAR(100);
                        
CREATE TABLE Comprador (
	IdComprador INT AUTO_INCREMENT PRIMARY KEY,
	Nombre VARCHAR(100),
	Identificacion VARCHAR(13),
	Usuario VARCHAR(20),
	Contrasena VARCHAR(50),
	Email VARCHAR(50),
	Numero VARCHAR(20),
	Pais VARCHAR(50),
	Ciudad VARCHAR(50),
	Direccion VARCHAR(200)
);

CREATE TABLE Publicacion(
	IdPublicacion INT AUTO_INCREMENT PRIMARY KEY,
	IdProducto INT ,
	Minimo INT,
	Maximo INT,
	Descripcion VARCHAR(500),
	ActualProductos INT,
	FechaLimite DATETIME,
	FechaCreacion DATETIME,
	FechaModificacion DATETIME,
	Estado BOOL,
	FOREIGN KEY (IdProducto) REFERENCES Producto(IdProducto)
);

#ADD IDPROVEEDOR TO PUBLICACION
ALTER TABLE Publicacion
ADD IdProveedor INT,
ADD FOREIGN KEY (IdProveedor) REFERENCES Proveedor(IdProveedor);

#ADD TIPO DE ESTADO
ALTER TABLE Publicacion
ADD IdEstadoOferta INT,
ADD	FOREIGN KEY (IdEstadoOferta) REFERENCES EstadoOferta(IdEstadoOferta);

CREATE TABLE TipoNotificacion(
	IdTipoNotificacion INT AUTO_INCREMENT PRIMARY KEY,
    Tipo VARCHAR(20),
    GoogleCodeRoundedIcon VARCHAR(20)
);

CREATE TABLE Notificacion (
	IdNotificacion INT AUTO_INCREMENT PRIMARY KEY,
	IdUsuario INT,
    IdPublicacion INT,
    Descripcion VARCHAR(200),
    FechaCrea DATETIME,
    FOREIGN KEY (IdUsuario) REFERENCES Comprador(IdComprador),
    FOREIGN KEY (IdPublicacion) REFERENCES Publicacion(IdPublicacion)
);

#ADD TIPO DE NOTIFICACION
ALTER TABLE Notificacion
ADD IdTipoNotificacion INT,
ADD	FOREIGN KEY (IdTipoNotificacion) REFERENCES TipoNotificacion(IdTipoNotificacion);

CREATE TABLE EstadoOferta(
	IdEstadoOferta INT AUTO_INCREMENT PRIMARY KEY,
    Descripcion Varchar(50),
    FechaCrea DATETIME,
    Activo BOOL
);


CREATE TABLE OfertaComprador(
	IdOfertaComprador INT AUTO_INCREMENT PRIMARY KEY,
    IdPublicacion INT, 
    IdComprador INT,
    Cantidad INT,
    FOREIGN KEY (IdPublicacion) REFERENCES Publicacion(IdPublicacion),
    FOREIGN KEY (IdComprador)REFERENCES Comprador(IdComprador)
);

CREATE TABLE ValoracionProducto(
	IdValoracionProducto INT AUTO_INCREMENT PRIMARY KEY,
    IdUsuario INT,
    IdProducto INT,
    Comentario VARCHAR(1000),
    Valoracion FLOAT,
    FechaCrea DATETIME,
    FOREIGN KEY (IdUsuario) REFERENCES Comprador(IdComprador),
    FOREIGN KEY (IdProducto) REFERENCES Producto (IdProducto)
);

CREATE TABLE Reportes(
	IdReporte INT AUTO_INCREMENT PRIMARY KEY,
    IdUsuario INT,
    IdPublicacion INT,
    Motivo VARCHAR(200),
    FechaCrea DATETIME,
    FOREIGN KEY (IdUsuario) REFERENCES Comprador(IdComprador),
    FOREIGN KEY (IdPublicacion) REFERENCES Publicacion(IdPublicacion)
);

CREATE TABLE Compra(
	IdCompra INT AUTO_INCREMENT PRIMARY KEY,
	IdProveedor INT,
    IdOfertaComprador INT,
    Total FLOAT,
    Descripcion VARCHAR(500),
    Observacion VARCHAR(300),
    Fecha DATETIME,
    Pagado BOOL,
    FOREIGN KEY (IdProveedor) REFERENCES Proveedor(IdProveedor),
    FOREIGN KEY (IdOfertaComprador) REFERENCES OfertaComprador(IdOfertaComprador)
);

CREATE TABLE ProvFavorito(
	IdProvFavorito INT AUTO_INCREMENT PRIMARY KEY,
    IdComprador INT,
    IdProveedor INT,
    FOREIGN KEY (IdComprador) REFERENCES Comprador(IdComprador),
    FOREIGN KEY (IdProveedor) REFERENCES Proveedor(IdProveedor)
);

#INSERT QUERIES

INSERT INTO Comprador(Nombre, Identificacion, Usuario, Contrasena, Email, Numero, Pais, Ciudad, Direccion) VALUES 
('Walther Duran', '1205801515', 'wduran', 'wduran1234', 'wduran@gmail.com', '+593998950947', 'Ecuador', 'Guayaquil', 'Samanes'),
('Karla Duran', '1205801516', 'kduran', 'kduran1234', 'kduran@gmail.com', '+593998950948', 'Ecuador', 'Guayaquil', 'Samanes');

INSERT INTO Proveedor(Nombre, Identificacion, Usuario, Contrasena, Email, Numero, Pais, Ciudad, Direccion) VALUES 
('Helena Crespo', '0905801320', 'hcrespo', 'hcrespo1234', 'hcrespo@gmail.com', '+593998950948', 'Austria', 'Vienna', 'Auskunft-022'),
('Algodón S.A.', '0905801320', 'algodonsa', 'algodonsa1234', 'algodonsa@gmail.com', '+593998950948', 'Ecuador', 'Babahoyo', 'Calle 42'),
('Electrika', '0905801320', 'electrika', 'electrika1234', 'electrika@gmail.com', '+593998950948', 'Ecuador', 'Manta', 'Calle 23'),
('Agrícola S.A.', '0905801320', 'agricola', 'agricola1234', 'agricola@gmail.com', '+593998950948', 'Ecuador', 'Ventanas', 'Calle 13'),
('Brocolistos', '0905801320', 'brocolistos', 'brocolistos1234', 'brocolistos@gmail.com', '+593998950948', 'Ecuador', 'Guayaquil', 'Sur');

INSERT INTO Administrador(Nombre, Identificacion, Usuario, Contrasena, Email, Numero, Pais, Ciudad, Direccion) VALUES 
('Carlos Duran', '1205801325', 'cduran', 'cduran1234', 'cduran@gmail.com', '+593998950948', 'Ecuador', 'Guayaquil', 'Auskunft-022');

INSERT INTO TipoNotificacion(Tipo, GoogleCodeRoundedIcon) VALUES
('cambio_estado', 'change_circle');

INSERT INTO CatProducto(Nombre, GoogleCodeRoundedIcon) VALUES
('Artesanías', 'pan_tool'),
('Frutas', 'atr'),
('Legumbres', 'local_florist'),
('Materia Prima', 'emoji_objects'),
('Vestimenta', 'checkroom'),
('Construcción', 'construction'),
('Varios', 'sports_soccer');

INSERT INTO ProvFavorito(IdComprador, IdProveedor) VALUES
(1,2),
(1,3),
(1,4),
(1,5); 

INSERT INTO EstadoOferta(Descripcion, FechaCrea, Activo) VALUES
('En curso', CURDATE(), true);
 

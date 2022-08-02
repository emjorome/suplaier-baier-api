CREATE DATABASE DbContabilly;
USE DbContabilly;
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
                        
CREATE TABLE Comprador (
	IdComprador INT AUTO_INCREMENT PRIMARY KEY,
	Nombre VARCHAR(100),
	Identifcacion VARCHAR(13),
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

CREATE TABLE Notificacion (
	IdNotificacion INT AUTO_INCREMENT PRIMARY KEY,
	IdUsuario INT,
    IdPublicacion INT,
    Descripcion VARCHAR(200),
    FechaCrea DATETIME,
    FOREIGN KEY (IdUsuario) REFERENCES Comprador(IdComprador),
    FOREIGN KEY (IdPublicacion) REFERENCES Publicacion(IdPublicacion)
);

CREATE TABLE EstadosOferta(
	IdEstadosOferta INT AUTO_INCREMENT PRIMARY KEY,
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
CREATE TABLE Rol(
	IdRol INT AUTO_INCREMENT PRIMARY KEY,
    Rol VARCHAR(30),
    FechaCreacion DATETIME
);

CREATE TABLE Usuario (
	IdUsuario INT AUTO_INCREMENT PRIMARY KEY,
    IdRol INT,
	Nombre VARCHAR(100),
	Identifcacion VARCHAR(13),
	Usuario VARCHAR(20),
	Contrasena VARCHAR(50),
	Email VARCHAR(50),
	Numero VARCHAR(20),
	Pais VARCHAR(50),
	Ciudad VARCHAR(50),
	Direccion VARCHAR(200),
    FOREIGN KEY (IdRol) REFERENCES Rol(IdRol)
);


CREATE DATABASE DbContabilly;
USE DbContabilly;
CREATE TABLE IF NOT EXISTS Proveedor (
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
                        
CREATE TABLE IF NOT EXISTS Producto (
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
                        
CREATE TABLE IF NOT EXISTS Comprador (
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
CREATE TABLE IF NOT EXISTS Oferta( #Oferttaaaaaaaaa!!!!
	IdOferta INT AUTO_INCREMENT PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS Notificacion (
	IdNotificacion INT AUTO_INCREMENT PRIMARY KEY,
	IdUsuario INT,
    IdOferta INT,
    Descripcion VARCHAR(200),
    FechaCrea DATETIME,
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario),
    FOREIGN KEY (IdOferta) REFERENCES Oferta(IdOferta)
);

CREATE TABLE IF NOT EXISTS EstadosOferta(
	IdEstadosOferta INT AUTO_INCREMENT PRIMARY KEY,
    Descripcion Varchar(50),
    FechaCrea DATETIME,
    Activo BOOL
);

CREATE TABLE IF NOT EXISTS OfertaComprador(
	IdOfertaComprador INT AUTO_INCREMENT PRIMARY KEY,
    IdOferta INT, 
    IdComprador INT,
    Cantidad INT, #Cantidad de productos escogidos por ese comprador al unirse
    Estado INT,
    FOREIGN KEY (IdOferta) REFERENCES Oferta(IdOferta),
    FOREIGN KEY (IdComprador) REFERENCES Comprador(IdComprador)
);

CREATE TABLE IF NOT EXISTS ValoracionProducto(
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
    IdOferta INT,
    Motivo VARCHAR(200),
    FechaCrea DATETIME,
    FOREIGN KEY (IdUsuario) REFERENCES Comprador(IdComprador),
    FOREIGN KEY (IdOferta) REFERENCES Oferta(IdOferta)
);

#Tabla de pagos pendientes
CREATE TABLE Compra(
	IdCompra INT AUTO_INCREMENT PRIMARY KEY,
	IdProveedor INT,
    IdComprador INT,
    IdOferta INT,
    #IdOfertaComprador INT,
    Cantidad INT,
    Total FLOAT,
    Descripcion VARCHAR(500),
    Observacion VARCHAR(300),
    Fecha DATETIME,
    IdEstado INT, #Clave foraneo a estadosOferta
    MetodoPago VARCHAR(10), #Este campo sera para saber si fue reserva o pago directo
    PagadoAProveedor BOOL,  #Es para verificar si ya se ha completado el pago al proveedor!!
    FOREIGN KEY (IdProveedor) REFERENCES Usuario(IdUsuario),
    #FOREIGN KEY (IdOfertaComprador) REFERENCES OfertaComprador(IdOfertaComprador),
    FOREIGN KEY (IdEstado) REFERENCES EstadosOferta(IdEstadosOferta),
    FOREIGN KEY (IdComprador) REFERENCES Usuario(IdUsuario),
    FOREIGN KEY (IdOferta) REFERENCES Oferta(IdOferta)
);

/*CREATE TABLE Venta(
	IdVenta INT AUTO_INCREMENT PRIMARY KEY,
    IdComprador INT,
);*/



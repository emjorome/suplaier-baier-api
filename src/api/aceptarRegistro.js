var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    const id = req.query.id === undefined ? null : req.query.id;
    req.getConnection((err, conn) =>{
      if(err) return res.send(err);
      conn.query(
        `SELECT * FROM solicitudesregistro WHERE IdSolicitud = COALESCE(${id}, solicitudesregistro.IdSolicitud)`, 
        (err, rows) => {
          err? res.json(err) :  res.json({rows});
        
      });
    });
  });

  router.post('/',function(req, res){
    const { IdRol, Nombre, Identificacion, Usuario, Contrasena, Provincia, Email, Numero, Pais, Ciudad, Direccion, urlImg } = req.body;
    req.getConnection((err, conn) =>{
      if (err) return res.send(err);
      conn.query(
        `INSERT INTO Usuario (IdRol, Nombre, Identificacion, Usuario, Provincia, Contrasena, Email, Numero, Pais, Ciudad, Direccion, UrlLogoEmpresa, FechaSolicitud) VALUES 
        (${IdRol}, '${Nombre}', '${Identificacion}', '${Usuario}','${Provincia}' ,'${Contrasena}', '${Email}', '${Numero}', '${Pais}', '${Ciudad}', '${Direccion}', '${urlImg}', NOW() )`,
        (err, rows) => {
          err ? res.json(err):  res.json("Registro de Usuario aceptado");      
        }
      );
    })


});


module.exports = router;
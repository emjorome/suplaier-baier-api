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
        //mailer.enviarCorreo('kaduran1998@gmail.com', 'tema de prueba', rows[0].Estado.toString());
        // enviarNotificacionTopic({
        //   title: "Oferta ha cambiado", 
        //   message: "Prueba", 
        //   token: "cihtSbtdqjnCsteQQZ10bW:APA91bFvDHZI1y5KR48Lus-zOn-SmAf_P2Plq49jtxxhsu60sQUJiaLm0I7PzPDKAdf43RWbsErONjwm7CJN5Gl6ZgZMJggJpJjXM62Mfoa7FRC_sbpT07JBLM0T_8mquEBWFdiiE-d9"
        // })
  
      
    });
  });
});

router.post('/',function(req, res){
    const { IdRol, Nombre, Identificacion, Usuario, Contrasena, Provincia, Email, Numero, Pais, Ciudad, Direccion, urlImg } = req.body;
    req.getConnection((err, conn) =>{
      if (err) return res.send(err);
      conn.query(
        `INSERT INTO solicitudesregistro (IdRol, Nombre, Identificacion, Usuario, Provincia, Contrasena, Email, Numero, Pais, Ciudad, Direccion, UrlLogoEmpresa, FechaSolicitud) VALUES 
        (${IdRol}, '${Nombre}', '${Identificacion}', '${Usuario}','${Provincia}' ,'${Contrasena}', '${Email}', '${Numero}', '${Pais}', '${Ciudad}', '${Direccion}', '${urlImg}', NOW() )`,
        (err, rows) => {
          err ? res.json(err):  res.json("Solicitud creada exitosamente");      
        }
      );
    })
});


module.exports = router;
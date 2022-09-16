var express = require('express');
const { enviarNotificacionTopic } = require('../firebaseMesagging');
var router = express.Router();

router.get('/', function(req, res, next) {
  const idCompra = req.query.idCompra === undefined ? null : req.query.idCompra;
  console.log("asdkasdkkdskasdk")
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT IdComprador, IdProveedor FROM Compra WHERE IdCompra = COALESCE(${idCompra}, Compra.IdCompra)`, 
      (err, rows) => {
        if(err) res.json(err);
        // escribir desde el back la nueva notificacion
        const idUsersInvolved = rows[0];
        enviarNotificacionTopic({
          data: {
            usuariosId: idUsersInvolved,
            tipoNotificacion: 1,
          },
          token: "cihtSbtdqjnCsteQQZ10bW:APA91bFvDHZI1y5KR48Lus-zOn-SmAf_P2Plq49jtxxhsu60sQUJiaLm0I7PzPDKAdf43RWbsErONjwm7CJN5Gl6ZgZMJggJpJjXM62Mfoa7FRC_sbpT07JBLM0T_8mquEBWFdiiE-d9"
        })
        //mailer.enviarCorreo('kaduran1998@gmail.com', 'tema de prueba', rows[0].Estado.toString());  
        res.json({rows});
    });
  });
});

module.exports = router;
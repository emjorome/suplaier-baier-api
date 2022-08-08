var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  const idUsuario = req.query.idUsuario === undefined ? null : req.query.idUsuario;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM Notificacion noti WHERE IdNotificacion = COALESCE(${id}, noti.IdNotificacion)
      AND IdUsuario = COALESCE(${idUsuario}, noti.IdUsuario)`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

module.exports = router;
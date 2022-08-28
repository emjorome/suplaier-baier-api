var express = require('express');
var router = express.Router();
var mailer = require('../mailer');
//patch para actualizar el ActualProductos de una oferta
router.patch('/', (req, res, next) => {
  const {IdOferta, IdEstadosOferta} = req.body;
  console.log(req.body)
  req.getConnection((err, conn) => {
    if(err) return res.send(err);
    conn.query(
      `UPDATE Oferta ofe
        SET ofe.IdEstadosOferta = COALESCE(${IdEstadosOferta}, ofe.IdEstadosOferta)
        WHERE ofe.IdOferta = COALESCE(${IdOferta}, ofe.IdOferta)`,
      (err, rows) => {
        if(err) console.log(err);
        mailer.enviarCorreo();
        res.json(rows);
      }
    )
  })
});

module.exports = router;
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const q = req.query.q === undefined ? null : req.query.q;
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * 
      FROM Oferta ofe
      JOIN Producto pr
      WHERE ofe.IdProducto = pr.IdProducto
      AND ofe.IdProveedor = COALESCE(${idProveedor}, ofe.IdProveedor)
      AND pr.Name LIKE "%${q}%"`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

//%${q}%

module.exports = router;
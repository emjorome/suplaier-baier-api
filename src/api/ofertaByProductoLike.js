var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const nombreProducto = req.query.nombreProducto === undefined ? null : req.query.nombreProducto;
  console.log(nombreProducto)
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * 
      FROM Oferta ofe
      JOIN Producto pr
      WHERE ofe.IdProducto = pr.IdProducto
      AND ofe.IdProveedor = COALESCE(${idProveedor}, ofe.IdProveedor)
      AND pr.Name LIKE "%${nombreProducto}%"`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

//%${q}%

module.exports = router;
var express = require('express');


var router = express.Router();
const app = express();
const connection = '';


router.get('/', function(req, res, next){
  const idCat = req.query.id === undefined ? null : req.query.id;
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(`SELECT * FROM Oferta ofe 
    JOIN Producto pr ON ofe.IdProducto = pr.IdProducto
    AND IdCatProducto = COALESCE(${idCat}, pr.IdCatProducto)`, 
    (err, rows) => {
      if(err) res.json(err);
      res.json({rows});
    })
  })
});

module.exports = router;
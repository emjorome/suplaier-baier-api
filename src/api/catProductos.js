var express = require('express');


var router = express.Router();
const app = express();
const connection = '';

router.get('/', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  const nombre = req.query.nombre === undefined ? null : req.query.nombre;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM CatProducto cp WHERE IdCatProducto = COALESCE(${id}, cp.IdCatProducto)
      AND Nombre = COALESCE(${nombre}, cp.Nombre)`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

module.exports = router;
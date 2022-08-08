var express = require('express');


var router = express.Router();
const app = express();
const connection = '';

router.get('/', function(req, res, next) {
  const id = req.query.idProvFavorito === undefined ? null : req.query.idProvFavorito;
  const idComprador = req.query.idComprador === undefined ? null : req.query.idComprador;
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM ProvFavorito pf WHERE IdProvFavorito = COALESCE(${id}, pf.IdProvFavorito)
      AND IdUsuarioComp = COALESCE(${idComprador}, pf.IdUsuarioComp)
      AND IdUsuarioProv = COALESCE(${idProveedor}, pf.IdUsuarioProv)`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

module.exports = router;

//`SELECT * FROM ProvFavorito pf WHERE IdComprador = COALESCE(${idComprador}, pf.IdComprador)
//AND IdProveedor = COALESCE(${idProveedor}, pf.IdProveedor)`
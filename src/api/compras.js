var express = require('express');
var router = express.Router();

/* GET ofertas listing. */
router.get('/', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
  const idComprador = req.query.idComprador === undefined ? null : req.query.idComprador;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM Compra c WHERE c.IdCompra = COALESCE(${id}, c.IdCompra)
      AND c.IdProveedor = COALESCE(${idProveedor}, c.IdProveedor)
      AND c.IdComprador = COALESCE(${idComprador}, c.IdComprador)`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

//IdProveedor, IdComprador, IdOferta, Cantidad, Total, Descripcion, Observacion, Fecha, IdEstado, MetodoPago, PagadoAProveedor


router.post('/', (req, res, next) =>{
  const {IdProveedor, IdComprador, IdOferta, Cantidad, Total, Descripcion, Observacion, IdEstado, MetodoPago, PagadoAProveedor} = req.body;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `INSERT INTO Compra (IdProveedor, IdComprador, IdOferta, Cantidad, Total, Descripcion, Observacion, Fecha, IdEstado, MetodoPago, PagadoAProveedor) 
        VALUES (${IdProveedor},${IdComprador},${IdOferta},${Cantidad}, ${Total}, "${Descripcion}", "${Observacion}", NOW(), ${IdEstado}, "${MetodoPago}", ${PagadoAProveedor})`, 
      (err, rows) => {
        if(err) console.log(err);
        res.json(rows);
    });
  });
});

module.exports = router;
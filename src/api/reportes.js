var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  const idUsuario = req.query.idUsuario === undefined ? null : req.query.idUsuario;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM Reportes rep WHERE IdReporte = COALESCE(${id}, rep.IdReporte)
      AND IdUsuario = COALESCE(${idUsuario}, rep.IdUsuario)`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

router.post('/', (req, res, next) =>{
  const {IdComprador, IdOferta, Motivo, Descripcion, IdCompra} = req.body;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `INSERT INTO Reportes(IdUsuario, IdOferta, Motivo, FechaCrea, Descripcion, IdCompra) 
        VALUES (${IdComprador},${IdOferta},"${Motivo}", NOW(), "${Descripcion}", ${IdCompra})`, 
      (err, rows) => {
        if(err) console.log(err);
        res.json(rows);
    });
  });
});


module.exports = router;
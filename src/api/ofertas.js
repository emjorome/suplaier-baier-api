var express = require('express');
var router = express.Router();

/* GET ofertas listing. */
router.get('/', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
  const idEstadosOferta = req.query.idEstadosOferta === undefined ? null : req.query.idEstadosOferta;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM Oferta WHERE IdOferta = COALESCE(${id}, Oferta.IdOferta)
      AND IdProveedor = COALESCE(${idProveedor}, Oferta.IdProveedor)
      AND IdEstadosOferta = COALESCE(${idEstadosOferta}, Oferta.IdEstadosOferta)`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});


router.post('/', (req, res, next) =>{
  const {IdProducto, Minimo, Maximo, Descripcion, ActualProductos, FechaLimite, Estado, IdEstadoOferta, IdProveedor} = req.body;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `INSERT INTO Publicacion (IdProducto, Minimo, Maximo, Descripcion, ActualProductos, FechaLimite, FechaCreacion, FechaModificacion, Estado, IdEstadoOferta, IdProveedor) 
        VALUES (${IdProducto}, ${Minimo}, ${Maximo}, "${Descripcion}", ${ActualProductos}, "${FechaLimite}", NOW(), NOW(), ${Estado}, ${IdEstadoOferta}, ${IdProveedor})`, 
      (err, rows) => {
        if(err) console.log(err);
        res.json(rows);
    });
  });
});

// router.post('/join', (req, res, next) => {
//   const {IdPublicacion, IdUsuario, Cantidad} = req.body;
//   req.getConnection((err, conn) => {
//     if(err) return res.send(err);
//     conn.query(
//       `CALL UnirseOferta ("${IdPublicacion}","${IdUsuario}", ${Cantidad})`, 
//           (err, rows) => {
//             if(err) console.log(err);
//             res.json(rows[0]);
//     });
//   });
// });


module.exports = router;
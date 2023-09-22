var express = require('express');
const { enviarNotificacionTopic } = require('../firebaseMesagging');
var router = express.Router();
var mailer = require('../mailer');

/* GET ofertas listing. */
router.get('/', function(req, res, next) {
  const {idsEstadosOferta} = req.query;
  if (!idsEstadosOferta || idsEstadosOferta.trim() === '') {
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
        //mailer.enviarCorreo('kaduran1998@gmail.com', 'tema de prueba', rows[0].Estado.toString());
        // enviarNotificacionTopic({
        //   title: "Oferta ha cambiado", 
        //   message: "Prueba", 
        //   token: "cihtSbtdqjnCsteQQZ10bW:APA91bFvDHZI1y5KR48Lus-zOn-SmAf_P2Plq49jtxxhsu60sQUJiaLm0I7PzPDKAdf43RWbsErONjwm7CJN5Gl6ZgZMJggJpJjXM62Mfoa7FRC_sbpT07JBLM0T_8mquEBWFdiiE-d9"
        // })
  
        res.json({rows});
    });
  });
}else{
  const idsArray = idsEstadosOferta.split(',').map(Number);
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
  const idEstadosOferta = req.query.idEstadosOferta === undefined ? null : req.query.idEstadosOferta; 
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM oferta WHERE IdEstadosOferta IN (?) 
      AND IdProveedor = COALESCE(${idProveedor}, Oferta.IdProveedor)
      AND IdEstadosOferta = COALESCE(${idEstadosOferta}, Oferta.IdEstadosOferta)
      `, [idsArray], 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });

}

});

router.get('/orderFechaMayor', function(req, res, next) {
  const {idsEstadosOferta} = req.query;
  if (!idsEstadosOferta || idsEstadosOferta.trim() === '') {
  const id = req.query.id === undefined ? null : req.query.id;
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
  const idEstadosOferta = req.query.idEstadosOferta === undefined ? null : req.query.idEstadosOferta;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM Oferta WHERE IdOferta = COALESCE(${id}, Oferta.IdOferta)
      AND IdProveedor = COALESCE(${idProveedor}, Oferta.IdProveedor)
      AND IdEstadosOferta = COALESCE(${idEstadosOferta}, Oferta.IdEstadosOferta)
      ORDER BY FechaLimite DESC`, 
      (err, rows) => {
        if(err) res.json(err);
  
        res.json({rows});
    });
  });
  }else{
    const idsArray = idsEstadosOferta.split(',').map(Number);
    const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
    const idEstadosOferta = req.query.idEstadosOferta === undefined ? null : req.query.idEstadosOferta; 
    req.getConnection((err, conn) =>{
      if(err) return res.send(err);
      conn.query(
        `SELECT * FROM oferta WHERE IdEstadosOferta IN (?) 
        AND IdProveedor = COALESCE(${idProveedor}, Oferta.IdProveedor)
        AND IdEstadosOferta = COALESCE(${idEstadosOferta}, Oferta.IdEstadosOferta)
        ORDER BY FechaLimite DESC `, [idsArray], 
        (err, rows) => {
          if(err) res.json(err);
          res.json({rows});
      });
    });

  }

});

router.get('/orderFechaMenor', function(req, res, next) {
  const {idsEstadosOferta} = req.query;
  if (!idsEstadosOferta || idsEstadosOferta.trim() === '') {
  const id = req.query.id === undefined ? null : req.query.id;
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
  const idEstadosOferta = req.query.idEstadosOferta === undefined ? null : req.query.idEstadosOferta;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM Oferta WHERE IdOferta = COALESCE(${id}, Oferta.IdOferta)
      AND IdProveedor = COALESCE(${idProveedor}, Oferta.IdProveedor)
      AND IdEstadosOferta = COALESCE(${idEstadosOferta}, Oferta.IdEstadosOferta)
      ORDER BY FechaLimite ASC`, 
      (err, rows) => {
        if(err) res.json(err);
  
        res.json({rows});
    });
  });
  }else{
    const idsArray = idsEstadosOferta.split(',').map(Number);
    const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
    const idEstadosOferta = req.query.idEstadosOferta === undefined ? null : req.query.idEstadosOferta; 
    req.getConnection((err, conn) =>{
      if(err) return res.send(err);
      conn.query(
        `SELECT * FROM oferta WHERE IdEstadosOferta IN (?) 
        AND IdProveedor = COALESCE(${idProveedor}, Oferta.IdProveedor)
        AND IdEstadosOferta = COALESCE(${idEstadosOferta}, Oferta.IdEstadosOferta)
        ORDER BY FechaLimite ASC `, [idsArray], 
        (err, rows) => {
          if(err) res.json(err);
          res.json({rows});
      });
    });

  }
});


//IdOferta, IdProducto, IdProveedor, IdEstadosOferta, Minimo, Maximo, Descripcion, ActualProductos, FechaLimite, FechaCreacion, FechaModificacion, Estado, ValorUProducto

router.post('/', (req, res, next) =>{
  const {IdProducto, IdProveedor, IdEstadosOferta, Minimo, Maximo, Descripcion, ActualProductos, FechaLimite, Estado, ValorUProducto, ValorUInstantaneo} = req.body;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `INSERT INTO Oferta (IdProducto, IdProveedor, IdEstadosOferta, Minimo, Maximo, Descripcion, ActualProductos, FechaLimite, FechaCreacion, FechaModificacion, Estado, ValorUProducto, ValorUInstantaneo) 
        VALUES (${IdProducto},${IdProveedor},${IdEstadosOferta},${Minimo}, ${Maximo}, "${Descripcion}", ${ActualProductos}, "${FechaLimite}", NOW(), NOW(), ${Estado}, ${ValorUProducto}, ${ValorUInstantaneo})`, 
      (err, rows) => {
        if(err) console.log(err);
        res.json(rows);
    });
  });
});

//patch para actualizar el ActualProductos de una oferta
router.patch('/', (req, res, next) => {
  const {IdOferta, NuevoActualProductos} = req.body;
  req.getConnection((err, conn) => {
    if(err) return res.send(err);
    conn.query(
      `UPDATE Oferta ofe
      SET ofe.ActualProductos = COALESCE(${NuevoActualProductos}, ofe.ActualProductos)
      WHERE ofe.IdOferta = COALESCE(${IdOferta}, ofe.IdOferta)`,
      (err, rows) => {
        if(err) console.log(err);
        res.json(rows);
      }
    )
  })
});

router.patch('/estadoOferta', (req, res, next) => {
  const {IdOferta, IdEstadosOferta} = req.body;
  req.getConnection((err, conn) => {
    if(err) return res.send(err);
    conn.query(
      `UPDATE oferta
      SET IdEstadosOferta = '${IdEstadosOferta}'
      WHERE IdOferta =${IdOferta}`,
      (err, rows) => {
        err ? console.log(err) : res.json(rows);
      }
    )
  })
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
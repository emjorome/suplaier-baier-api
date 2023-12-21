var express = require('express');
var router = express.Router();



router.get('/', function(req, res, next) {
    const {idsEstadosOferta} = req.query;
    if (!idsEstadosOferta || idsEstadosOferta.trim() === '') {
    const id = req.query.id === undefined ? null : req.query.id;
    const IdComprador = req.query.IdComprador === undefined ? null : req.query.IdComprador;
    const idEstadosOferta = req.query.idEstadosOferta === undefined ? null : req.query.idEstadosOferta;
    req.getConnection((err, conn) =>{
      if(err) return res.send(err);
      conn.query(
        `SELECT * FROM demanda WHERE IdDemanda = COALESCE(${id}, demanda.IdDemanda)
        AND IdComprador = COALESCE(${idComprador}, demanda.IdComprador)
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
    const idComprador = req.query.idComprador === undefined ? null : req.query.idComprador;
    const idEstadosOferta = req.query.idEstadosOferta === undefined ? null : req.query.idEstadosOferta; 
    req.getConnection((err, conn) =>{
      if(err) return res.send(err);
      conn.query(
        `SELECT * FROM demanda WHERE IdEstadosOferta IN (?) 
        AND IdComprador = COALESCE(${idComprador}, demanda.IdComprador)
        AND IdEstadosOferta = COALESCE(${idEstadosOferta}, Oferta.IdEstadosOferta)
        `, [idsArray], 
        (err, rows) => {
          if(err) res.json(err);
          res.json({rows});
      });
    });
  
  }
  
  });

//IdDemanda, IdProducto, IdComprador, IdEstadosOferta, Minimo, Maximo, PrecioMinimo, PrecioMaximo, Descripcion, ActualProductos, FechaLimite, FechaCreacion, FechaModificacion, Estado

router.post('/', (req, res, next) =>{
    const {IdProducto, IdComprador, IdEstadosOferta, Minimo, Maximo, PrecioMinimo, PrecioMaximo, Descripcion, ActualProductos, FechaLimite, FechaCreacion, FechaModificacion, Estado} = req.body;
    req.getConnection((err, conn) =>{
      if(err) return res.send(err);
      conn.query(
        `INSERT INTO demanda (IdProducto, IdComprador, IdEstadosOferta, Minimo, Maximo, PrecioMinimo, PrecioMaximo, Descripcion, ActualProductos, FechaLimite, FechaCreacion, FechaModificacion, Estado) 
          VALUES (${IdProducto},${IdComprador},${IdEstadosOferta},${Minimo}, ${Maximo},${PrecioMinimo}, ${PrecioMaximo}, "${Descripcion}", ${ActualProductos}, "${FechaLimite}", NOW(), NOW(), ${Estado}})`, 
        (err, rows) => {
          if(err) console.log("holiwi");
          res.json(rows);
      });
    });
  });


  router.patch('/', (req, res, next) => {
    const {IdDemanda, NuevoActualProductos} = req.body;
    req.getConnection((err, conn) => {
      if(err) return res.send(err);
      conn.query(
        `UPDATE demanda dem
        SET ofe.ActualProductos = COALESCE(${NuevoActualProductos}, ofe.ActualProductos)
        WHERE ofe.IdDemanda = COALESCE(${IdDemanda}, ofe.IdDemanda)`,
        (err, rows) => {
          if(err) console.log(err);
          res.json(rows);
        }
      )
    })
  });

  router.patch('/estadoOferta', (req, res, next) => {
    const {IdDemanda, IdEstadosOferta} = req.body;
    req.getConnection((err, conn) => {
      if(err) return res.send(err);
      conn.query(
        `UPDATE demanda
        SET IdEstadosOferta = '${IdEstadosOferta}'
        WHERE demanda =${IdDemanda}`,
        (err, rows) => {
          err ? console.log(err) : res.json(rows);
        }
      )
    })
  });
  
  module.exports = router;

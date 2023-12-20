var express = require('express');
const { enviarNotificacionTopic } = require('../firebaseMesagging');
var router = express.Router();
var mailer = require('../mailer');

//IdDemanda, IdProducto, IdComprador, IdEstadosOferta, Minimo, Maximo, PrecioMinimo, PrecioMaximo, Descripcion, ActualProductos, FechaLimite, FechaCreacion, FechaModificacion, Estado

router.post('/', (req, res, next) =>{
    const {IdProducto, IdComprador, IdEstadosOferta, Minimo, Maximo, PrecioMinimo, PrecioMaximo, Descripcion, ActualProductos, FechaLimite, FechaCreacion, FechaModificacion, Estado} = req.body;
    req.getConnection((err, conn) =>{
      if(err) return res.send(err);
      conn.query(
        `INSERT INTO demanda (IdProducto, IdComprador, IdEstadosOferta, Minimo, Maximo, PrecioMinimo, PrecioMaximo, Descripcion, ActualProductos, FechaLimite, FechaCreacion, FechaModificacion, Estado) 
          VALUES (${IdProducto},${IdComprador},${IdEstadosOferta},${Minimo}, ${Maximo},${PrecioMinimo}, ${PrecioMaximo}, "${Descripcion}", ${ActualProductos}, "${FechaLimite}", NOW(), NOW(), ${Estado}})`, 
        (err, rows) => {
          if(err) console.log(err);
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
  


var express = require('express');
var router = express.Router();

/*IdPropuesta INT AUTO_INCREMENT PRIMARY KEY,
	IdDemanda INT,
    IdProveedor INT,
    Precio INT,
    Cantidad INT,
	Estado*/

  router.get('/', function(req, res, next) {
    const id = req.query.id === undefined ? null : req.query.id;
    req.getConnection((err, conn) =>{
      if(err) return res.send(err);
      conn.query(
        `SELECT * FROM propuesta WHERE IdPropuesta = COALESCE(${id}, propuesta.IdPropuesta) AND propuesta.Estado='pendiente'`, 
        (err, rows) => {
          err? res.json(err) :  res.json({rows});
      });
    });
  });

router.post('/',function(req, res){
    const { IdDemanda, IdProveedor, Precio, Cantidad, Estado } = req.body;
    req.getConnection((err, conn) =>{
      if (err) return res.send(err);
      conn.query(
        `INSERT INTO propuesta (IdDemanda, IdProveedor, Precio, Cantidad, Estado, FechaPropuesta) VALUES 
        (${IdDemanda}, '${IdProveedor}', '${Precio}', '${Cantidad}','${Estado}', NOW() )`,
        (err, rows) => {
          err ? res.json(err):  res.json("Propuesta Enviada Exitosamente");      
        }
      );
    })
});


router.patch('/', (req, res, next) => {
  const {IdSolicitud, Estado} = req.body;
  req.getConnection((err, conn) => {
    if(err) return res.send(err);
    conn.query(
      `UPDATE propuesta 
      SET Estado = '${Estado}'
      WHERE IdSolicitud =${IdSolicitud}`,
      (err, rows) => {
        err ? console.log(err) : res.json(rows);
      }
    )
  })
});

module.exports = router;
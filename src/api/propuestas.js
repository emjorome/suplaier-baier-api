var express = require('express');
var router = express.Router();

/*IdPropuesta INT AUTO_INCREMENT PRIMARY KEY,
	IdDemanda INT,
    IdProveedor INT,
    Precio INT,
    Cantidad INT,
	Estado*/

  router.get('/', function(req, res, next) {
    const idPropuesta = req.query.id;
    const idDemanda = req.query.idDemanda;
    const estado = req.query.estado || 'pendiente';

    req.getConnection((err, conn) => {
      if(err) return res.send(err);

      let query = 'SELECT * FROM propuesta WHERE Estado = ?';
      let queryParams = [estado];

      if (idPropuesta) {
        query += ' AND IdPropuesta = ?';
        queryParams.push(idPropuesta);
      }

      if (idDemanda) {
        query += ' AND IdDemanda = ?';
        queryParams.push(idDemanda);
      }

      conn.query(query, queryParams, (err, rows) => {
        if(err) {
          res.json(err);
        } else {
          res.json({rows});
        }
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
  const {IdPropuesta, Estado} = req.body;
  req.getConnection((err, conn) => {
    if(err) return res.send(err);
    conn.query(
      `UPDATE propuesta 
      SET Estado = '${Estado}'
      WHERE IdPropuesta =${IdPropuesta}`,
      (err, rows) => {
        err ? console.log(err) : res.json(rows);
      }
    )
  })
});

module.exports = router;
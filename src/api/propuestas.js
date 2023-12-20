var express = require('express');
var router = express.Router();

/*IdPropuesta INT AUTO_INCREMENT PRIMARY KEY,
	IdDemanda INT,
    IdProveedor INT,
    Precio INT,
    Cantidad INT,
	Estado*/
router.post('/',function(req, res){
    const { IdDemanda, IdProveedor, Precio, Cantidad, Estado } = req.body;
    req.getConnection((err, conn) =>{
      if (err) return res.send(err);
      conn.query(
        `INSERT INTO propuesta (IdDemanda, IdProveedor, Precio, Cantidad, Estado) VALUES 
        (${IdDemanda}, '${IdProveedor}', '${{Precio}}', '${Cantidad}','${Estado}' )`,
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
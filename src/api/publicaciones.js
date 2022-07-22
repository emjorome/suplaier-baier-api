var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/', (req, res, next) =>{
  const {idProducto, minimo, maximo, descripcion, actualProductos, fechaLimite, limite} = req.body;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      ```INSERT INTO Publicacion (IdProducto, Minimo, Maximo, Descripcion, ActualProductos, FechaLimite, FechaCreacion, Limite) 
        VALUES ("${idProducto}", ${minimo}, ${maximo}, "${descripcion}", ${actualProductos}, "${fechaLimite}", NOW(), ${limite})```, 
      (err, rows) => {
        if(err) console.log(err);
        res.json(rows);
    });
  });
});

module.exports = router;
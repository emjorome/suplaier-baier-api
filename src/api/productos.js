
var express = require('express');


var router = express.Router();
const app = express();
const connection = '';
/* GET users listing. */
router.get('/', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;

  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM Producto p 
        WHERE IdProducto = COALESCE(${id}, p.IdProducto) 
        AND IdProveedor = COALESCE(${idProveedor}, p.IdProveedor)`, 
      (err, rows) => {
        err? res.json(err) :  res.json({rows});

    });
  });
});

router.get('/onlyNames', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;

  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT IdProducto, Name FROM Producto p 
        WHERE IdProducto = COALESCE(${id}, p.IdProducto) 
        AND IdProveedor = COALESCE(${idProveedor}, p.IdProveedor)`, 
      (err, rows) => {
        err? res.json(err) :  res.json({rows});

    });
  });
});


// joseking5@hotmail.com
// Leonardo01!

router.post('/',function(req, res){
    const { Name, Descripcion, Activo, Valoracion, IdProveedor, IdCatProducto, UrlImg} = req.body;
    req.getConnection((err, conn) =>{
      if (err) return res.send(err);
      conn.query(
        `INSERT INTO Producto (Descripcion, Activo, FechaCreacion, FechaModificacion, Valoracion, Name, IdCatProducto, IdProveedor, UrlImg) VALUES 
        ('${Descripcion}', ${Activo}, NOW(), NOW(), ${Valoracion}, '${Name}', ${IdCatProducto}, ${IdProveedor}, '${UrlImg}')`,
        (err, rows) => {
          err ?  console.log(res.json(err)) :res.json("Producto creado exitosamente");
        }
      );
    })
});

router.patch('/', (req, res, next) => {
  const {idProducto, ValoracionNueva} = req.body;
  console.log(req.body)
  req.getConnection((err, conn) => {
    if(err) return res.send(err);
    conn.query(
      `UPDATE Producto prod
        SET prod.Valoracion = COALESCE(${ValoracionNueva}, prod.Valoracion)
        WHERE prod.IdProducto = COALESCE(${idProducto}, prod.IdProducto)`,
      (err, rows) => {
        err? res.json(err) :  res.json({rows});

      }
    )
  })
});

router.put('/:id', function(req, res){
    const { id } = req.params;
    const { nombre, precio } = req.body;
    let sql = `UPDATE Producto SET nombre = ${nombre}, [precio = ${precio} WHERE ProductoId = ${id}`;

});

router.delete('', function(req,res){
});

module.exports = router;
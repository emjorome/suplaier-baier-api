var express = require('express');


var router = express.Router();
const app = express();
const connection = '';
/* GET users listing. */
router.get('/', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  const nombre = req.query.nombre === undefined ? null : req.query.nombre;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM Proveedor p WHERE IdProveedor = COALESCE(${id}, p.IdProveedor)
      AND Nombre = COALESCE(${nombre}, p.Nombre)`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

router.post('/', function(req, res){
    const { title, director, year, rating } = req.body;
    let query = `INSERT INTO Proveedor VALUES ${req.res}`;
});


router.post('/auth', (req, res) => {
    const {usuario, pass} = req.body;
    req.getConnection((err, conn) =>{
        if(err) return res.send(err);
        conn.query(
          `CALL AutenticarProveedor(${usuario}, ${pass})`, 
          (err, rows) => {
            if(err) console.log(err);
            res.json(rows);
        });
    });
});

router.put('/:id', function(req, res){
    const { id } = req.params;
    const { nombre, precio } = req.body;
    let sql = `UPDATE Proveedor SET nombre = ${nombre} WHERE ProductoId = ${id}`;

});

router.delete('', function(req,res){
});

module.exports = router;

var express = require('express');


var router = express.Router();
const app = express();
const connection = '';
/* GET users listing. */
router.get('/', function(req, res, next) {
  const {id, nombre} = req.query;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM Producto p 
        WHERE ProductoId = COALESCE(${id}, p.ProductoId) 
        AND Nombre = COALESCE(${nombre}, p.Nombre)`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

router.post('/', function(req, res){
    const { title, director, year, rating } = req.body;
    let query = `INSERT INTO Producto VALUES ${req.res}`;
    RTCPeerConnection.query()
});

router.put('/:id', function(req, res){
    const { id } = req.params;
    const { nombre, precio } = req.body;
    let sql = `UPDATE Producto SET nombre = ${nombre}, [precio = ${precio} WHERE ProductoId = ${id}`;

});

router.delete('', function(req,res){
});

module.exports = router;
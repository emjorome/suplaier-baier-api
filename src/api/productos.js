
var express = require('express');
const mysql = require('mysql');

var router = express.Router();
const app = express();
const connection = '';
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
    message:'respond with a resource'
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
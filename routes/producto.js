const { application } = require('express');
var express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
var router = express.Router();
const app = express();
const connection = 
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/producto', function(req, res){
    const { title, director, year, rating } = req.body;
    let query = `INSERT INTO Producto VALUES ${req.res}`;
    RTCPeerConnection.query()
});

router.put('/producto/:id', function(req, res){
    const { id } = req.params;
    const { nombre, precio } = req.body;
    let sql = `UPDATE Producto SET nombre = ${nombre}, [precio = ${precio} WHERE ProductoId = ${id}`;

});

router.delete('', function(req,res){
});

module.exports = router;
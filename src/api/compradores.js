var express = require('express');


var router = express.Router();
const app = express();
const connection = '';

/* GET users listing. */
router.get('/', function(req, res, next) {
  const id = req.query.idComprador === undefined ? null : req.query.idComprador;
  const nombre = req.query.nombre === undefined ? null : req.query.nombre;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM Comprador c WHERE IdComprador = COALESCE(${id}, c.IdComprador) AND Nombre = COALESCE(${nombre}, c.Nombre)`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

router.post('/', function(req, res){
    const { title, director, year, rating } = req.body;
    let query = `INSERT INTO Comprador VALUES ${req.body}`;
});

router.post('/auth', (req, res) => {
    const {usuario, pass} = req.body;
    req.getConnection((err, conn) =>{
        if(err) return res.send(err);
        conn.query(
          `CALL AutenticarComprador ("${usuario}","${pass}")`, 
          (err, rows) => {
            if(err) console.log(err);
            res.json(rows[0]);
        });
      });
});

router.put('/:id', function(req, res){
    const { id } = req.params;
    const { nombre} = req.body;
    let sql = `UPDATE Comprador SET nombre = ${nombre} WHERE ProductoId = ${id}`;

});

router.delete('', function(req,res){
});

module.exports = router;
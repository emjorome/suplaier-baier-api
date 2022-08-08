var express = require('express');
var router = express.Router();

router.post('/', (req, res, next) => {
  const {usuario, pass} = req.body;
  req.getConnection((err, conn) =>{
      if(err) return res.send(err);
      conn.query(
        `CALL Autenticacion("${usuario}","${pass}")`, 
        (err, rows) => {
          if(err) console.log(err);
          res.json(rows[0]);
      });
    });
});

module.exports = router;
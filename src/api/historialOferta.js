var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM ofertaauditlog `, 
      (err, rows) => {
        err? res.json(err) :  res.json({rows});
      
    });
  });
});

module.exports = router;
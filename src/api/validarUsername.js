var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const username = req.query.username === undefined ? null : req.query.username;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      ` SELECT Usuario FROM Usuario u
        WHERE Usuario = COALESCE('${username}', u.Usuario)`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

module.exports = router;
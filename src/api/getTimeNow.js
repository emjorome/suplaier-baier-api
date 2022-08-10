var express = require('express');


var router = express.Router();
const app = express();
const connection = '';

router.get('/', function(req, res, next) {
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT getnow()`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

module.exports = router;
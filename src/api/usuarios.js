var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    const id = req.query.idUsuario === undefined ? null : req.query.idUsuario;
    const nombre = req.query.nombre === undefined ? null : req.query.nombre;
    req.getConnection((err, conn) =>{
      if(err) return res.send(err);
      conn.query(
        `SELECT * FROM Usuario u 
        WHERE IdUsuario = COALESCE(${id}, u.IdUsuario) 
        AND Nombre = COALESCE(${nombre}, u.Nombre)`, 
        (err, rows) => {
          if(err) res.json(err);
          res.json({rows});
      });
    });
  });
  
  router.post('/',function(req, res){
    const { IdRol, Nombre, Identificacion, Usuario, Contrasena, Provincia, Email, Numero, Pais, Ciudad, Direccion, UrlLogoEmpresa } = req.body;
    req.getConnection((err, conn) =>{
      if (err) return res.send(err);
      conn.query(
        `INSERT INTO Usuario (IdRol, Nombre, Identificacion, Usuario, Provincia, Contrasena, Email, Numero, Pais, Ciudad, Direccion, UrlLogoEmpresa) VALUES 
        (${IdRol}, '${Nombre}', '${Identificacion}', '${Usuario}','${Provincia}' ,'${Contrasena}', '${Email}', '${Numero}', '${Pais}', '${Ciudad}', '${Direccion}', '${UrlLogoEmpresa}')`,
        (err, rows) => {
          err ? res.json(err):  res.json("Usuario creado exitosamente");      
        }
      );
    })
});
  
// router.post('/auth', (req, res) => {
//     const {usuario, pass} = req.body;
//     req.getConnection((err, conn) =>{
//         if(err) return res.send(err);
//         conn.query(
//           `CALL Autenticacion ("${usuario}","${pass}")`, 
//           (err, rows) => {
//             if(err) console.log(err);
//             res.json(rows[0]);
//         });
//       });
// });

module.exports = router;
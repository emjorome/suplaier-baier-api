var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /compras:
 *   get:
 *     summary: Obtener compras
 *     description: Obtiene una lista de compras. Se puede filtrar opcionalmente por múltiples parámetros como 'id', 'idProveedor', 'idComprador', 'idOferta', o 'idEstado'.
 *     tags:
 *       - Compras
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: El ID de la compra a buscar.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idProveedor
 *         required: false
 *         description: El ID del proveedor asociado a la compra.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idComprador
 *         required: false
 *         description: El ID del comprador asociado a la compra.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idOferta
 *         required: false
 *         description: El ID de la oferta asociada a la compra.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idEstado
 *         required: false
 *         description: El ID del estado de la compra.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Lista de compras obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       IdCompra:
 *                         type: integer
 *                       IdProveedor:
 *                         type: integer
 *                       IdComprador:
 *                         type: integer
 *                       IdOferta:
 *                         type: integer
 *                       Cantidad:
 *                         type: integer
 *                       Total:
 *                         type: number
 *       '500':
 *         description: Error interno del servidor.
 */
/* GET ofertas listing. */
router.get('/', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
  const idComprador = req.query.idComprador === undefined ? null : req.query.idComprador;
  const idOferta = req.query.idOferta === undefined ? null : req.query.idOferta;
  const idEstado = req.query.idEstado === undefined ? null : req.query.idEstado;
  
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM Compra c WHERE c.IdCompra = COALESCE(${id}, c.IdCompra)
      AND c.IdProveedor = COALESCE(${idProveedor}, c.IdProveedor)
      AND c.IdComprador = COALESCE(${idComprador}, c.IdComprador)
      AND c.IdOferta = COALESCE(${idOferta}, c.IdOferta)
      AND c.IdEstado = COALESCE(${idEstado}, c.IdEstado)`, 
      (err, rows) => {
        err? res.json(err) :  res.json({rows});

    });
  });
});

/**
 * @swagger
 * /compras/estaUnido:
 *   get:
 *     summary: Verificar si un comprador está unido a una oferta
 *     description: Revisa si ya existe una compra de tipo "normal" para un comprador y una oferta específicos.
 *     tags:
 *       - Compras
 *     parameters:
 *       - in: query
 *         name: idComprador
 *         required: true
 *         description: El ID del comprador.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idOferta
 *         required: true
 *         description: El ID de la oferta.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Conteo de compras existentes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       count:
 *                         type: integer
 *                         example: 0
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/estaUnido', function(req, res, next) {
  const idComprador = req.query.idComprador === undefined ? null : req.query.idComprador;
  const idOferta = req.query.idOferta === undefined ? null : req.query.idOferta;
  
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT COUNT (*) FROM Compra c WHERE c.IdComprador = COALESCE(${idComprador}, c.IdComprador)
      AND c.IdOferta = COALESCE(${idOferta}, c.IdOferta) AND c.TipoCompra="normal"
      `, 
      (err, rows) => {
        err? res.json(err) :  res.json({rows});

    });
  });
});

//IdProveedor, IdComprador, IdOferta, Cantidad, Total, Descripcion, Observacion, Fecha, IdEstado, MetodoPago, PagadoAProveedor

/**
 * @swagger
 * /compras:
 *   post:
 *     summary: Crear una nueva compra
 *     description: Registra una nueva compra en el sistema. La compra debe estar vinculada a una 'IdOferta' O a una 'IdDemanda'.
 *     tags:
 *       - Compras
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdProveedor:
 *                 type: integer
 *               IdComprador:
 *                 type: integer
 *               IdOferta:
 *                 type: integer
 *                 description: ID de la oferta (opcional si se provee IdDemanda).
 *               IdDemanda:
 *                 type: integer
 *                 description: ID de la demanda (opcional si se provee IdOferta).
 *               Cantidad:
 *                 type: integer
 *               Total:
 *                 type: number
 *                 format: double
 *               Descripcion:
 *                 type: string
 *               Observacion:
 *                 type: string
 *               IdEstado:
 *                 type: integer
 *               MetodoPago:
 *                 type: string
 *               PagadoAProveedor:
 *                 type: integer
 *               TipoCompra:
 *                 type: string
 *                 example: "normal"
 *             example:
 *               IdProveedor: 7
 *               IdComprador: 15
 *               IdOferta: 23
 *               Cantidad: 5
 *               Total: 249.99
 *               Descripcion: "Compra de frutas frescas"
 *               Observacion: "Entrega inmediata"
 *               IdEstado: 1
 *               MetodoPago: "transferencia"
 *               PagadoAProveedor: 0
 *               TipoCompra: "normal"
 *     responses:
 *       '200':
 *         description: Compra creada con éxito.
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/', (req, res, next) =>{
  const {IdProveedor, IdComprador, IdOferta, Cantidad, Total, Descripcion, Observacion, IdEstado, MetodoPago, PagadoAProveedor, TipoCompra, IdDemanda, IdOpcionDescuento} = req.body;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    const realizarInsercion = (finalTotal, finalIdOpcionDescuento) => {
      const sqlIdOferta = IdOferta ? `${IdOferta}` : 'NULL';
      const sqlIdDemanda = IdDemanda ? `${IdDemanda}` : 'NULL';
      const sqlIdOpcionDescuento = finalIdOpcionDescuento ? `${finalIdOpcionDescuento}` : 'NULL';
      conn.query(
        `INSERT INTO Compra (IdProveedor, IdComprador, IdOferta, IdDemanda, Cantidad, Total, Descripcion, Observacion, Fecha, IdEstado, MetodoPago, PagadoAProveedor, TipoCompra, IdOpcionDescuento) 
          VALUES (${IdProveedor},${IdComprador},${sqlIdOferta}, ${sqlIdDemanda}, ${Cantidad}, ${finalTotal}, "${Descripcion}", "${Observacion}", NOW(), ${IdEstado}, "${MetodoPago}", ${PagadoAProveedor}, "${TipoCompra}", ${sqlIdOpcionDescuento})`,
        (err, rows) => {
          err ? res.json(err) : res.json({ rows });
        }
      );
    };
    if(IdOpcionDescuento){
      conn.query(`SELECT od.CostoEstrellas, od.Porcentaje, u.estrellas_acumuladas 
                    FROM opciones_descuento od, Usuario u 
                    WHERE od.IdOpcion = ${IdOpcionDescuento} AND u.IdUsuario = ${IdComprador}`, 
        (err, results) => {
            if (err) return res.json(err);
            if (results.length === 0) return res.status(404).json({error: "Usuario o Descuento no encontrado"});
            const { CostoEstrellas, Porcentaje, estrellas_acumuladas } = results[0];
            if (estrellas_acumuladas < CostoEstrellas) {
                return res.status(400).json({error: "Saldo insuficiente de estrellas", necesario: CostoEstrellas, tienes: estrellas_acumuladas});
            }
            const totalRebajado = Total - (Total * (Porcentaje/100));
            conn.query(`UPDATE Usuario SET estrellas_acumuladas = estrellas_acumuladas - ${CostoEstrellas} WHERE IdUsuario = ${IdComprador}`, (errUpdate) => {
                if(errUpdate) return res.json(errUpdate);
                realizarInsercion(totalRebajado, IdOpcionDescuento);
            });
        });
    } else {
        realizarInsercion(Total, null);
    }
  });
});

/**
 * @swagger
 * /compras:
 *   patch:
 *     summary: Actualizar una compra (parcial)
 *     description: Actualiza el estado ('IdEstado') o el estado de pago ('PagadoAProveedor') de una compra existente usando su 'IdCompra'.
 *     tags:
 *       - Compras
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdCompra:
 *                 type: integer
 *                 description: El ID de la compra a modificar.
 *               IdEstado:
 *                 type: integer
 *                 description: El nuevo ID de estado (opcional).
 *               PagadoAProveedor:
 *                 type: integer
 *                 description: El nuevo estado de pago (opcional).
 *             example:
 *               IdCompra: 15
 *               IdEstado: 3
 *               PagadoAProveedor: 1
 *     responses:
 *       '200':
 *         description: Actualización exitosa.
 *       '500':
 *         description: Error interno del servidor.
 */
router.patch('/', (req, res, next) => {
  const {IdCompra, IdEstado, PagadoAProveedor} = req.body;
  console.log(req.body)
  req.getConnection((err, conn) => {
    if(err) return res.send(err);
    conn.query(
      `UPDATE Compra comp
        SET comp.IdEstado = COALESCE(${IdEstado}, comp.IdEstado), comp.PagadoAProveedor = COALESCE(${PagadoAProveedor}, comp.PagadoAProveedor)
        WHERE comp.IdCompra = COALESCE(${IdCompra}, comp.IdCompra)`,
      (err, rows) => {
        err? res.json(err) :  res.json({rows});

        // enviarNotificacionTopic({
        //   title: "Oferta ha cambiado", 
        //   message: "Prueba", 
        //   token: "cihtSbtdqjnCsteQQZ10bW:APA91bFvDHZI1y5KR48Lus-zOn-SmAf_P2Plq49jtxxhsu60sQUJiaLm0I7PzPDKAdf43RWbsErONjwm7CJN5Gl6ZgZMJggJpJjXM62Mfoa7FRC_sbpT07JBLM0T_8mquEBWFdiiE-d9"
        // })

      }
    )
  })
});

module.exports = router;
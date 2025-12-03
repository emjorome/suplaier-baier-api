
var express = require('express');


var router = express.Router();
const app = express();
const connection = '';
/* GET users listing. */

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtener lista de productos
 *     description: Retorna los productos registrados. Se puede filtrar por ID de producto o por ID de proveedor.
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: ID del producto a buscar.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idProveedor
 *         required: false
 *         description: ID del proveedor para filtrar sus productos.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente.
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
 *                       IdProducto:
 *                         type: integer
 *                       Name:
 *                         type: string
 *                       Descripcion:
 *                         type: string
 *                       Activo:
 *                         type: boolean
 *                       Valoracion:
 *                         type: number
 *                       UrlImg:
 *                         type: string
 *       500:
 *         description: Error del servidor.
 */
router.get('/', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;

  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM Producto p 
        WHERE IdProducto = COALESCE(${id}, p.IdProducto) 
        AND IdProveedor = COALESCE(${idProveedor}, p.IdProveedor)`, 
      (err, rows) => {
        err? res.json(err) :  res.json({rows});

    });
  });
});

/**
 * @swagger
 * /productos/onlyNames:
 *   get:
 *     summary: Obtener nombres de productos
 *     description: Retorna únicamente el ID y el Nombre de los productos filtrados.
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: ID del producto.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idProveedor
 *         required: false
 *         description: ID del proveedor.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de nombres obtenida.
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
 *                       IdProducto:
 *                         type: integer
 *                       Name:
 *                         type: string
 *       500:
 *         description: Error del servidor.
 */
router.get('/onlyNames', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;

  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT IdProducto, Name FROM Producto p 
        WHERE IdProducto = COALESCE(${id}, p.IdProducto) 
        AND IdProveedor = COALESCE(${idProveedor}, p.IdProveedor)`, 
      (err, rows) => {
        err? res.json(err) :  res.json({rows});

    });
  });
});


// joseking5@hotmail.com
// Leonardo01!

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     description: Registra un nuevo producto en el sistema.
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Name
 *               - Descripcion
 *               - IdProveedor
 *               - IdCatProducto
 *             properties:
 *               Name:
 *                 type: string
 *               Descripcion:
 *                 type: string
 *               Activo:
 *                 type: integer
 *               Valoracion:
 *                 type: number
 *               IdProveedor:
 *                 type: integer
 *               IdCatProducto:
 *                 type: integer
 *               UrlImg:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Producto creado exitosamente.
 *       500:
 *         description: Error al crear el producto.
 */
router.post('/',function(req, res){
    const { Name, Descripcion, Activo, Valoracion, IdProveedor, IdCatProducto, UrlImg} = req.body;
    req.getConnection((err, conn) =>{
      if (err) return res.send(err);
      conn.query(
        `INSERT INTO Producto (Descripcion, Activo, FechaCreacion, FechaModificacion, Valoracion, Name, IdCatProducto, IdProveedor, UrlImg) VALUES 
        ('${Descripcion}', ${Activo}, NOW(), NOW(), ${Valoracion}, '${Name}', ${IdCatProducto}, ${IdProveedor}, '${UrlImg}')`,
        (err, rows) => {
          err ?  console.log(res.json(err)) :res.json("Producto creado exitosamente");
        }
      );
    })
});

/**
 * @swagger
 * /productos:
 *   patch:
 *     summary: Actualizar valoración de producto
 *     description: Actualiza el campo 'Valoracion' de un producto específico.
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idProducto
 *               - ValoracionNueva
 *             properties:
 *               idProducto:
 *                 type: integer
 *               ValoracionNueva:
 *                 type: number
 *     responses:
 *       200:
 *         description: Valoración actualizada correctamente.
 *       500:
 *         description: Error del servidor.
 */
router.patch('/', (req, res, next) => {
  const {idProducto, ValoracionNueva} = req.body;
  console.log(req.body)
  req.getConnection((err, conn) => {
    if(err) return res.send(err);
    conn.query(
      `UPDATE Producto prod
        SET prod.Valoracion = COALESCE(${ValoracionNueva}, prod.Valoracion)
        WHERE prod.IdProducto = COALESCE(${idProducto}, prod.IdProducto)`,
      (err, rows) => {
        err? res.json(err) :  res.json({rows});

      }
    )
  })
});

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualizar producto (Incompleto)
 *     description: Endpoint de ejemplo; la lógica SQL aún no está implementada.
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               precio:
 *                 type: number
 *     responses:
 *       501:
 *         description: No implementado.
 */
router.put('/:id', function(req, res){
    const { id } = req.params;
    const { nombre, precio } = req.body;
    let sql = `UPDATE Producto SET nombre = ${nombre}, [precio = ${precio} WHERE ProductoId = ${id}`;

});

/**
 * @swagger
 * /productos:
 *   delete:
 *     summary: Eliminar producto (No implementado)
 *     description: Endpoint vacío.
 *     tags:
 *       - Productos
 *     responses:
 *       501:
 *         description: No implementado.
 */
router.delete('', function(req,res){
});

module.exports = router;
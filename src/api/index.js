const express = require('express');

const productos = require('./productos');
const ofertas = require('./ofertas');
const recompensas = require('./recompensas'); 
const compradores = require('./compradores');
const proveedores = require('./proveedores');
const compras = require('./compras');
const notificaciones = require('./notificaciones');
const catProductos = require('./catProductos');
const provFavoritos = require('./provFavoritos');
const estados = require('./estados');
const pubByCategoria = require('./pubByCategoria');
const usuarios = require('./usuarios');
const autenticacion = require('./auth');
const ofertaByProducto = require('./ofertaByProducto');
const ofertaByProductoLike = require('./ofertaByProductoLike');
const validarUsuario = require('./validarUsername');
const obtenerAhora = require('./getTimeNow');
const cambiarOfertaEstado = require('./cambiarOfertaEstado');
const reportes = require('./reportes');
const enviarNotificacionCompra = require('./enviarNotificacionCompra');
const enviarSolicitudesRegistro = require('./solicitudRegistro');
const aceptarSolicitudRegistro = require('./aceptarRegistro');
const HistorialOferta = require('./historialOferta');
const demandas = require('./demandas');
const propuestas = require('./propuestas');
const umbral = require('./umbralRecompensas');
const reporteInvitaciones = require('./reporteInvitaciones');
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Healthcheck de la API (v1)
 *     description: Endpoint de bienvenida para verificar que la API (v1) está funcionando.
 *     tags:
 *       - Utilidades
 *     responses:
 *       '200':
 *         description: La API está en línea.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'API - 👋🌎🌍🌏'
 */
router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/productos', productos);
router.use('/ofertas', ofertas)
router.use('/compradores', compradores);
router.use('/proveedores',proveedores);
router.use('/compras', compras);
router.use('/notificaciones', notificaciones);
router.use('/catProductos', catProductos);
router.use('/provFavoritos', provFavoritos);
router.use('/estados', estados);
router.use('/pubByCategoria', pubByCategoria);
router.use('/usuarios', usuarios);
router.use('/auth', autenticacion);
router.use('/ofertabyproducto', ofertaByProducto);
router.use('/validarusuario', validarUsuario);
router.use('/obtenerahora', obtenerAhora);
router.use('/cambiarofertaestado', cambiarOfertaEstado);
router.use('/ofertabyproductolike', ofertaByProductoLike);
router.use('/reportes', reportes);
router.use('/enviarNotificacionCompra', enviarNotificacionCompra);
router.use('/solicitudRegistro', enviarSolicitudesRegistro);
router.use('/aceptarRegistro', aceptarSolicitudRegistro);
router.use('/historialOferta',HistorialOferta);
router.use('/demandas',demandas);
router.use('/recompensas', recompensas);  
router.use('/propuestas',propuestas);
router.use('/umbralRecompensas', umbral);
router.use('/reporteInvitaciones', reporteInvitaciones);
module.exports = router;

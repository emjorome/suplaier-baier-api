const express = require('express');

const productos = require('./productos');
const publicaciones = require('./publicaciones');
const compradores = require('./compradores');
const proveedores = require('./proveedores');
const compras = require('./compras');
const notificaciones = require('./notificaciones');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/productos', productos);
router.use('/publicaciones', publicaciones)
router.use('/compradores', compradores);
router.use('/proveedores',proveedores);
router.use('/compras', compras);
router.use('/notificaciones', notificaciones)
module.exports = router;

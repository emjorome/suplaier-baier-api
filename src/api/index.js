const express = require('express');

const emojis = require('./emojis');
const productos = require('./productos');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/emojis', emojis);
router.use('/productos', productos)
module.exports = router;

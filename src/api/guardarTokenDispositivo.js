const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { idUsuario, token, tipoDispositivo } = req.body;

        const query = 'INSERT INTO TokenDispositivo (IdUsuario, Token, TipoDispositivo) VALUES (?, ?, ?)';
        await db.query(query, [idUsuario, token, tipoDispositivo]);

        res.json({
            success: true,
            message: 'Token de dispositivo guardado con éxito'
        });
    } catch (error) {
        console.error('Error al guardar el token de dispositivo:', error);
        res.status(500).send({
            success: false,
            message: 'Error al guardar el token de dispositivo'
        });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();

// Endpoint para obtener los tokens de dispositivo de un usuario específico
router.get('/token-dispositivo/:idUsuario', async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const query = 'SELECT Token FROM TokenDispositivo WHERE IdUsuario = ?';
        const tokens = await db.query(query, [idUsuario]);

        res.json({
            success: true,
            tokens: tokens
        });
    } catch (error) {
        console.error('Error al obtener tokens de dispositivo:', error);
        res.status(500).send({
            success: false,
            message: 'Error al obtener tokens de dispositivo'
        });
    }
});

module.exports = router;

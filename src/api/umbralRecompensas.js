// src/api/umbralRecompensas.js
const express = require('express');
const router = express.Router();

/**
 * GET /api/v1/umbral/niveles
 * Retorna todos los niveles de recompensa
 */
/**
 * @swagger
 * /umbralRecompensas/niveles:
 *   get:
 *     summary: Obtener todos los niveles de recompensa
 *     description: Retorna la lista de niveles de recompensa configurados, ordenados por el umbral mínimo de invitados de forma ascendente.
 *     tags:
 *       - Recompensas
 *     responses:
 *       '200':
 *         description: Lista de niveles obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       IdNivelRecompensa:
 *                         type: integer
 *                       UmbralMinInvitados:
 *                         type: integer
 *                       EstrellasPorInvitado:
 *                         type: integer
 *       '500':
 *         description: Error de base de datos.
 */
router.get('/niveles', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ ok: false, message: 'DB error' });

    conn.query(
      'SELECT * FROM nivelrecompensa ORDER BY UmbralMinInvitados ASC',
      (e, rows) => {
        if (e) return res.status(500).json({ ok: false, message: 'Query error' });
        return res.json({ ok: true, data: rows });
      }
    );
  });
});

/**
 * POST /niveles
 * Body: { UmbralMinInvitados, EstrellasPorInvitado }
 */
/**
 * @swagger
 * /umbralRecompensas/niveles:
 *   post:
 *     summary: Crear un nuevo nivel de recompensa
 *     description: Crea una nueva regla de recompensa definiendo cuántas estrellas se ganan a partir de cierto número de invitados.
 *     tags:
 *       - Recompensas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - UmbralMinInvitados
 *               - EstrellasPorInvitado
 *             properties:
 *               UmbralMinInvitados:
 *                 type: integer
 *                 description: Cantidad mínima de invitados para aplicar este nivel.
 *                 example: 10
 *               EstrellasPorInvitado:
 *                 type: integer
 *                 description: Cantidad de estrellas a otorgar por invitado en este nivel.
 *                 example: 5
 *     responses:
 *       '200':
 *         description: Nivel creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 id:
 *                   type: integer
 *       '400':
 *         description: Faltan parámetros.
 *       '500':
 *         description: Error de base de datos.
 */
router.post('/niveles', (req, res) => {
  const { UmbralMinInvitados, EstrellasPorInvitado } = req.body || {};

  if (UmbralMinInvitados == null || EstrellasPorInvitado == null) {
    return res.status(400).json({ ok: false, message: 'Faltan parámetros' });
  }

  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ ok: false, message: 'DB error' });

    conn.query(
      'INSERT INTO nivelrecompensa (UmbralMinInvitados, EstrellasPorInvitado) VALUES (?, ?)',
      [UmbralMinInvitados, EstrellasPorInvitado],
      (e, result) => {
        if (e) return res.status(500).json({ ok: false, message: 'Query error' });

        return res.json({
          ok: true,
          message: 'Nivel creado correctamente',
          id: result.insertId
        });
      }
    );
  });
});

/**
 * PUT /api/v1/umbral/niveles/:id
 * Body: { UmbralMinInvitados, EstrellasPorInvitado }
 */
/**
 * @swagger
 * /umbralRecompensas/niveles/{id}:
 *   put:
 *     summary: Actualizar un nivel de recompensa
 *     description: Modifica los valores de umbral y estrellas de un nivel existente.
 *     tags:
 *       - Recompensas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del nivel de recompensa a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UmbralMinInvitados:
 *                 type: integer
 *               EstrellasPorInvitado:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Nivel actualizado correctamente.
 *       '500':
 *         description: Error de base de datos.
 */
router.put('/niveles/:id', (req, res) => {
  const id = req.params.id;
  const { UmbralMinInvitados, EstrellasPorInvitado } = req.body || {};

  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ ok: false, message: 'DB error' });

    conn.query(
      `UPDATE NivelRecompensa
       SET UmbralMinInvitados = ?, EstrellasPorInvitado = ?
       WHERE IdNivelRecompensa = ?`,
      [UmbralMinInvitados, EstrellasPorInvitado, id],
      (e) => {
        if (e) return res.status(500).json({ ok: false, message: 'Query error' });

        return res.json({ ok: true, message: 'Nivel actualizado' });
      }
    );
  });
});

/**
 * DELETE /api/v1/umbral/niveles/:id
 */
/**
 * @swagger
 * /umbralRecompensas/niveles/{id}:
 *   delete:
 *     summary: Eliminar un nivel de recompensa
 *     description: Elimina un nivel de recompensa de la base de datos.
 *     tags:
 *       - Recompensas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del nivel de recompensa a eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Nivel eliminado correctamente.
 *       '500':
 *         description: Error de base de datos.
 */
router.delete('/niveles/:id', (req, res) => {
  const id = req.params.id;

  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ ok: false, message: 'DB error' });

    conn.query(
      'DELETE FROM nivelrecompensa WHERE IdNivelRecompensa = ?',
      [id],
      (e) => {
        if (e) return res.status(500).json({ ok: false, message: 'Query error' });

        return res.json({ ok: true, message: 'Nivel eliminado' });
      }
    );
  });
});

/**
 * PUT /api/v1/umbral/asignar-nivel
 * Body: { adminId, userId, nivelId }
 * Usa el SP AsignarNivelRecompensa
 */
/**
 * @swagger
 * /umbralRecompensas/asignar-nivel:
 *   put:
 *     summary: Asignar nivel de recompensa manualmente (Admin)
 *     description: Permite a un administrador asignar un nivel de recompensa específico a un usuario mediante un Procedimiento Almacenado.
 *     tags:
 *       - Recompensas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adminId
 *               - userId
 *               - nivelId
 *             properties:
 *               adminId:
 *                 type: integer
 *                 description: ID del administrador que ejecuta la acción.
 *               userId:
 *                 type: integer
 *                 description: ID del usuario al que se le asignará el nivel.
 *               nivelId:
 *                 type: integer
 *                 description: ID del nivel de recompensa a asignar.
 *     responses:
 *       '200':
 *         description: Nivel asignado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       '400':
 *         description: Error de validación o regla de negocio (ej. Admin no autorizado).
 *       '500':
 *         description: Error interno del servidor o del SP.
 */
router.put('/asignar-nivel', (req, res) => {
  const { adminId, userId, nivelId } = req.body || {};

  if (!adminId || !userId || !nivelId) {
    return res.status(400).json({ ok: false, message: 'Faltan parámetros' });
  }

  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ ok: false, message: 'DB error' });

    conn.query(
      'CALL AsignarNivelRecompensa(?, ?, ?)',
      [adminId, userId, nivelId],
      (e, rows) => {
        if (e) {
          if (e.errno === 1644) {
            return res.status(400).json({ ok: false, message: e.sqlMessage });
          }
          return res.status(500).json({ ok: false, message: e.sqlMessage });
        }

        return res.json({
          ok: true,
          message: 'Nivel asignado correctamente',
          data: rows[0]  // devuelve la info del usuario + nivel
        });
      }
    );
  });
});

module.exports = router;
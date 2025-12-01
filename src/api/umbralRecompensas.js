// src/api/umbralRecompensas.js
const express = require('express');
const router = express.Router();

/**
 * GET /api/v1/umbral/niveles
 * Retorna todos los niveles de recompensa
 */
router.get('/niveles', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ ok: false, message: 'DB error' });

    conn.query(
      'SELECT * FROM NivelRecompensa ORDER BY UmbralMinInvitados ASC',
      (e, rows) => {
        if (e) return res.status(500).json({ ok: false, message: 'Query error' });
        return res.json({ ok: true, data: rows });
      }
    );
  });
});

/**
 * POST /api/v1/umbral/niveles
 * Body: { UmbralMinInvitados, EstrellasPorInvitado }
 */
router.post('/niveles', (req, res) => {
  const { UmbralMinInvitados, EstrellasPorInvitado } = req.body || {};

  if (UmbralMinInvitados == null || EstrellasPorInvitado == null) {
    return res.status(400).json({ ok: false, message: 'Faltan parámetros' });
  }

  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ ok: false, message: 'DB error' });

    conn.query(
      'INSERT INTO NivelRecompensa (UmbralMinInvitados, EstrellasPorInvitado) VALUES (?, ?)',
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
router.delete('/niveles/:id', (req, res) => {
  const id = req.params.id;

  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ ok: false, message: 'DB error' });

    conn.query(
      'DELETE FROM NivelRecompensa WHERE IdNivelRecompensa = ?',
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
          return res.status(500).json({ ok: false, message: 'SP error' });
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
const express = require('express');
const router = express.Router();

/**
 * GET /api/v1/reporte-invitaciones/:idUsuario
 * Devuelve:
 *  - nombre del usuario
 *  - su código de invitación
 *  - lista de usuarios que usaron su código
 */
router.get('/:idUsuario', (req, res) => {
  const idUsuario = req.params.idUsuario;

  if (!idUsuario) {
    return res.status(400).json({ ok: false, message: 'Falta idUsuario' });
  }

  req.getConnection((err, conn) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ ok: false, message: 'Error DB' });
    }

    const sql = `
      SELECT 
        u.IdUsuario,
        u.Nombre,
        u.codigo_invitacion,
        inv.IdUsuario AS IdInvitado,
        inv.Nombre AS NombreInvitado,
        inv.Email AS EmailInvitado
      FROM Usuario u
      LEFT JOIN Usuario inv
             ON inv.invitado_por_id = u.IdUsuario
      WHERE u.IdUsuario = ?;
    `;

    conn.query(sql, [idUsuario], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ ok: false, message: 'Error consulta' });
      }

      if (rows.length === 0) {
        return res.json({ ok: true, message: 'Usuario no encontrado', data: null });
      }

      // Organizar respuesta
      const usuario = {
        IdUsuario: rows[0].IdUsuario,
        Nombre: rows[0].Nombre,
        CodigoInvitacion: rows[0].codigo_invitacion,
        Invitados: rows
          .filter(r => r.IdInvitado != null)
          .map(r => ({
            IdInvitado: r.IdInvitado,
            Nombre: r.NombreInvitado,
            Email: r.EmailInvitado
          }))
      };

      return res.json({ ok: true, data: usuario });
    });
  });
});

module.exports = router;

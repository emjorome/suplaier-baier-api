// src/api/recompensas.js
const express = require('express');
const router = express.Router();

/**
 * POST /api/v1/recompensas/canjear-invitacion
 * Body: { userId: number, code: string }
 */
/**
 * @swagger
 * /recompensas/canjear-invitacion:
 *   post:
 *     summary: Canjear un código de invitación
 *     description: Permite a un usuario canjear un código de invitación para recibir una recompensa. Llama al procedimiento almacenado `CanjearCodigoInvitacion`.
 *     tags:
 *       - Recompensas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - code
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID del usuario que canjea el código.
 *                 example: 10
 *               code:
 *                 type: string
 *                 description: Código de invitación.
 *                 example: "PROMO2025"
 *     responses:
 *       200:
 *         description: Proceso de canje completado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 alreadyClaimed:
 *                   type: boolean
 *                   description: Indica si el código ya había sido canjeado por este usuario.
 *                 award:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: "invite"
 *                     stars:
 *                       type: integer
 *                       example: 100
 *                     message:
 *                       type: string
 *                       example: "Obtuviste 100 Estrellas gracias a tu código de invitación"
 *                 balance:
 *                   type: integer
 *                   description: Saldo total actualizado.
 *                   example: 500
 *       400:
 *         description: Error de validación.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/canjear-invitacion', (req, res) => {
  const { userId, code } = req.body || {};
  if (!userId || !code) {
    return res.status(400).json({ ok: false, message: 'Faltan parámetros' });
  }

  const ESTRELLAS = 100;                 // <--- Asegúrate que NO sea 0
  const codigo = String(code).trim();    // el trigger normaliza a MAYÚSCULAS y sin espacios

  req.getConnection((err, conn) => {
    if (err) {
      console.error('[DB connect]', err);
      return res.status(500).json({ ok: false, message: 'Error interno (DB connect)' });
    }

    // Usamos el PROCEDIMIENTO para centralizar la lógica
    conn.query(
      'CALL CanjearCodigoInvitacion(?, ?, ?)',
      [userId, codigo, ESTRELLAS],       // <-- PASAR SIEMPRE EL 3er PARÁMETRO
      (errProc, rows) => {
        if (errProc) {
          // Cuando el SP hace SIGNAL 'Este código ya fue canjeado...', MySQL devuelve errno 1644
          if (errProc.errno === 1644) {
            // Devolvemos "ya canjeado" + saldo actual
            return conn.query(
              'SELECT estrellas_acumuladas AS saldo FROM Usuario WHERE IdUsuario = ?',
              [userId],
              (eSel, rs) => {
                const saldo = (!eSel && rs && rs[0]) ? rs[0].saldo : null;
                return res.json({
                  ok: true,
                  alreadyClaimed: true,
                  award: { type: 'invite', stars: 0, message: 'Este código ya fue canjeado anteriormente' },
                  balance: saldo
                });
              }
            );
          }

          // Si el trigger pegó por estrellas <= 0 u otro problema
          if (errProc.message) {
            return res.status(400).json({ ok: false, message: errProc.message });
          }
          console.error('[SP error]', errProc);
          return res.status(500).json({ ok: false, message: 'Error interno (SP)' });
        }

        // El SP ya insertó y (por triggers) ajustó el saldo. Leemos el saldo para responder.
        conn.query(
          'SELECT estrellas_acumuladas AS saldo FROM Usuario WHERE IdUsuario = ?',
          [userId],
          (eSel, rs) => {
            if (eSel) {
              console.error('[DB select saldo]', eSel);
              return res.status(500).json({ ok: false, message: 'Error interno (select saldo)' });
            }
            const saldo = rs && rs[0] ? rs[0].saldo : null;

            return res.json({
              ok: true,
              alreadyClaimed: false,
              award: { type: 'invite', stars: ESTRELLAS, message: 'Obtuviste 100 Estrellas gracias a tu código de invitación' },
              balance: saldo
            });
          }
        );
      }
    );
  });
});

/**
 * GET /api/v1/recompensas/saldo?userId=123
 */
/**
 * @swagger
 * /recompensas/saldo/{userId}:
 *   get:
 *     summary: Consultar saldo de estrellas
 *     description: Devuelve el saldo actual de estrellas acumuladas por un usuario.
 *     tags:
 *       - Recompensas
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del usuario.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Saldo obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 balance:
 *                   type: integer
 *                   description: Estrellas acumuladas.
 *                   example: 1250
 *       400:
 *         description: Falta el parámetro userId.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/saldo/:userId', (req, res) => {
  const userId = req.params.userId;
  if (!userId) return res.status(400).json({ ok: false, message: 'Falta userId' });

  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ ok: false, message: 'DB connect error' });
    conn.query(
      'SELECT estrellas_acumuladas AS saldo FROM Usuario WHERE IdUsuario = ?',
      [userId],
      (e, rows) => {
        if (e) return res.status(500).json({ ok: false, message: 'Query error' });
        const saldo = rows?.[0]?.saldo ?? 0;
        return res.json({ ok: true, balance: saldo });
      }
    );
  }); 
});

/**
 * GET /api/v1/recompensas/reporte-invitaciones/:userId
 * Obtiene el código de invitación del comprador y la lista de usuarios que lo han usado
 */
router.get('/reporte-invitaciones/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log('[REPORTE] Solicitando reporte para userId:', userId);
  
  if (!userId) return res.status(400).json({ ok: false, message: 'Falta userId' });

  req.getConnection((err, conn) => {
    if (err) {
      console.error('[REPORTE] Error de conexión DB:', err);
      return res.status(500).json({ ok: false, message: 'DB connect error' });
    }
    
    // Primero obtenemos el código de invitación del comprador
    conn.query(
      'SELECT codigo_invitacion, Nombre, Identificacion FROM Usuario WHERE IdUsuario = ?',
      [userId],
      (e, userRows) => {
        if (e) {
          console.error('[REPORTE] Error query usuario:', e);
          return res.status(500).json({ ok: false, message: 'Query error: ' + e.message });
        }
        if (!userRows || userRows.length === 0) {
          console.log('[REPORTE] Usuario no encontrado:', userId);
          return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
        }
        
        let codigoInvitacion = userRows[0].codigo_invitacion;
        const nombreComprador = userRows[0].Nombre;
        const identificacion = userRows[0].Identificacion;
        
        // Si no tiene código de invitación, generamos uno
        if (!codigoInvitacion) {
          const nombreCompleto = nombreComprador || '';
          const partesNombre = nombreCompleto.trim().split(/\s+/);
          const primerNombre = partesNombre[0] || '';
          const apellido = partesNombre.length > 1 ? partesNombre[partesNombre.length - 1] : '';
          
          // Generar código: primera letra del nombre + apellido + identificación
          codigoInvitacion = `${primerNombre.charAt(0).toLowerCase()}${apellido.toLowerCase()}${identificacion}`;
          
          // Actualizar en la base de datos
          conn.query(
            'UPDATE Usuario SET codigo_invitacion = ? WHERE IdUsuario = ?',
            [codigoInvitacion, userId],
            (errUpdate) => {
              if (errUpdate) {
                console.error('[REPORTE] Error al actualizar código:', errUpdate);
              } else {
                console.log('[REPORTE] Código generado y guardado:', codigoInvitacion);
              }
            }
          );
        }
        
        console.log('[REPORTE] Usuario encontrado:', nombreComprador, 'Código:', codigoInvitacion);
        
        // Ahora obtenemos todos los usuarios que fueron invitados por este comprador
        conn.query(
          `SELECT 
            u.IdUsuario,
            u.Nombre,
            u.Email,
            u.Identificacion,
            u.Pais,
            u.Ciudad
          FROM Usuario u
          WHERE u.invitado_por_id = ?
          ORDER BY u.IdUsuario DESC`,
          [userId],
          (e2, invitadosRows) => {
            if (e2) {
              console.error('[REPORTE] Error query invitados:', e2);
              return res.status(500).json({ ok: false, message: 'Query error al obtener invitados: ' + e2.message });
            }
            
            console.log('[REPORTE] Invitados encontrados:', invitadosRows ? invitadosRows.length : 0);
            
            return res.json({
              ok: true,
              comprador: {
                id: userId,
                nombre: nombreComprador,
                codigoInvitacion: codigoInvitacion
              },
              invitados: invitadosRows || [],
              totalInvitados: invitadosRows ? invitadosRows.length : 0
            });
          }
    )}
)});
  });

/**
 * GET /api/v1/recompensas/canjes
 * Obtiene la lista de opciones de descuento ordenadas por costo (ascendente)
 */
/**
 * @swagger
 * /recompensas/canjes:
 *   get:
 *     summary: Obtener opciones de descuento disponibles
 *     description: Retorna la lista de opciones de descuento ordenadas por costo de estrellas (ascendente). Útil para que el frontend muestre los descuentos disponibles al usuario.
 *     tags:
 *       - Recompensas
 *     responses:
 *       200:
 *         description: Lista de opciones de descuento obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 canjes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       IdOpcion:
 *                         type: integer
 *                         example: 1
 *                       Nombre:
 *                         type: string
 *                         example: "Bronce"
 *                       CostoEstrellas:
 *                         type: integer
 *                         description: Cantidad de estrellas necesarias para este descuento
 *                         example: 100
 *                       Porcentaje:
 *                         type: number
 *                         format: float
 *                         description: Porcentaje de descuento aplicado
 *                         example: 5.00
 *                       Activo:
 *                         type: boolean
 *                         example: true
 *                       FechaCreacion:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-12-06T10:30:00"
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/canjes', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      console.error('[CANJES] Error de conexión DB:', err);
      return res.status(500).json({ ok: false, message: 'DB connect error' });
    }

    // Consultar opciones de descuento activas, ordenadas por costo (ascendente)
    conn.query(
      `SELECT 
        IdOpcion,
        Nombre,
        CostoEstrellas,
        Porcentaje,
        Activo,
        FechaCreacion
      FROM opciones_descuento
      WHERE Activo = TRUE
      ORDER BY CostoEstrellas ASC`,
      (e, rows) => {
        if (e) {
          console.error('[CANJES] Error en query:', e);
          return res.status(500).json({ ok: false, message: 'Query error: ' + e.message });
        }

        return res.json({
          ok: true,
          canjes: rows || []
        });
      }
    );
  });
});

module.exports = router;

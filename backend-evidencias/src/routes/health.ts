import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Verificación del estado del servidor
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verifica el estado de la API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: La API está activa y operando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-05T21:15:30.000Z"
 *       500:
 *         description: Error interno del servidor al verificar el estado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 message:
 *                   type: string
 *                   example: Fallo al verificar el estado del servidor
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-05T21:15:30.000Z"
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        res.status(200).json({
            statusCode: 200,
            status: 'OK',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            status: 'ERROR',
            message: 'Fallo al verificar el estado del servidor',
            timestamp: new Date().toISOString()
        });
    }
});

export default router;

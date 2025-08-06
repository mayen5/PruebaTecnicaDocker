import { Router, Request, Response } from 'express';
import { getConnection } from '../db';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Verificación del estado del servidor y conexión a base de datos
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
 */
router.get('/', async (_req: Request, res: Response) => {
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

/**
 * @swagger
 * /api/health/db:
 *   get:
 *     summary: Verifica la conexión a la base de datos
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Conexión a base de datos exitosa
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
 *                 message:
 *                   type: string
 *                   example: Conexión a la base de datos establecida correctamente
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: No se pudo conectar a la base de datos
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
 *                   example: No se pudo conectar a la base de datos
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/db', async (_req: Request, res: Response) => {
    try {
        const pool = await getConnection();
        await pool.connect(); // Asegura la conexión
        res.status(200).json({
            statusCode: 200,
            status: 'OK',
            message: 'Conexión a la base de datos establecida correctamente',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            status: 'ERROR',
            message: 'No se pudo conectar a la base de datos',
            timestamp: new Date().toISOString()
        });
    }
});

export default router;

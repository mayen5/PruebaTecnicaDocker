import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica el estado de la API
 *     responses:
 *       200:
 *         description: La API está activa
 */
router.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

export default router;

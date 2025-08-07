import { Router } from 'express';
import {
    getIndiciosHandler,
    getIndicioByIdHandler,
    createIndicioHandler,
    updateIndicioByIdHandler,
    updateIndicioActivoByIdHandler,
    getIndiciosByExpedienteIdHandler
} from './controllers/indicio.controller';
import { authenticateJWT } from '../../auth/auth.middleware';
import { requireRole } from '../../auth/role.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Indicios
 *   description: Gestión de indicios
 */

/**
 * @swagger
 * /indicios:
 *   get:
 *     summary: Obtener todos los indicios
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de indicios
 */
router.get('/', authenticateJWT, requireRole([ 'tecnico', 'coordinador' ]), getIndiciosHandler);

/**
 * @swagger
 * /indicios/{id}:
 *   get:
 *     summary: Obtener un indicio por ID
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del indicio
 *     responses:
 *       200:
 *         description: Detalles del indicio
 *       404:
 *         description: No encontrado
 */
router.get('/:id', authenticateJWT, requireRole([ 'tecnico', 'coordinador' ]), getIndicioByIdHandler);

/**
 * @swagger
 * /indicios:
 *   post:
 *     summary: Crear un nuevo indicio
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expediente_id:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *               color:
 *                 type: string
 *               tamano:
 *                 type: string
 *               peso:
 *                 type: number
 *               ubicacion:
 *                 type: string
 *               tecnico_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Creado exitosamente
 */
router.post('/', authenticateJWT, requireRole([ 'tecnico', 'coordinador' ]), createIndicioHandler);

/**
 * @swagger
 * /indicios/{id}:
 *   put:
 *     summary: Actualizar indicio por ID
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               color:
 *                 type: string
 *               tamano:
 *                 type: string
 *               peso:
 *                 type: number
 *               ubicacion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.put('/:id', authenticateJWT, requireRole([ 'tecnico', 'coordinador' ]), updateIndicioByIdHandler);

/**
 * @swagger
 * /indicios/activardesactivar/{id}:
 *   put:
 *     summary: Eliminar indicio (lógico)
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del indicio
 *     responses:
 *       200:
 *         description: Eliminado lógicamente
 */
router.put('/activardesactivar/:id', authenticateJWT, requireRole([ 'tecnico', 'coordinador' ]), updateIndicioActivoByIdHandler);

/**
 * @swagger
 * /indicios/expediente/{expediente_id}:
 *   get:
 *     summary: Obtener todos los indicios de un expediente
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: expediente_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del expediente
 *     responses:
 *       200:
 *         description: Lista de indicios del expediente
 */
router.get(
    '/expediente/:expediente_id',
    authenticateJWT,
    requireRole([ 'tecnico', 'coordinador' ]),
    getIndiciosByExpedienteIdHandler
);

export default router;

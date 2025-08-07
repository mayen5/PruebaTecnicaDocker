import { Router } from 'express';
import {
    getExpedientesHandler,
    getExpedienteByIdHandler,
    createExpedienteHandler,
    updateExpedienteByIdHandler,
    updateExpedienteActivoByIdHandler
} from './controllers/expediente.controller';
import { authenticateJWT } from '../../auth/auth.middleware';
import { requireRole } from '../../auth/role.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Expedientes
 *   description: Gestión de expedientes
 */

/**
 * @swagger
 * /expedientes:
 *   get:
 *     summary: Obtener todos los expedientes activos
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de expedientes
 */
router.get('/', authenticateJWT, requireRole([ 'tecnico', 'coordinador' ]), getExpedientesHandler);

/**
 * @swagger
 * /expedientes/{id}:
 *   get:
 *     summary: Obtener un expediente por ID
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del expediente
 *     responses:
 *       200:
 *         description: Detalles del expediente
 *       404:
 *         description: No encontrado
 */
router.get('/:id', authenticateJWT, requireRole([ 'tecnico', 'coordinador' ]), getExpedienteByIdHandler);

/**
 * @swagger
 * /expedientes:
 *   post:
 *     summary: Crear un nuevo expediente
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               tecnico_id:
 *                 type: integer
 *               justificacion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Creado exitosamente
 */
router.post('/', authenticateJWT, requireRole([ 'tecnico', 'coordinador' ]), createExpedienteHandler);

/**
 * @swagger
 * /expedientes/{id}:
 *   put:
 *     summary: Actualizar expediente por ID
 *     tags: [Expedientes]
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
 *               estado:
 *                 type: string
 *                 enum: [pendiente, aprobado, rechazado]
 *               justificacion:
 *                 type: string
 *               tecnico_id:
 *                 type: integer
 *               aprobador_id:
 *                 type: integer
 *                 description: ID del usuario que aprueba/rechaza (solo requerido si estado es aprobado o rechazado)
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.put('/:id', authenticateJWT, requireRole([ 'tecnico', 'coordinador' ]), updateExpedienteByIdHandler);

/**
 * @swagger
 * /expedientes/activardesactivar/{id}:
 *   put:
 *     summary: Eliminar expediente (lógico)
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del expediente
 *     responses:
 *       200:
 *         description: Eliminado lógicamente
 */
router.put('/activardesactivar/:id', authenticateJWT, requireRole([ 'tecnico', 'coordinador' ]), updateExpedienteActivoByIdHandler);

export default router;

import { Router } from 'express';
import {
    getUsersHandler,
    createUserHandler,
    updateUserHandler,
    updateUserStatusHandler,
    getUserByUsernameHandler
} from './controllers/user.controller';

import { authenticateJWT } from '../../auth/auth.middleware';
import { authorizeRoles } from '../../auth/role.middleware';
import {
    validateUserWithPassword,
    validateUserWithPasswordHash
} from './middlewares/user.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios del sistema
 */

// Todas las rutas requieren autenticación
router.use(authenticateJWT);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *       403:
 *         description: No autorizado
 */
router.get('/', authorizeRoles('coordinador'), getUsersHandler);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - rol
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [tecnico, coordinador]
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: No autorizado
 */
router.post('/', authorizeRoles('coordinador'), validateUserWithPassword, createUserHandler);

/**
 * @swagger
 * /api/usuarios/{username}:
 *   put:
 *     summary: Actualizar un usuario existente
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password_hash
 *               - rol
 *             properties:
 *               username:
 *                 type: string
 *               password_hash:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [tecnico, coordinador]
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: No autorizado
 */
router.put('/:username', authorizeRoles('coordinador'), validateUserWithPasswordHash, updateUserHandler);

/**
 * @swagger
 * /api/usuarios/{username}:
 *   put:
 *     summary: Desactivar un usuario (eliminación lógica)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario desactivado exitosamente
 *       403:
 *         description: No autorizado
 */
router.put('/:username', authorizeRoles('coordinador'), updateUserStatusHandler);

/**
 * @swagger
 * /api/usuarios/{username}:
 *   get:
 *     summary: Obtener un usuario por username
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       403:
 *         description: No autorizado
 */
router.get('/:username', authorizeRoles('coordinador'), getUserByUsernameHandler);

export default router;

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import * as userModel from '../models/usuario.model';

// GET /usuarios
export const getUsersHandler = async (_req: Request, res: Response) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

// POST /usuarios
export const createUserHandler = async (req: Request, res: Response) => {
    try {
        const { username, password, rol } = req.body;
        const password_hash = await bcrypt.hash(password, 10);

        await userModel.createUser({ username, password_hash, rol });
        res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ message: 'Error al crear usuario' });
    }
};

// PUT /usuarios/:username
export const updateUserHandler = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const { password, rol } = req.body;
        const password_hash = await bcrypt.hash(password, 10);

        await userModel.updateUser({ username, password_hash, rol });
        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
};

// PUT /usuarios/:username
export const updateUserStatusHandler = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        // Consultar estado actual
        const user = await userModel.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const estabaActivo = user.activo === true;
        await userModel.updateUserStatus(username);
        const mensaje = estabaActivo
            ? 'Usuario desactivado exitosamente'
            : 'Usuario activado exitosamente';
        res.status(200).json({ message: mensaje });
    } catch (error) {
        console.error('Error al cambiar estado de usuario:', error);
        res.status(500).json({ message: 'Error al cambiar estado de usuario' });
    }
};

// GET /usuarios/:username
export const getUserByUsernameHandler = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const user = await userModel.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error al obtener usuario' });
    }
};

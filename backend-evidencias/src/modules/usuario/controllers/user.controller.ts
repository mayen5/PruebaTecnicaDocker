import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import * as userModel from '../models/user.model';

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

// DELETE /usuarios/:username
export const updateUserStatusHandler = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        await userModel.updateUserStatus(username);
        res.status(200).json({ message: 'Usuario desactivado exitosamente' });
    } catch (error) {
        console.error('Error al desactivar usuario:', error);
        res.status(500).json({ message: 'Error al desactivar usuario' });
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

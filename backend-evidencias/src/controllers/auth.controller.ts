import { Request, Response } from 'express';
import { generateToken, verifyToken } from '../auth/jwt.utils';
import type { Rol } from '../auth/auth.types';

interface User {
    username: string;
    password: string;
    rol: Rol;
}

const users: User[] = [
    { username: 'tecnico', password: '1234', rol: 'tecnico' },
    { username: 'coordinador', password: '5678', rol: 'coordinador' },
];

export const login = (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            statusCode: 400,
            status: 'Bad Request',
            message: 'Usuario y contraseña requeridos',
        });
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({
            statusCode: 401,
            status: 'Unauthorized',
            message: 'Credenciales incorrectas',
        });
    }

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        const existingToken = authHeader.split(' ')[ 1 ];

        try {
            const decoded = verifyToken(existingToken);
            if (
                typeof decoded === 'object' &&
                decoded &&
                'username' in decoded &&
                'rol' in decoded &&
                decoded.username === user.username &&
                decoded.rol === user.rol
            ) {
                return res.status(200).json({
                    statusCode: 200,
                    status: 'OK',
                    message: 'Ya existe una sesión activa',
                    user: {
                        username: user.username,
                        rol: user.rol,
                    },
                    token: existingToken,
                });
            }
        } catch (err) {
            // Token inválido o expirado, se generará uno nuevo
            console.warn('Token inválido o expirado:', err);
        }
    }

    const newToken = generateToken({ username: user.username, rol: user.rol });

    return res.status(200).json({
        statusCode: 200,
        status: 'OK',
        message: 'Inicio de sesión exitoso',
        user: {
            username: user.username,
            rol: user.rol,
        },
        token: newToken,
    });
};

export const logout = (_req: Request, res: Response) => {
    return res.status(200).json({
        statusCode: 200,
        status: 'OK',
        message: 'Sesión cerrada correctamente',
    });
};

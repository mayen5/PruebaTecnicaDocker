import { Request, Response } from 'express';
import { generateToken, verifyToken } from './jwt.utils';
import bcrypt from 'bcrypt';
import { getUserByUsername } from '../modules/usuario/models/usuario.model';

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            statusCode: 400,
            status: 'Bad Request',
            message: 'Usuario y contraseña requeridos',
        });
    }

    try {
        const user = await getUserByUsername(username);

        if (!user) {
            return res.status(401).json({
                statusCode: 401,
                status: 'Unauthorized',
                message: 'Credenciales incorrectas',
            });
        }

        if (!user.activo) {
            return res.status(403).json({
                statusCode: 403,
                status: 'Forbidden',
                message: 'El usuario está inactivo',
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({
                statusCode: 401,
                status: 'Unauthorized',
                message: 'Credenciales incorrectas',
            });
        }

        // Validación de token existente (opcional, por si hay sesión activa)
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            const existingToken = authHeader.split(' ')[ 1 ];
            try {
                const decoded = verifyToken(existingToken);

                if (
                    typeof decoded === 'object' &&
                    decoded?.username === user.username &&
                    decoded?.rol === user.rol
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
                console.warn('Token inválido o expirado:', err);
                // Continuará generando uno nuevo
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

    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({
            statusCode: 500,
            status: 'ERROR',
            message: 'Error interno del servidor',
        });
    }
};

export const logout = (_req: Request, res: Response) => {
    return res.status(200).json({
        statusCode: 200,
        status: 'OK',
        message: 'Sesión cerrada correctamente',
    });
};

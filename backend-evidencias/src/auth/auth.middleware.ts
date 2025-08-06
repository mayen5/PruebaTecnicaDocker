import { Request, Response, NextFunction } from 'express';
import '../express'; // Asegura que se haya extendido el tipo Request
import { verifyToken } from './jwt.utils';
import type { UserPayload } from './auth.types';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token requerido' });
    }

    const token = authHeader.split(' ')[ 1 ];

    try {
        const user = verifyToken(token); // Ahora retorna UserPayload gracias al tipado
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
    }
};

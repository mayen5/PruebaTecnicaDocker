import jwt from 'jsonwebtoken';
import { Rol } from './auth.types';

export interface TokenPayload {
    id: string;
    username: string;
    rol: Rol;
}

// Lee la variable de entorno dinámicamente en cada invocación
function getJwtSecret(): string {
    return process.env.JWT_SECRET || 'supersecret';
}

export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: '1h' });
};

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
};

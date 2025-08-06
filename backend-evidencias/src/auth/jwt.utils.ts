import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Rol } from './auth.types';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export interface TokenPayload {
    username: string;
    rol: Rol;
}

export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

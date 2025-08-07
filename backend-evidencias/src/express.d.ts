import { Rol } from './auth/auth.types';
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                username: string;
                rol: Rol;
            };
        }
    }
}
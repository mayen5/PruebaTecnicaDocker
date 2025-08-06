

import { Rol } from './auth/auth.types';
declare global {
    namespace Express {
        interface Request {
            user?: {
                username: string;
                rol: Rol;
            };
        }
    }
}

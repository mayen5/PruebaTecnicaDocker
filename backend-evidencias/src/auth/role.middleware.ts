/// <reference path="../express.d.ts" />
import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as { rol: string };

        if (!roles.includes(user?.rol)) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        next();
    };
};

import { Request, Response, NextFunction } from 'express';

const validRoles = [ 'tecnico', 'coordinador' ];

// Middleware para validar payload con campo `password`
export const validateUserWithPassword = (req: Request, res: Response, next: NextFunction) => {
    const { username, password, rol } = req.body;

    if (!username || typeof username !== 'string') {
        return res.status(400).json({ message: 'El campo username es obligatorio y debe ser texto' });
    }

    if (!password || typeof password !== 'string') {
        return res.status(400).json({ message: 'El campo password es obligatorio y debe ser texto' });
    }

    if (!rol || !validRoles.includes(rol)) {
        return res.status(400).json({ message: 'El campo rol es obligatorio y debe ser "tecnico" o "coordinador"' });
    }

    next();
};

// Middleware para validar payload con campo `password_hash`
export const validateUserWithPasswordHash = (req: Request, res: Response, next: NextFunction) => {
    const { username, password_hash, rol } = req.body;

    if (!username || typeof username !== 'string') {
        return res.status(400).json({ message: 'El campo username es obligatorio y debe ser texto' });
    }

    if (!password_hash || typeof password_hash !== 'string') {
        return res.status(400).json({ message: 'El campo password_hash es obligatorio y debe ser texto' });
    }

    if (!rol || !validRoles.includes(rol)) {
        return res.status(400).json({ message: 'El campo rol es obligatorio y debe ser "tecnico" o "coordinador"' });
    }

    next();
};

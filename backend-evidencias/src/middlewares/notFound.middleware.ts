import { Request, Response } from 'express';

export const notFound = (req: Request, res: Response) => {
    res.status(404).json({ message: `Ruta no encontrada: ${req.originalUrl}` });
};

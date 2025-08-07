import { notFound } from '../../src/middlewares/notFound.middleware';
import { Request, Response } from 'express';

describe('Middleware notFound', () => {
    const mockRequest = (url = '/ruta/desconocida'): Request => ({
        originalUrl: url,
    } as unknown as Request);

    const mockResponse = () => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    test('debería responder con 404 y mensaje de ruta no encontrada', () => {
        const req = mockRequest('/no-existe');
        const res = mockResponse();

        notFound(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Ruta no encontrada: /no-existe' });
    });
});

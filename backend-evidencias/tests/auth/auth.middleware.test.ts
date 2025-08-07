import { authenticateJWT } from '../../src/auth/auth.middleware';
import { Request, Response, NextFunction } from 'express';
import { generateToken } from '../../src/auth/jwt.utils';
import type { Rol } from '../../src/auth/auth.types';

describe('Middleware authenticateJWT', () => {
    const payload = { id: '1', username: 'test', rol: 'tecnico' as Rol };
    const token = generateToken(payload);

    interface MockRequest extends Request {
        user?: typeof payload;
    }

    const mockRequest = (token?: string): MockRequest => ({
        headers: {
            authorization: token ? `Bearer ${token}` : undefined,
        },
    } as unknown as MockRequest);

    const mockResponse = () => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    test('debería permitir paso si el token es válido', () => {
        const req = mockRequest(token);
        const res = mockResponse();
        const next = jest.fn();

        authenticateJWT(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toMatchObject(payload);
    });

    test('debería bloquear si no se proporciona token', () => {
        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        authenticateJWT(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token requerido' });
    });

    test('debería bloquear si el token es inválido', () => {
        const req = mockRequest('Bearer token_invalido');
        const res = mockResponse();
        const next = jest.fn();

        authenticateJWT(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido o expirado' });
    });
});

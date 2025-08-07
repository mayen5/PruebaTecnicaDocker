import { requireRole, authorizeRoles } from '../../src/auth/role.middleware';
import { Request, Response, NextFunction } from 'express';

describe('Middleware requireRole', () => {
    const next = jest.fn();
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;

    const mockReq = (rol: string) => ({
        user: { rol },
    } as Request);

    test('debería permitir acceso si el rol coincide', () => {
        const req = mockReq('tecnico');
        requireRole([ 'tecnico' ])(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    test('debería bloquear si el rol no está permitido', () => {
        const req = mockReq('visitante');
        requireRole([ 'tecnico' ])(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Acceso denegado: rol no autorizado' });
    });

    test('authorizeRoles permite acceso si el rol está autorizado', () => {
        const req = mockReq('coordinador');
        const resLocal = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        const nextLocal = jest.fn();
        authorizeRoles('tecnico', 'coordinador')(req, resLocal, nextLocal);
        expect(nextLocal).toHaveBeenCalled();
    });

    test('authorizeRoles bloquea acceso si el rol no está autorizado', () => {
        const req = mockReq('visitante');
        const resLocal = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        const nextLocal = jest.fn();
        authorizeRoles('tecnico', 'coordinador')(req, resLocal, nextLocal);
        expect(resLocal.status).toHaveBeenCalledWith(403);
        expect(resLocal.json).toHaveBeenCalledWith({ message: 'Acceso denegado' });
        expect(nextLocal).not.toHaveBeenCalled();
    });
});

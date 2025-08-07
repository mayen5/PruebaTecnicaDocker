import { validateUserWithPassword, validateUserWithPasswordHash } from '../../../../src/modules/usuario/middlewares/usuario.middleware';
import { Request, Response, NextFunction } from 'express';

describe('validateUserWithPassword', () => {
    const validUser = { username: 'usuario', password: '123456', rol: 'tecnico' };

    const mockRequest = (body?: any): Request => ({
        body: body || {},
    } as unknown as Request);

    const mockResponse = () => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterAll(() => {
        (console.error as jest.Mock).mockRestore?.();
    });

    test('validateUserWithPassword: permite paso si username, password y rol son válidos', () => {
        const req = mockRequest(validUser);
        const res = mockResponse();
        const next = jest.fn();

        validateUserWithPassword(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test('validateUserWithPassword: responde 400 si falta username', () => {
        const req = mockRequest({ password: '123456', rol: 'tecnico' });
        const res = mockResponse();
        const next = jest.fn();

        validateUserWithPassword(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'El campo username es obligatorio y debe ser texto' });
    });

    test('validateUserWithPassword: responde 400 si falta password', () => {
        const req = mockRequest({ username: 'usuario', rol: 'tecnico' });
        const res = mockResponse();
        const next = jest.fn();

        validateUserWithPassword(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'El campo password es obligatorio y debe ser texto' });
    });

    test('validateUserWithPassword: responde 400 si falta rol', () => {
        const req = mockRequest({ username: 'usuario', password: '123456' });
        const res = mockResponse();
        const next = jest.fn();

        validateUserWithPassword(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'El campo rol es obligatorio y debe ser "tecnico" o "coordinador"' });
    });

    test('validateUserWithPassword: responde 400 si rol es inválido', () => {
        const req = mockRequest({ username: 'usuario', password: '123456', rol: 'otro' });
        const res = mockResponse();
        const next = jest.fn();

        validateUserWithPassword(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'El campo rol es obligatorio y debe ser "tecnico" o "coordinador"' });
    });
});

describe('validateUserWithPasswordHash', () => {
    const validUser = { username: 'usuario', password_hash: 'hashvalido', rol: 'coordinador' };

    const mockRequest = (body?: any): Request => ({
        body: body || {},
    } as unknown as Request);

    const mockResponse = () => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    test('validateUserWithPasswordHash: permite paso si username, password_hash y rol son válidos', () => {
        const req = mockRequest(validUser);
        const res = mockResponse();
        const next = jest.fn();

        validateUserWithPasswordHash(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test('validateUserWithPasswordHash: responde 400 si falta username', () => {
        const req = mockRequest({ password_hash: 'hashvalido', rol: 'coordinador' });
        const res = mockResponse();
        const next = jest.fn();

        validateUserWithPasswordHash(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'El campo username es obligatorio y debe ser texto' });
    });

    test('validateUserWithPasswordHash: responde 400 si falta password_hash', () => {
        const req = mockRequest({ username: 'usuario', rol: 'coordinador' });
        const res = mockResponse();
        const next = jest.fn();

        validateUserWithPasswordHash(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'El campo password_hash es obligatorio y debe ser texto' });
    });

    test('validateUserWithPasswordHash: responde 400 si falta rol', () => {
        const req = mockRequest({ username: 'usuario', password_hash: 'hashvalido' });
        const res = mockResponse();
        const next = jest.fn();

        validateUserWithPasswordHash(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'El campo rol es obligatorio y debe ser "tecnico" o "coordinador"' });
    });

    test('validateUserWithPasswordHash: responde 400 si rol es inválido', () => {
        const req = mockRequest({ username: 'usuario', password_hash: 'hashvalido', rol: 'otro' });
        const res = mockResponse();
        const next = jest.fn();

        validateUserWithPasswordHash(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'El campo rol es obligatorio y debe ser "tecnico" o "coordinador"' });
    });
});

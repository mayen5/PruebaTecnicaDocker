import { errorHandler } from '../../src/middlewares/error.middleware';
import { Request, Response, NextFunction } from 'express';

describe('Middleware errorHandler', () => {
    const mockRequest = {} as Request;
    const mockResponse = () => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };
    const mockNext: NextFunction = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterAll(() => {
        (console.error as jest.Mock).mockRestore?.();
    });

    test('debería responder con 500 y mensaje de error', () => {
        const err = new Error('Test error');
        const res = mockResponse();

        errorHandler(err, mockRequest, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error interno del servidor' });
    });

    test('debería llamar a console.error', () => {
        const err = new Error('Test error');
        const res = mockResponse();
        const spy = jest.spyOn(console, 'error').mockImplementation(() => { });

        errorHandler(err, mockRequest, res, mockNext);

        expect(spy).toHaveBeenCalledWith('Error no controlado:', err);

        spy.mockRestore();
    });
});

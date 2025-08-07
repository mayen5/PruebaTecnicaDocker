import { logger } from '../../src/middlewares/logger.middleware';
import { Request, Response, NextFunction } from 'express';

describe('Middleware logger', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    const mockRequest = (method = 'GET', path = '/test'): Request => ({
        method,
        path,
    } as unknown as Request);

    const mockResponse = {} as Response;

    test('debería llamar a console.log con el método y path', () => {
        const req = mockRequest('POST', '/api/data');
        const next = jest.fn();

        logger(req, mockResponse, next);

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringMatching(/\[.*\] POST \/api\/data/)
        );
        expect(next).toHaveBeenCalled();
    });

    test('debería llamar a next', () => {
        const req = mockRequest();
        const next = jest.fn();

        logger(req, mockResponse, next);

        expect(next).toHaveBeenCalled();
    });
});

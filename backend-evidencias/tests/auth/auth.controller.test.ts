import * as authController from '../../src/auth/auth.controller';
import * as usuarioModel from '../../src/modules/usuario/models/usuario.model';
import * as jwtUtils from '../../src/auth/jwt.utils';
import bcrypt from 'bcrypt';

jest.mock('../../src/modules/usuario/models/usuario.model');
jest.mock('bcrypt');
jest.mock('../../src/auth/jwt.utils');

describe('Auth Controller', () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as any;

    let req: any;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
        req = {
            body: {},
            headers: {},
        };
    });

    afterAll(() => {
        (console.error as jest.Mock).mockRestore?.();
    });

    describe('login', () => {
        it('debe responder 400 si faltan credenciales', async () => {
            req.body = {};
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 400,
                status: 'Bad Request',
            }));
        });

        it('debe responder 401 si usuario no existe', async () => {
            req.body = { username: 'user', password: 'pass' };
            (usuarioModel.getUserByUsername as jest.Mock).mockResolvedValue(undefined);
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 401,
                status: 'Unauthorized',
            }));
        });

        it('debe responder 403 si usuario está inactivo', async () => {
            req.body = { username: 'user', password: 'pass' };
            (usuarioModel.getUserByUsername as jest.Mock).mockResolvedValue({ username: 'user', password_hash: 'hash', activo: false, rol: 'admin' });
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 403,
                status: 'Forbidden',
            }));
        });

        it('debe responder 401 si la contraseña es incorrecta', async () => {
            req.body = { username: 'user', password: 'pass' };
            (usuarioModel.getUserByUsername as jest.Mock).mockResolvedValue({ username: 'user', password_hash: 'hash', activo: true, rol: 'admin' });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 401,
                status: 'Unauthorized',
            }));
        });

        it('debe responder 200 y token si credenciales son correctas', async () => {
            req.body = { username: 'user', password: 'pass' };
            (usuarioModel.getUserByUsername as jest.Mock).mockResolvedValue({ username: 'user', password_hash: 'hash', activo: true, rol: 'admin' });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwtUtils.generateToken as jest.Mock).mockReturnValue('mock-token');
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 200,
                status: 'OK',
                token: 'mock-token',
            }));
        });

        it('debe responder 200 si ya existe sesión activa', async () => {
            req.body = { username: 'user', password: 'pass' };
            req.headers.authorization = 'Bearer existing-token';
            (usuarioModel.getUserByUsername as jest.Mock).mockResolvedValue({ username: 'user', password_hash: 'hash', activo: true, rol: 'admin' });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwtUtils.verifyToken as jest.Mock).mockReturnValue({ username: 'user', rol: 'admin' });
            // Ajusta el mock para que generateToken NO se llame y el token sea el existente
            (jwtUtils.generateToken as jest.Mock).mockReturnValue('existing-token');
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 200,
                status: 'OK',
                token: 'existing-token',
            }));
        });

        it('debe responder 500 si ocurre error interno', async () => {
            req.body = { username: 'user', password: 'pass' };
            (usuarioModel.getUserByUsername as jest.Mock).mockRejectedValue(new Error('DB error'));
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 500,
                status: 'ERROR',
            }));
        });
    });

    describe('logout', () => {
        it('debe responder 200 y mensaje de cierre de sesión', async () => {
            await authController.logout(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 200,
                status: 'OK',
                message: 'Sesión cerrada correctamente',
            }));
        });
    });
});

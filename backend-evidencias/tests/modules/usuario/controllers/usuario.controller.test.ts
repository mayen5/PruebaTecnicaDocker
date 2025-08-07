import * as usuarioController from '../../../../src/modules/usuario/controllers/usuario.controller';
import * as userModel from '../../../../src/modules/usuario/models/usuario.model';

jest.mock('../../../../src/modules/usuario/models/usuario.model');

describe('Usuario Controller', () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as any;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterAll(() => {
        (console.error as jest.Mock).mockRestore?.();
    });

    test('getUsersHandler responde con usuarios', async () => {
        (userModel.getAllUsers as jest.Mock).mockResolvedValue([ { username: 'test' } ]);
        await usuarioController.getUsersHandler({} as any, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([ { username: 'test' } ]);
    });

    test('getUsersHandler responde con error', async () => {
        (userModel.getAllUsers as jest.Mock).mockRejectedValue(new Error('DB error'));
        await usuarioController.getUsersHandler({} as any, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error al obtener usuarios' });
    });

    test('createUserHandler responde con éxito', async () => {
        (userModel.createUser as jest.Mock).mockResolvedValue(undefined);
        const req = { body: { username: 'nuevo', password: '123', rol: 'tecnico' } } as any;
        await usuarioController.createUserHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Usuario creado exitosamente' });
    });

    test('createUserHandler responde con error', async () => {
        (userModel.createUser as jest.Mock).mockRejectedValue(new Error('DB error'));
        const req = { body: { username: 'nuevo', password: '123', rol: 'tecnico' } } as any;
        await usuarioController.createUserHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error al crear usuario' });
    });

    test('updateUserHandler responde con éxito', async () => {
        (userModel.updateUser as jest.Mock).mockResolvedValue(undefined);
        const req = { params: { username: 'test' }, body: { password: '123', rol: 'tecnico' } } as any;
        await usuarioController.updateUserHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Usuario actualizado exitosamente' });
    });

    test('updateUserHandler responde con error', async () => {
        (userModel.updateUser as jest.Mock).mockRejectedValue(new Error('DB error'));
        const req = { params: { username: 'test' }, body: { password: '123', rol: 'tecnico' } } as any;
        await usuarioController.updateUserHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error al actualizar usuario' });
    });

    test('updateUserStatusHandler responde con éxito', async () => {
        (userModel.getUserByUsername as jest.Mock).mockResolvedValue({ username: 'test', activo: true });
        (userModel.updateUserStatus as jest.Mock).mockResolvedValue(undefined);
        const req = { params: { username: 'test' } } as any;
        await usuarioController.updateUserStatusHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Usuario desactivado exitosamente' });
    });

    test('updateUserStatusHandler responde con error', async () => {
        (userModel.getUserByUsername as jest.Mock).mockRejectedValue(new Error('DB error'));
        const req = { params: { username: 'test' } } as any;
        await usuarioController.updateUserStatusHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error al cambiar estado de usuario' });
    });

    test('getUserByUsernameHandler responde con usuario', async () => {
        (userModel.getUserByUsername as jest.Mock).mockResolvedValue({ username: 'test', rol: 'admin' });
        const req = { params: { username: 'test' } } as any;
        await usuarioController.getUserByUsernameHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ username: 'test', rol: 'admin' });
    });

    test('getUserByUsernameHandler responde con error', async () => {
        (userModel.getUserByUsername as jest.Mock).mockRejectedValue(new Error('DB error'));
        const req = { params: { username: 'test' } } as any;
        await usuarioController.getUserByUsernameHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error al obtener usuario' });
    });

    test('getUserByUsernameHandler responde con 404 si no existe', async () => {
        (userModel.getUserByUsername as jest.Mock).mockResolvedValue(null);
        const req = { params: { username: 'noexiste' } } as any;
        await usuarioController.getUserByUsernameHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
    });

    test('updateUserStatusHandler responde con 404 si falta username', async () => {
        const req = { params: {} } as any;
        (userModel.getUserByUsername as jest.Mock).mockResolvedValue(null);
        await usuarioController.updateUserStatusHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
    });
});
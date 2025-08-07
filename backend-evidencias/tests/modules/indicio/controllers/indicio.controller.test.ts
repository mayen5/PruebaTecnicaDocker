import * as indicioController from '../../../../src/modules/indicio/controllers/indicio.controller';
import * as indicioModel from '../../../../src/modules/indicio/models/indicio.model';

jest.mock('../../../../src/modules/indicio/models/indicio.model');

describe('Indicio Controller', () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as any;

    let req: any;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
        req = {
            headers: { authorization: 'Bearer mock-token' },
            user: { username: 'usuario_test', rol: 'tecnico' },
            params: {},
            body: {}
        };
    });

    afterAll(() => {
        (console.error as jest.Mock).mockRestore?.();
    });

    test('getIndiciosHandler responde con indicios', async () => {
        (indicioModel.getAllIndicios as jest.Mock).mockResolvedValue([ { id: 1, nombre: 'indicio1' } ]);
        await indicioController.getIndiciosHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([ { id: 1, nombre: 'indicio1' } ]);
    });

    test('getIndiciosHandler responde con error', async () => {
        (indicioModel.getAllIndicios as jest.Mock).mockRejectedValue(new Error('DB error'));
        await indicioController.getIndiciosHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error al obtener indicios' });
    });

    test('createIndicioHandler responde con éxito', async () => {
        (indicioModel.insertIndicio as jest.Mock).mockResolvedValue(undefined);
        req.body = {
            expediente_id: 1,
            tecnico_id: 2,
            descripcion: 'descripcion prueba',
            color: 'rojo',
            tamano: 'grande',
            peso: 10,
            ubicacion: 'almacen',
        };
        await indicioController.createIndicioHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Indicio creado exitosamente' });
    });

    test('createIndicioHandler responde con error', async () => {
        (indicioModel.insertIndicio as jest.Mock).mockRejectedValue(new Error('DB error'));
        req.body = {
            expediente_id: 1,
            tecnico_id: 2,
            descripcion: 'descripcion prueba',
            color: 'rojo',
            tamano: 'grande',
            peso: 10,
            ubicacion: 'almacen',
        };
        await indicioController.createIndicioHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });

    test('updateIndicioByIdHandler responde con éxito', async () => {
        (indicioModel.updateIndicioById as jest.Mock).mockResolvedValue(undefined);
        req.params.id = 1;
        req.body = {
            descripcion: 'actualizado',
            estado: 'aprobado',
            justificacion: 'revisado',
            expediente_id: 1
        };
        await indicioController.updateIndicioByIdHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Indicio actualizado exitosamente' });
    });

    test('updateIndicioByIdHandler responde con error', async () => {
        (indicioModel.updateIndicioById as jest.Mock).mockRejectedValue(new Error('DB error'));
        req.params.id = 1;
        req.body = {
            descripcion: 'actualizado',
            estado: 'aprobado',
            justificacion: 'revisado',
            expediente_id: 1
        };
        await indicioController.updateIndicioByIdHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });

    test('getIndicioByIdHandler responde con indicio', async () => {
        req.params.id = 1;
        (indicioModel.getIndicioById as jest.Mock).mockResolvedValue({ id: 1, nombre: 'indicio1' });
        await indicioController.getIndicioByIdHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 1, nombre: 'indicio1' });
    });

    test('getIndicioByIdHandler responde con error', async () => {
        req.params.id = 1;
        (indicioModel.getIndicioById as jest.Mock).mockRejectedValue(new Error('DB error'));
        await indicioController.getIndicioByIdHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error al obtener indicio' });
    });

    test('updateIndicioActivoByIdHandler responde con éxito', async () => {
        (indicioModel.getIndicioById as jest.Mock).mockResolvedValue({ id: 1, activo: true });
        (indicioModel.updateIndicioActivoById as jest.Mock).mockResolvedValue(undefined);
        req.params.id = 1;

        await indicioController.updateIndicioActivoByIdHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Indicio desactivado exitosamente' });
    });

    test('updateIndicioActivoByIdHandler responde con indicio no encontrado', async () => {
        (indicioModel.getIndicioById as jest.Mock).mockResolvedValue(undefined);
        req.params.id = 1;

        await indicioController.updateIndicioActivoByIdHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Indicio no encontrado' });
    });

    test('updateIndicioActivoByIdHandler responde con error', async () => {
        (indicioModel.getIndicioById as jest.Mock).mockRejectedValue(new Error('DB error'));
        req.params.id = 1;

        await indicioController.updateIndicioActivoByIdHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });

});

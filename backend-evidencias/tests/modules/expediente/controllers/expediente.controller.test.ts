import * as expedienteController from '../../../../src/modules/expediente/controllers/expediente.controller';
import * as expedienteModel from '../../../../src/modules/expediente/models/expediente.model';

jest.mock('../../../../src/modules/expediente/models/expediente.model');

describe('Expediente Controller', () => {
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

    test('getExpedientesHandler responde con expedientes', async () => {
        (expedienteModel.getAllExpedientes as jest.Mock).mockResolvedValue([ { id: 1, nombre: 'expediente1' } ]);
        await expedienteController.getExpedientesHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([ { id: 1, nombre: 'expediente1' } ]);
    });

    test('getExpedientesHandler responde con error', async () => {
        (expedienteModel.getAllExpedientes as jest.Mock).mockRejectedValue(new Error('DB error'));
        await expedienteController.getExpedientesHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error al obtener expedientes' });
    });

    test('createExpedienteHandler responde con éxito', async () => {
        (expedienteModel.insertExpediente as jest.Mock).mockResolvedValue(undefined);
        req.body = {
            codigo: 'EXP-001',
            descripcion: 'descripcion prueba',
            tecnico_id: 1,
            justificacion: 'justificacion opcional'
        };
        await expedienteController.createExpedienteHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Expediente creado exitosamente' });
    });

    test('createExpedienteHandler responde con error', async () => {
        (expedienteModel.insertExpediente as jest.Mock).mockRejectedValue(new Error('DB error'));
        req.body = {
            codigo: 'EXP-001',
            descripcion: 'descripcion prueba',
            tecnico_id: 1
        };
        await expedienteController.createExpedienteHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });

    test('updateExpedienteByIdHandler responde con éxito', async () => {
        (expedienteModel.updateExpedienteById as jest.Mock).mockResolvedValue(undefined);
        req.params.id = 1;
        req.body = {
            descripcion: 'actualizado',
            estado: 'aprobado',
            justificacion: 'revisado',
            tecnico_id: 1
        };
        await expedienteController.updateExpedienteByIdHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Expediente actualizado exitosamente' });
    });

    test('updateExpedienteByIdHandler responde con error', async () => {
        (expedienteModel.updateExpedienteById as jest.Mock).mockRejectedValue(new Error('DB error'));
        req.params.id = 1;
        req.body = {
            descripcion: 'actualizado',
            estado: 'aprobado',
            justificacion: 'revisado',
            tecnico_id: 1
        };
        await expedienteController.updateExpedienteByIdHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });

    test('getExpedienteByIdHandler responde con expediente', async () => {
        req.params.id = 1;
        (expedienteModel.getExpedienteById as jest.Mock).mockResolvedValue({ id: 1, nombre: 'expediente1' });
        await expedienteController.getExpedienteByIdHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 1, nombre: 'expediente1' });
    });

    test('getExpedienteByIdHandler responde con error', async () => {
        req.params.id = 1;
        (expedienteModel.getExpedienteById as jest.Mock).mockRejectedValue(new Error('DB error'));
        await expedienteController.getExpedienteByIdHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error al obtener expediente' });
    });

    test('updateExpedienteActivoByIdHandler responde con éxito', async () => {
        (expedienteModel.getExpedienteById as jest.Mock).mockResolvedValue({ id: 1, activo: true });
        (expedienteModel.updateExpedienteActivoById as jest.Mock).mockResolvedValue(undefined);
        req.params.id = 1;

        await expedienteController.updateExpedienteActivoByIdHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Expediente desactivado exitosamente' });
    });

    test('updateExpedienteActivoByIdHandler responde con expediente no encontrado', async () => {
        (expedienteModel.getExpedienteById as jest.Mock).mockResolvedValue(undefined);
        req.params.id = 1;

        await expedienteController.updateExpedienteActivoByIdHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Expediente no encontrado' });
    });

    test('updateExpedienteActivoByIdHandler responde con error', async () => {
        (expedienteModel.getExpedienteById as jest.Mock).mockRejectedValue(new Error('DB error'));
        req.params.id = 1;

        await expedienteController.updateExpedienteActivoByIdHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });

});

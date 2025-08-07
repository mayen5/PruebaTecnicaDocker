
import { Request, Response } from 'express';
import { getConnection } from '../../../db';

// GET /indicios
export const getIndiciosHandler = async (_req: Request, res: Response) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('SP_GET_Indicios');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener indicios:', error);
        res.status(500).json({ message: 'Error al obtener indicios' });
    }
};

// GET /indicios/:id
export const getIndicioByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', Number(id))
            .execute('SP_GET_IndicioById');
        const indicio = result.recordset[0];
        if (!indicio) {
            return res.status(404).json({ message: 'Indicio no encontrado' });
        }
        res.status(200).json(indicio);
    } catch (error) {
        console.error('Error al obtener indicio:', error);
        res.status(500).json({ message: 'Error al obtener indicio' });
    }
};

// POST /indicios
export const createIndicioHandler = async (req: Request, res: Response) => {
    try {
        const { expediente_id, descripcion, color, tamano, peso, ubicacion, tecnico_id } = req.body;
        const pool = await getConnection();
        await pool.request()
            .input('expediente_id', expediente_id)
            .input('descripcion', descripcion ?? null)
            .input('color', color ?? null)
            .input('tamano', tamano ?? null)
            .input('peso', peso ?? null)
            .input('ubicacion', ubicacion ?? null)
            .input('tecnico_id', tecnico_id)
            .execute('SP_INSERT_Indicio');
        res.status(201).json({ message: 'Indicio creado exitosamente' });
    } catch (error: any) {
        const errorMsg = error?.message || 'Error desconocido';
        console.error('Error al crear indicio:', errorMsg);
        res.status(500).json({ message: errorMsg });
    }
};

// PUT /indicios/:id
export const updateIndicioByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { descripcion, color, tamano, peso, ubicacion } = req.body;
        const pool = await getConnection();
        await pool.request()
            .input('id', Number(id))
            .input('descripcion', descripcion ?? null)
            .input('color', color ?? null)
            .input('tamano', tamano ?? null)
            .input('peso', peso ?? null)
            .input('ubicacion', ubicacion ?? null)
            .execute('SP_UPDATE_IndicioById');
        res.status(200).json({ message: 'Indicio actualizado exitosamente' });
    } catch (error: any) {
        const errorMsg = error?.message || 'Error desconocido';
        console.error('Error al actualizar indicio:', errorMsg);
        res.status(500).json({ message: errorMsg });
    }
};

// PUT /indicios/:id/activo (desactivar/activar indicio)
export const updateIndicioActivoByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const pool = await getConnection();
        // Consultar estado actual
        const result = await pool.request()
            .input('id', Number(id))
            .execute('SP_GET_IndicioById');
        const indicio = result.recordset[0];
        if (!indicio) {
            return res.status(404).json({ message: 'Indicio no encontrado' });
        }
        const estabaActivo = indicio.activo === 1;
        await pool.request()
            .input('id', Number(id))
            .execute('SP_Update_IndicioActivoById');
        const mensaje = estabaActivo
            ? 'Indicio desactivado exitosamente'
            : 'Indicio activado exitosamente';
        res.status(200).json({ message: mensaje });
    } catch (error: any) {
        const errorMsg = error?.message || 'Error desconocido';
        console.error('Error al cambiar estado de indicio:', errorMsg);
        res.status(500).json({ message: errorMsg });
    }
};

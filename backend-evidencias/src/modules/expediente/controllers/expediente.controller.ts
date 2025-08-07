import { Request, Response } from 'express';
import { getConnection } from '../../../db';

// GET /expedientes
export const getExpedientesHandler = async (_req: Request, res: Response) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('SP_GET_Expedientes');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener expedientes:', error);
        res.status(500).json({ message: 'Error al obtener expedientes' });
    }
};

// GET /expedientes/:id
export const getExpedienteByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', Number(id))
            .execute('SP_GET_ExpedienteById');
        const expediente = result.recordset[ 0 ];
        if (!expediente) {
            return res.status(404).json({ message: 'Expediente no encontrado' });
        }
        res.status(200).json(expediente);
    } catch (error) {
        console.error('Error al obtener expediente:', error);
        res.status(500).json({ message: 'Error al obtener expediente' });
    }
};

// POST /expedientes
export const createExpedienteHandler = async (req: Request, res: Response) => {
    try {
        const { codigo, descripcion, tecnico_id, justificacion } = req.body;
        const pool = await getConnection();
        await pool.request()
            .input('codigo', codigo)
            .input('descripcion', descripcion)
            .input('tecnico_id', tecnico_id)
            .input('justificacion', justificacion || null)
            .execute('SP_INSERT_Expediente');
        res.status(201).json({ message: 'Expediente creado exitosamente' });
    } catch (error: any) {
        const errorMsg = error?.message || 'Error desconocido';
        console.error('Error al crear expediente:', errorMsg);
        res.status(500).json({ message: errorMsg });
    }
};

// PUT /expedientes/:id
export const updateExpedienteByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { descripcion, estado, justificacion, tecnico_id } = req.body;
        const pool = await getConnection();
        await pool.request()
            .input('id', Number(id))
            .input('descripcion', descripcion)
            .input('estado', estado)
            .input('justificacion', justificacion)
            .input('tecnico_id', tecnico_id)
            .execute('SP_UPDATE_ExpedienteById');
        res.status(200).json({ message: 'Expediente actualizado exitosamente' });
    } catch (error: any) {
        const errorMsg = error?.message || 'Error desconocido';
        console.error('Error al actualizar expediente:', errorMsg);
        res.status(500).json({ message: errorMsg });
    }
};

// PUT /expedientes/:id (desactivar expediente)
export const updateExpedienteActivoByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const pool = await getConnection();
        // Consultar estado actual
        const result = await pool.request()
            .input('id', Number(id))
            .execute('SP_GET_ExpedienteById');
        const expediente = result.recordset[ 0 ];
        if (!expediente) {
            return res.status(404).json({ message: 'Expediente no encontrado' });
        }
        const estabaActivo = expediente.activo === 1;
        await pool.request()
            .input('id', Number(id))
            .execute('SP_UPDATE_ExpedienteActivoById');
        const mensaje = estabaActivo
            ? 'Expediente desactivado exitosamente'
            : 'Expediente activado exitosamente';
        res.status(200).json({ message: mensaje });
    } catch (error: any) {
        const errorMsg = error?.message || 'Error desconocido';
        console.error('Error al cambiar estado de expediente:', errorMsg);
        res.status(500).json({ message: errorMsg });
    }
};

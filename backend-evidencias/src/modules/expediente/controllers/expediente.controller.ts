import { Request, Response } from 'express';

import * as expedienteModel from '../models/expediente.model';

// GET /expedientes
export const getExpedientesHandler = async (_req: Request, res: Response) => {
    try {
        const expedientes = await expedienteModel.getAllExpedientes();
        res.status(200).json(expedientes);
    } catch (error) {
        console.error('Error al obtener expedientes:', error);
        res.status(500).json({ message: 'Error al obtener expedientes' });
    }
};

// GET /expedientes/:id
export const getExpedienteByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const expediente = await expedienteModel.getExpedienteById(Number(id));
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
        await expedienteModel.insertExpediente({
            codigo,
            descripcion,
            tecnico_id,
            justificacion
        });
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
        await expedienteModel.updateExpedienteById({
            id: Number(id),
            descripcion,
            estado,
            justificacion,
            tecnico_id
        });
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
        const expediente = await expedienteModel.getExpedienteById(Number(id));
        if (!expediente) {
            return res.status(404).json({ message: 'Expediente no encontrado' });
        }
        const estabaActivo = expediente.activo === true;
        await expedienteModel.updateExpedienteActivoById(Number(id));
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

import { Request, Response } from 'express';

import * as indicioModel from '../models/indicio.model';

// GET /indicios
export const getIndiciosHandler = async (_req: Request, res: Response) => {
    try {
        const indicios = await indicioModel.getAllIndicios();
        res.status(200).json(indicios);
    } catch (error) {
        console.error('Error al obtener indicios:', error);
        res.status(500).json({ message: 'Error al obtener indicios' });
    }
};

// GET /indicios/:id
export const getIndicioByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const indicio = await indicioModel.getIndicioById(Number(id));
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

        // Validación de tipos y presencia
        if (
            !expediente_id || isNaN(Number(expediente_id)) ||
            !tecnico_id || isNaN(Number(tecnico_id))
        ) {
            return res.status(400).json({ message: 'expediente_id y tecnico_id deben ser números válidos.' });
        }

        await indicioModel.insertIndicio({
            expediente_id: Number(expediente_id),
            descripcion,
            color,
            tamano,
            peso: peso !== undefined && peso !== null ? Number(peso) : undefined,
            ubicacion,
            tecnico_id: Number(tecnico_id)
        });
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
        await indicioModel.updateIndicioById({
            id: Number(id),
            descripcion,
            color,
            tamano,
            peso,
            ubicacion
        });
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
        const indicio = await indicioModel.getIndicioById(Number(id));
        if (!indicio) {
            return res.status(404).json({ message: 'Indicio no encontrado' });
        }
        const estabaActivo = indicio.activo === true;
        await indicioModel.updateIndicioActivoById(Number(id));
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

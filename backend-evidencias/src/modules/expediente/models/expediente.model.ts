import { getConnection } from '../../../db';

export interface Expediente {
    id: number;
    codigo: string;
    descripcion: string;
    fecha_registro: Date;
    tecnico_id: number;
    justificacion?: string | null;
    estado: 'pendiente' | 'aprobado' | 'rechazado';
    aprobador_id?: number | null;
    aprobador_username?: string | null;
    fecha_estado?: Date | null;
    activo: boolean;
}

export const getAllExpedientes = async (): Promise<Expediente[]> => {
    const pool = await getConnection();
    const result = await pool.request().execute('SP_GET_Expedientes');
    return result.recordset as Expediente[];
};

export const getExpedienteById = async (id: number): Promise<Expediente | null> => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', id)
        .execute('SP_GET_ExpedienteById');

    return result.recordset[ 0 ] as Expediente || null;
};

export const insertExpediente = async (exp: {
    codigo: string;
    descripcion: string;
    tecnico_id: number;
    justificacion?: string;
    estado?: 'pendiente' | 'aprobado' | 'rechazado';
    aprobador_id?: number;
    fecha_estado?: Date;
    activo?: boolean;
}): Promise<void> => {
    const pool = await getConnection();
    await pool.request()
        .input('codigo', exp.codigo)
        .input('descripcion', exp.descripcion)
        .input('tecnico_id', exp.tecnico_id)
        .input('justificacion', exp.justificacion || null)
        .input('estado', exp.estado || 'pendiente')
        .input('aprobador_id', exp.aprobador_id || null)
        .input('fecha_estado', exp.fecha_estado || null)
        .input('activo', exp.activo !== undefined ? exp.activo : true)
        .execute('SP_INSERT_Expediente');
};

export const updateExpedienteById = async (exp: {
    id: number;
    codigo?: string;
    descripcion: string;
    estado: 'pendiente' | 'aprobado' | 'rechazado';
    justificacion: string;
    tecnico_id: number;
    aprobador_id?: number;
    fecha_estado?: Date;
    activo?: boolean;
}): Promise<void> => {
    const pool = await getConnection();
    const req = pool.request()
        .input('id', exp.id)
        .input('codigo', exp.codigo || null)
        .input('descripcion', exp.descripcion)
        .input('estado', exp.estado)
        .input('justificacion', exp.justificacion)
        .input('tecnico_id', exp.tecnico_id)
        .input('aprobador_id', exp.aprobador_id || null)
        .input('fecha_estado', exp.fecha_estado || null)
        .input('activo', exp.activo !== undefined ? exp.activo : true);
    await req.execute('SP_UPDATE_ExpedienteById');
};

export const updateExpedienteActivoById = async (id: number): Promise<void> => {
    const pool = await getConnection();
    await pool.request()
        .input('id', id)
        .execute('SP_UPDATE_ExpedienteActivoById');
};

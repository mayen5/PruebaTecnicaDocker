import { getConnection } from '../../../db';

export interface Indicio {
    id: number;
    expediente_id: number;
    descripcion: string | null;
    color: string | null;
    tamano: string | null;
    peso: number | null;
    ubicacion: string | null;
    tecnico_id: number;
    fecha_registro: Date;
    activo: boolean;
    expediente_codigo: string;
}

export const getAllIndicios = async (): Promise<Indicio[]> => {
    const pool = await getConnection();
    const result = await pool.request().execute('SP_GET_Indicios');
    return result.recordset.map((record) => ({
        ...record,
        expediente_codigo: record.expediente_codigo,
    }));
};

export const getIndicioById = async (id: number): Promise<Indicio | null> => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', id)
        .execute('SP_GET_IndicioById');
    return result.recordset[ 0 ]
        ? {
            ...result.recordset[ 0 ],
            expediente_codigo: result.recordset[ 0 ].expediente_codigo,
        }
        : null;
};

export const insertIndicio = async (ind: {
    expediente_id: number;
    descripcion?: string;
    color?: string;
    tamano?: string;
    peso?: number;
    ubicacion?: string;
    tecnico_id: number;
}): Promise<void> => {
    const pool = await getConnection();
    await pool.request()
        .input('expediente_id', ind.expediente_id)
        .input('descripcion', ind.descripcion ?? null)
        .input('color', ind.color ?? null)
        .input('tamano', ind.tamano ?? null)
        .input('peso', ind.peso ?? null)
        .input('ubicacion', ind.ubicacion ?? null)
        .input('tecnico_id', ind.tecnico_id)
        .execute('SP_INSERT_Indicio');
};

export const updateIndicioById = async (ind: {
    id: number;
    descripcion?: string;
    color?: string;
    tamano?: string;
    peso?: number;
    ubicacion?: string;
}): Promise<void> => {
    const pool = await getConnection();
    await pool.request()
        .input('id', ind.id)
        .input('descripcion', ind.descripcion ?? null)
        .input('color', ind.color ?? null)
        .input('tamano', ind.tamano ?? null)
        .input('peso', ind.peso ?? null)
        .input('ubicacion', ind.ubicacion ?? null)
        .execute('SP_UPDATE_IndicioById');
};

export const updateIndicioActivoById = async (id: number): Promise<void> => {
    const pool = await getConnection();
    await pool.request()
        .input('id', id)
        .execute('SP_Update_IndicioActivoById');
};

export const getIndiciosByExpedienteId = async (expediente_id: number): Promise<Indicio[]> => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('expediente_id', expediente_id)
        .execute('SP_GET_IndiciosByExpedienteId');
    return result.recordset;
};

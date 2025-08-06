import { getConnection } from '../db';
import type { Rol } from '../auth/auth.types';

export interface User {
    id?: number;
    username: string;
    password_hash: string;
    rol: Rol;
    activo?: boolean;
}

// Obtener usuario por username
export const getUserByUsername = async (username: string): Promise<User | null> => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('username', username)
        .execute('SP_GET_UsuarioByUsername');

    const record = result.recordset[ 0 ];
    if (!record) {
        console.log(`Usuario no encontrado: ${username}`);
        return null;
    }

    console.log(`Usuario encontrado: ${JSON.stringify(record.username)}`);

    return {
        id: record.id,
        username: record.username,
        password_hash: record.password_hash,
        rol: record.rol,
        activo: Boolean(record.activo)
    };
};

// Insertar nuevo usuario
export const createUser = async (user: User): Promise<void> => {
    const pool = await getConnection();
    await pool.request()
        .input('username', user.username)
        .input('password_hash', user.password_hash)
        .input('rol', user.rol)
        .execute('SP_INSERT_Usuario');
};

// Actualizar usuario (por username)
export const updateUser = async (user: User): Promise<void> => {
    const pool = await getConnection();
    await pool.request()
        .input('username', user.username)
        .input('password_hash', user.password_hash)
        .input('rol', user.rol)
        .execute('SP_UPDATE_UsuarioByUsername');
};

// Eliminar (desactivar) usuario
export const deleteUser = async (username: string): Promise<void> => {
    const pool = await getConnection();
    await pool.request()
        .input('username', username)
        .execute('SP_UPDATE_UsuarioActivoByUsername');
};

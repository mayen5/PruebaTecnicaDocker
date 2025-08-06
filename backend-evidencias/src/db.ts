import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();


const config: sql.config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '1433', 10),
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

let pool: sql.ConnectionPool | null = null;

export const getConnection = async (): Promise<sql.ConnectionPool> => {
    if (pool) {
        return pool;
    }

    try {
        pool = await sql.connect(config);
        console.log('Conexión a SQL Server establecida correctamente');
        return pool;
    } catch (error) {
        console.error('Error al conectar con SQL Server:', error);
        throw error;
    }
};

export { sql };

import * as sql from 'mssql';

// Database configuration from environment variables
const config: sql.config = {
    server: process.env.DATABASE_SERVER || '',
    database: process.env.DATABASE_NAME || '',
    user: process.env.DATABASE_USER || '',
    password: process.env.DATABASE_PASSWORD || '',
    options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool: sql.ConnectionPool | null = null;

/**
 * Get database connection pool
 * Creates a new pool if one doesn't exist
 */
export async function getPool(): Promise<sql.ConnectionPool> {
    if (!pool) {
        pool = await new sql.ConnectionPool(config).connect();
        console.log('Database pool created');
    }
    return pool;
}

/**
 * Execute a query with parameters
 */
export async function query<T>(
    queryString: string,
    params?: { [key: string]: any }
): Promise<sql.IResult<T>> {
    const poolConnection = await getPool();
    const request = poolConnection.request();

    // Add parameters if provided
    if (params) {
        Object.keys(params).forEach(key => {
            request.input(key, params[key]);
        });
    }

    return await request.query<T>(queryString);
}

/**
 * Close the database connection pool
 */
export async function closePool(): Promise<void> {
    if (pool) {
        await pool.close();
        pool = null;
        console.log('Database pool closed');
    }
}

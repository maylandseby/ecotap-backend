import pkg from 'pg';
import { DATABASE_URL } from './config/config.js';

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: DATABASE_URL,
});

/**
 * Helper function to run database queries against PostgreSQL
 */
export async function query(text: string, params?: unknown[]) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}
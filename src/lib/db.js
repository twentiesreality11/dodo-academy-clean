import { neon } from '@netlify/neon';

// Automatically uses NETLIFY_DATABASE_URL from environment
const sql = neon();

// Your existing helper functions remain the same
export async function query(text, params = []) {
  try {
    const result = await sql.query(text, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getOne(text, params = []) {
  try {
    const result = await sql.query(text, params);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Database getOne error:', error);
    throw error;
  }
}

export async function getAll(text, params = []) {
  try {
    const result = await sql.query(text, params);
    return result.rows;
  } catch (error) {
    console.error('Database getAll error:', error);
    throw error;
  }
}

export async function execute(text, params = []) {
  try {
    const result = await sql.query(text, params);
    return result;
  } catch (error) {
    console.error('Database execute error:', error);
    throw error;
  }
}

export const getDb = () => sql;
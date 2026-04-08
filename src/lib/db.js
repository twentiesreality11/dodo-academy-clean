import { neon } from '@neondatabase/serverless';

// Initialize the Neon connection using the environment variable
const sql = neon(process.env.POSTGRES_URL);

// Helper function to execute queries with parameterized placeholders ($1, $2)
export async function query(text, params = []) {
  try {
    const result = await sql.query(text, params);
    // Neon returns { rows: [], rowCount: 0, command: 'SELECT' }
    return result.rows || [];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Get a single record (first row)
export async function getOne(text, params = []) {
  try {
    const result = await sql.query(text, params);
    // Handle both array and object responses
    if (result && result.rows) {
      return result.rows[0] || null;
    }
    if (Array.isArray(result)) {
      return result[0] || null;
    }
    return null;
  } catch (error) {
    console.error('Database getOne error:', error);
    throw error;
  }
}

// Get all records
export async function getAll(text, params = []) {
  try {
    const result = await sql.query(text, params);
    // Handle both array and object responses
    if (result && result.rows) {
      return result.rows;
    }
    if (Array.isArray(result)) {
      return result;
    }
    return [];
  } catch (error) {
    console.error('Database getAll error:', error);
    throw error;
  }
}

// Execute an operation (insert, update, delete)
export async function execute(text, params = []) {
  try {
    const result = await sql.query(text, params);
    return result;
  } catch (error) {
    console.error('Database execute error:', error);
    throw error;
  }
}

// Get the raw sql client for advanced operations
export function getSql() {
  return sql;
}

// Alias for getSql to maintain compatibility with existing code
export const getDb = getSql;
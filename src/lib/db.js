import { neon } from '@neondatabase/serverless';

// Initialize the Neon connection using the environment variable
const sql = neon(process.env.POSTGRES_URL);

// Helper function to execute queries and return results
export async function query(text, params = []) {
  try {
    const result = await sql(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Get a single record (first row)
export async function getOne(query, params = []) {
  try {
    const result = await sql(query, params);
    return result[0] || null;
  } catch (error) {
    console.error('Database getOne error:', error);
    throw error;
  }
}

// Get all records
export async function getAll(query, params = []) {
  try {
    return await sql(query, params);
  } catch (error) {
    console.error('Database getAll error:', error);
    throw error;
  }
}

// Execute an operation (insert, update, delete) and return result
export async function execute(query, params = []) {
  try {
    return await sql(query, params);
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
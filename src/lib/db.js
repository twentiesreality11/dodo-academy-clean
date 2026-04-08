import { neon } from '@neondatabase/serverless';

// Initialize the Neon connection using the environment variable
const sql = neon(process.env.POSTGRES_URL);

// Helper function to execute queries with tagged template syntax
export async function query(text, params = []) {
  try {
    // Use the tagged template approach for parameterized queries
    if (params && params.length > 0) {
      // Build the query with $1, $2 placeholders
      let queryText = text;
      for (let i = 0; i < params.length; i++) {
        queryText = queryText.replace(`$${i + 1}`, `'${params[i].toString().replace(/'/g, "''")}'`);
      }
      const result = await sql(queryText);
      return result;
    } else {
      const result = await sql(text);
      return result;
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Get a single record (first row)
export async function getOne(queryText, params = []) {
  try {
    let result;
    if (params && params.length > 0) {
      let queryWithParams = queryText;
      for (let i = 0; i < params.length; i++) {
        const value = typeof params[i] === 'string' ? `'${params[i].replace(/'/g, "''")}'` : params[i];
        queryWithParams = queryWithParams.replace(`$${i + 1}`, value);
      }
      result = await sql(queryWithParams);
    } else {
      result = await sql(queryText);
    }
    return result[0] || null;
  } catch (error) {
    console.error('Database getOne error:', error);
    throw error;
  }
}

// Get all records
export async function getAll(queryText, params = []) {
  try {
    if (params && params.length > 0) {
      let queryWithParams = queryText;
      for (let i = 0; i < params.length; i++) {
        const value = typeof params[i] === 'string' ? `'${params[i].replace(/'/g, "''")}'` : params[i];
        queryWithParams = queryWithParams.replace(`$${i + 1}`, value);
      }
      return await sql(queryWithParams);
    } else {
      return await sql(queryText);
    }
  } catch (error) {
    console.error('Database getAll error:', error);
    throw error;
  }
}

// Execute an operation (insert, update, delete)
export async function execute(queryText, params = []) {
  try {
    if (params && params.length > 0) {
      let queryWithParams = queryText;
      for (let i = 0; i < params.length; i++) {
        const value = typeof params[i] === 'string' ? `'${params[i].replace(/'/g, "''")}'` : params[i];
        queryWithParams = queryWithParams.replace(`$${i + 1}`, value);
      }
      return await sql(queryWithParams);
    } else {
      return await sql(queryText);
    }
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
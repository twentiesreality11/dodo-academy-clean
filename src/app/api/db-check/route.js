import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const results = {
    databaseConfigured: !!process.env.POSTGRES_URL,
    tables: {}
  };
  
  if (!process.env.POSTGRES_URL) {
    return NextResponse.json({ error: 'POSTGRES_URL not configured' }, { status: 500 });
  }
  
  try {
    const sql = neon(process.env.POSTGRES_URL);
    
    // Check each table
    const tables = ['users', 'lessons', 'progress', 'payments'];
    for (const table of tables) {
      try {
        const result = await sql`SELECT COUNT(*) FROM ${sql(table)}`;
        results.tables[table] = { exists: true, count: parseInt(result[0].count) };
      } catch (error) {
        results.tables[table] = { exists: false, error: error.message };
      }
    }
    
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
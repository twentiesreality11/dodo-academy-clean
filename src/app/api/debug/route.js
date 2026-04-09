import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const sql = neon(process.env.POSTGRES_URL);
    
    // Test database connection
    const test = await sql`SELECT 1 as connected`;
    
    // Get all lessons
    const lessons = await sql`SELECT id, title FROM lessons`;
    
    // Get environment info
    const env = {
      hasDbUrl: !!process.env.POSTGRES_URL,
      nodeEnv: process.env.NODE_ENV,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    };
    
    return NextResponse.json({
      success: true,
      databaseConnected: test.length > 0,
      lessonCount: lessons.length,
      lessons: lessons,
      environment: env,
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
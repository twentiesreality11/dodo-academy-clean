import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const sessionId = request.cookies.get('session')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Get all assessment questions
    const questions = await sql`
      SELECT id, question, options, correct_answer 
      FROM assessment_questions 
      ORDER BY id
    `;
    
    console.log(`Found ${questions.length} assessment questions`);
    
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Assessment questions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
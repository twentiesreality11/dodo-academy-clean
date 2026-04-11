import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const sessionId = request.cookies.get('session')?.value;
    
    console.log('Fix payment - Session:', sessionId);
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }
    
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({ error: 'No database' }, { status: 500 });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Check if user exists
    const users = await sql`SELECT id FROM users WHERE id = ${sessionId}`;
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Add payment record
    await sql`
      INSERT INTO payments (id, user_id, reference, amount, status, course_type, created_at)
      VALUES (gen_random_uuid(), ${sessionId}, 'FIX-${Date.now()}', 5000000, 'success', 'foundation', NOW())
      ON CONFLICT (user_id, course_type) DO UPDATE SET status = 'success'
    `;
    
    // Add progress for lessons
    const lessons = await sql`SELECT id FROM lessons`;
    for (const lesson of lessons) {
      await sql`
        INSERT INTO progress (user_id, lesson_id, completed) 
        VALUES (${sessionId}, ${lesson.id}, false)
        ON CONFLICT (user_id, lesson_id) DO NOTHING
      `;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fix payment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
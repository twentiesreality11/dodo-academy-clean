import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const sessionId = request.cookies.get('session')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }
    
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({ error: 'No database' }, { status: 500 });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Check if user already has payment
    const existingPayment = await sql`
      SELECT id FROM payments 
      WHERE user_id = ${sessionId} AND status = 'success'
    `;
    
    if (existingPayment.length > 0) {
      return NextResponse.json({ message: 'Payment already exists', hasPaid: true });
    }
    
    // Create a manual payment record
    await sql`
      INSERT INTO payments (id, user_id, reference, amount, status, course_type, created_at)
      VALUES (gen_random_uuid(), ${sessionId}, 'MANUAL-FIX-${Date.now()}', 5000000, 'success', 'foundation', NOW())
    `;
    
    // Initialize progress
    const lessons = await sql`SELECT id FROM lessons`;
    for (const lesson of lessons) {
      await sql`
        INSERT INTO progress (user_id, lesson_id, completed) 
        VALUES (${sessionId}, ${lesson.id}, false)
        ON CONFLICT (user_id, lesson_id) DO NOTHING
      `;
    }
    
    return NextResponse.json({ success: true, hasPaid: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
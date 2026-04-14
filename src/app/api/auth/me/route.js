import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const sessionId = request.cookies.get('session')?.value;
    
    console.log('Me API - Session:', sessionId);
    
    if (!sessionId) {
      return NextResponse.json({ user: null });
    }
    
    if (!process.env.POSTGRES_URL) {
      // For testing without database
      return NextResponse.json({ user: { id: sessionId, name: 'Test User', email: 'test@example.com' } });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    const users = await sql`
      SELECT id, name, email FROM users WHERE id = ${sessionId}
    `;
    
    if (!users || users.length === 0) {
      return NextResponse.json({ user: null });
    }
    
    return NextResponse.json({ user: users[0] });
    
  } catch (error) {
    console.error('Me API error:', error);
    return NextResponse.json({ user: null });
  }
}
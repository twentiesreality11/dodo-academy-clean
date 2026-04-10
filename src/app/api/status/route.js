import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    // Get session from cookie
    const sessionId = request.cookies.get('session')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ hasPaid: false });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Check if user has a successful payment
    const payments = await sql`
      SELECT status FROM payments 
      WHERE user_id = ${sessionId} 
        AND course_type = 'foundation' 
        AND status = 'success'
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    const hasPaid = payments && payments.length > 0;
    
    return NextResponse.json({ hasPaid });
  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json({ hasPaid: false });
  }
}
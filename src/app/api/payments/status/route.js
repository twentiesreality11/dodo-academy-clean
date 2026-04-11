import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const sessionId = request.cookies.get('session')?.value;
    
    console.log('=== PAYMENT STATUS CHECK ===');
    console.log('Session ID:', sessionId);
    
    if (!sessionId) {
      console.log('No session, returning hasPaid: false');
      return NextResponse.json({ hasPaid: false });
    }
    
    if (!process.env.POSTGRES_URL) {
      console.log('No database URL');
      return NextResponse.json({ hasPaid: false });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Check for successful payment
    const payments = await sql`
      SELECT id, status, reference, created_at 
      FROM payments 
      WHERE user_id = ${sessionId} 
        AND course_type = 'foundation' 
        AND status = 'success'
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    const hasPaid = payments && payments.length > 0;
    console.log('Payment status result:', hasPaid);
    
    if (hasPaid) {
      console.log('Found payment:', payments[0].reference);
    }
    
    return NextResponse.json({ hasPaid });
  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json({ hasPaid: false });
  }
}
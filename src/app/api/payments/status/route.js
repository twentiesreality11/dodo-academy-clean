import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const sessionId = request.cookies.get('session')?.value;
    
    console.log('Payment status check - Session:', sessionId);
    
    if (!sessionId) {
      return NextResponse.json({ hasPaid: false });
    }
    
    if (!process.env.POSTGRES_URL) {
      console.log('No database URL');
      return NextResponse.json({ hasPaid: false });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Check for successful payment
    const result = await sql`
      SELECT EXISTS (
        SELECT 1 FROM payments 
        WHERE user_id = ${sessionId} 
          AND course_type = 'foundation' 
          AND status = 'success'
      ) as has_paid
    `;
    
    const hasPaid = result[0]?.has_paid || false;
    console.log('Payment status:', hasPaid);
    
    return NextResponse.json({ hasPaid });
  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json({ hasPaid: false });
  }
}
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get('reference');
  
  if (!reference) {
    return NextResponse.redirect(new URL('/foundation/cancel', request.url));
  }
  
  try {
    // Use native fetch instead of axios
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });
    
    const data = await response.json();
    const sql = neon(process.env.POSTGRES_URL);
    
    if (data.data.status === 'success') {
      const paymentRecord = await sql`
        SELECT user_id FROM payments WHERE reference = ${reference}
      `;
      
      if (paymentRecord && paymentRecord.length > 0) {
        await sql`
          UPDATE payments 
          SET status = 'success' 
          WHERE reference = ${reference}
        `;
        
        const lessons = await sql`SELECT id FROM lessons`;
        for (const lesson of lessons) {
          await sql`
            INSERT INTO progress (user_id, lesson_id, completed) 
            VALUES (${paymentRecord[0].user_id}, ${lesson.id}, false)
            ON CONFLICT (user_id, lesson_id) DO NOTHING
          `;
        }
      }
      
      return NextResponse.redirect(new URL('/foundation/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/foundation/cancel', request.url));
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.redirect(new URL('/foundation/cancel', request.url));
  }
}
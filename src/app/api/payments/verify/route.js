import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get('reference');
  
  console.log('Payment verification callback received:', { reference });
  
  if (!reference) {
    console.log('No reference provided, redirecting to cancel');
    return NextResponse.redirect(new URL('/foundation/cancel', request.url));
  }
  
  try {
    // Verify with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });
    
    const data = await response.json();
    console.log('Paystack verification response:', data.status);
    
    if (!process.env.POSTGRES_URL) {
      console.log('No database, redirecting to dashboard');
      return NextResponse.redirect(new URL('/foundation/dashboard', request.url));
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    if (data.data.status === 'success') {
      // Get payment record
      const paymentRecord = await sql`
        SELECT user_id FROM payments WHERE reference = ${reference}
      `;
      
      if (paymentRecord && paymentRecord.length > 0) {
        // Update payment status
        await sql`
          UPDATE payments 
          SET status = 'success' 
          WHERE reference = ${reference}
        `;
        
        // Initialize progress for lessons
        const lessons = await sql`SELECT id FROM lessons`;
        for (const lesson of lessons) {
          await sql`
            INSERT INTO progress (user_id, lesson_id, completed) 
            VALUES (${paymentRecord[0].user_id}, ${lesson.id}, false)
            ON CONFLICT (user_id, lesson_id) DO NOTHING
          `;
        }
        
        console.log('Payment successful, redirecting to dashboard');
        return NextResponse.redirect(new URL('/foundation/dashboard', request.url));
      } else {
        console.log('Payment record not found for reference:', reference);
      }
    } else {
      console.log('Payment verification failed:', data.data.status);
    }
    
    return NextResponse.redirect(new URL('/foundation/cancel', request.url));
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.redirect(new URL('/foundation/cancel', request.url));
  }
}
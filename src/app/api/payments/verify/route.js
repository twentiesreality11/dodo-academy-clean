import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get('reference');
  
  console.log('=== PAYMENT VERIFICATION STARTED ===');
  console.log('Reference:', reference);
  
  if (!reference) {
    console.log('No reference provided');
    return NextResponse.redirect(new URL('/foundation/cancel', request.url));
  }
  
  try {
    // 1. Verify with Paystack
    console.log('Verifying with Paystack...');
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });
    
    const paystackData = await paystackRes.json();
    console.log('Paystack response:', paystackData.status, paystackData.data?.status);
    
    if (!paystackData.status || paystackData.data?.status !== 'success') {
      console.log('Payment verification failed');
      return NextResponse.redirect(new URL('/foundation/cancel', request.url));
    }
    
    // 2. Update database
    if (!process.env.POSTGRES_URL) {
      console.log('No database, but payment successful');
      return NextResponse.redirect(new URL('/foundation/dashboard', request.url));
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Find the payment record
    let paymentRecord;
    try {
      paymentRecord = await sql`
        SELECT id, user_id, status 
        FROM payments 
        WHERE reference = ${reference}
      `;
      console.log('Payment record found:', paymentRecord?.length > 0);
    } catch (dbError) {
      console.log('Error finding payment:', dbError.message);
    }
    
    if (paymentRecord && paymentRecord.length > 0) {
      // Update payment status to success
      await sql`
        UPDATE payments 
        SET status = 'success' 
        WHERE reference = ${reference}
      `;
      console.log('Payment status updated to success');
      
      const userId = paymentRecord[0].user_id;
      
      // Initialize progress for lessons
      try {
        const lessons = await sql`SELECT id FROM lessons`;
        console.log(`Found ${lessons.length} lessons`);
        
        for (const lesson of lessons) {
          await sql`
            INSERT INTO progress (user_id, lesson_id, completed) 
            VALUES (${userId}, ${lesson.id}, false)
            ON CONFLICT (user_id, lesson_id) DO NOTHING
          `;
        }
        console.log('Progress initialized for user');
      } catch (progressError) {
        console.log('Progress init error:', progressError.message);
      }
    } else {
      console.log('No payment record found, creating one...');
      // Create payment record if it doesn't exist
      const transaction = paystackData.data;
      const userId = request.cookies.get('session')?.value;
      
      if (userId) {
        await sql`
          INSERT INTO payments (id, user_id, reference, amount, status, course_type, created_at)
          VALUES (${crypto.randomUUID()}, ${userId}, ${reference}, ${transaction.amount}, 'success', 'foundation', ${new Date().toISOString()})
        `;
        console.log('Payment record created');
      }
    }
    
    console.log('Payment verified, redirecting to dashboard');
    return NextResponse.redirect(new URL('/foundation/dashboard', request.url));
    
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.redirect(new URL('/foundation/cancel', request.url));
  }
}
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get('reference');
  
  console.log('=== PAYMENT VERIFICATION CALLED ===');
  console.log('Reference:', reference);
  
  if (!reference) {
    console.log('No reference provided');
    return NextResponse.json(
      { success: false, error: 'No payment reference provided' },
      { status: 400 }
    );
  }
  
  try {
    // Verify with Paystack API
    console.log('Verifying with Paystack...');
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });
    
    const data = await response.json();
    console.log('Paystack response status:', data.status);
    console.log('Transaction status:', data.data?.status);
    
    if (!data.status || data.data.status !== 'success') {
      console.log('Payment verification failed:', data);
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }
    
    const transaction = data.data;
    
    // Check if database is configured
    if (!process.env.POSTGRES_URL) {
      console.log('No database configured, skipping database update');
      return NextResponse.json({ 
        success: true, 
        message: 'Payment verified but no database update',
        transaction 
      });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Find the payment record
    const paymentRecord = await sql`
      SELECT id, user_id, status FROM payments WHERE reference = ${reference}
    `;
    
    console.log('Payment record found:', paymentRecord?.length > 0);
    
    if (paymentRecord && paymentRecord.length > 0) {
      // Update payment status
      await sql`
        UPDATE payments 
        SET status = 'success' 
        WHERE reference = ${reference}
      `;
      console.log('Payment status updated to success');
      
      // Initialize progress for lessons if not already done
      const lessons = await sql`SELECT id FROM lessons`;
      for (const lesson of lessons) {
        await sql`
          INSERT INTO progress (user_id, lesson_id, completed) 
          VALUES (${paymentRecord[0].user_id}, ${lesson.id}, false)
          ON CONFLICT (user_id, lesson_id) DO NOTHING
        `;
      }
      console.log('Progress initialized for user');
    } else {
      console.log('No payment record found for reference:', reference);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Payment verified successfully',
      transaction 
    });
    
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
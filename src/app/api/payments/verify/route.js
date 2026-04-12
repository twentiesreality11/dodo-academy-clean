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
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });
    
    const paystackData = await paystackRes.json();
    console.log('Paystack verification result:', paystackData.status);
    
    if (!paystackData.status || paystackData.data?.status !== 'success') {
      console.log('Payment verification failed');
      return NextResponse.redirect(new URL('/foundation/cancel', request.url));
    }
    
    // 2. Get user from session
    const cookieStore = cookies();
    let userId = cookieStore.get('session')?.value;
    console.log('User ID from session:', userId);
    
    if (!userId) {
      console.log('No user session found');
      return NextResponse.redirect(new URL('/login?redirect=/foundation/dashboard', request.url));
    }
    
    // 3. Ensure database connection
    if (!process.env.POSTGRES_URL) {
      console.error('No database URL configured');
      return NextResponse.redirect(new URL('/foundation/dashboard?error=db', request.url));
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // 4. Save or update payment record
    const amount = paystackData.data.amount;
    const transactionRef = reference;
    
    // First, check if payment already exists
    const existingPayment = await sql`
      SELECT id, status FROM payments WHERE reference = ${transactionRef}
    `;
    
    if (existingPayment.length === 0) {
      // Create new payment record
      await sql`
        INSERT INTO payments (id, user_id, reference, amount, status, course_type, created_at)
        VALUES (gen_random_uuid(), ${userId}, ${transactionRef}, ${amount}, 'success', 'foundation', NOW())
      `;
      console.log('New payment record created');
    } else if (existingPayment[0].status !== 'success') {
      // Update existing payment
      await sql`
        UPDATE payments 
        SET status = 'success', user_id = ${userId}
        WHERE reference = ${transactionRef}
      `;
      console.log('Payment record updated to success');
    }
    
    // 5. Ensure progress exists for user
    const lessons = await sql`SELECT id FROM lessons`;
    console.log(`Found ${lessons.length} lessons`);
    
    for (const lesson of lessons) {
      await sql`
        INSERT INTO progress (user_id, lesson_id, completed) 
        VALUES (${userId}, ${lesson.id}, false)
        ON CONFLICT (user_id, lesson_id) DO NOTHING
      `;
    }
    console.log('User progress initialized');
    
    // 6. Verify payment was saved
    const verifyPayment = await sql`
      SELECT status FROM payments 
      WHERE user_id = ${userId} AND course_type = 'foundation' AND status = 'success'
      LIMIT 1
    `;
    
    if (verifyPayment.length === 0) {
      console.error('Payment record not found after insert!');
    } else {
      console.log('Payment confirmed in database');
    }
    
    // 7. Redirect to dashboard with success flag
    const response = NextResponse.redirect(new URL('/foundation/dashboard?payment=success', request.url));
    
    // Refresh session cookie
    response.cookies.set('session', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    
    console.log('Redirecting to dashboard with payment=success');
    return response;
    
  } catch (error) {
    console.error('Payment verification error:', error);
    // Still redirect to dashboard but with error param
    return NextResponse.redirect(new URL('/foundation/dashboard?payment=error', request.url));
  }
}
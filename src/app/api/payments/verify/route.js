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
    console.log('No reference, redirecting to cancel');
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
    console.log('Paystack response status:', paystackData.status);
    console.log('Transaction status:', paystackData.data?.status);
    
    if (!paystackData.status || paystackData.data?.status !== 'success') {
      console.log('Payment verification failed');
      return NextResponse.redirect(new URL('/foundation/cancel', request.url));
    }
    
    // 2. Get user from cookie
    const cookieStore = cookies();
    let userId = cookieStore.get('session')?.value;
    console.log('Session userId:', userId);
    
    if (!userId) {
      console.log('No session found, redirecting to login');
      return NextResponse.redirect(new URL('/login?redirect=/foundation/dashboard', request.url));
    }
    
    if (!process.env.POSTGRES_URL) {
      console.log('No database URL, but payment successful');
      return NextResponse.redirect(new URL('/foundation/dashboard?paid=true', request.url));
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // 3. Create or update payment record
    console.log('Creating/updating payment record...');
    await sql`
      INSERT INTO payments (id, user_id, reference, amount, status, course_type, created_at)
      VALUES (gen_random_uuid(), ${userId}, ${reference}, ${paystackData.data.amount}, 'success', 'foundation', NOW())
      ON CONFLICT (reference) DO UPDATE 
      SET status = 'success', user_id = ${userId}
    `;
    console.log('Payment record saved');
    
    // 4. Initialize progress for lessons
    console.log('Initializing progress...');
    const lessons = await sql`SELECT id FROM lessons`;
    for (const lesson of lessons) {
      await sql`
        INSERT INTO progress (user_id, lesson_id, completed) 
        VALUES (${userId}, ${lesson.id}, false)
        ON CONFLICT (user_id, lesson_id) DO NOTHING
      `;
    }
    console.log('Progress initialized');
    
    // 5. Redirect to dashboard
    console.log('Payment successful, redirecting to dashboard');
    const response = NextResponse.redirect(new URL('/foundation/dashboard', request.url));
    
    // Refresh session cookie
    response.cookies.set('session', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    
    return response;
    
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.redirect(new URL('/foundation/cancel', request.url));
  }
}
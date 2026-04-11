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
    console.log('Paystack verification:', paystackData.status, paystackData.data?.status);
    
    if (!paystackData.status || paystackData.data?.status !== 'success') {
      console.log('Payment verification failed');
      return NextResponse.redirect(new URL('/foundation/cancel', request.url));
    }
    
    // 2. Get user from payment record or session
    const cookieStore = cookies();
    const sessionId = cookieStore.get('session')?.value;
    
    console.log('Session ID from cookie:', sessionId);
    
    if (!process.env.POSTGRES_URL) {
      console.log('No database, but payment successful');
      // Still redirect to dashboard, but user won't have access
      const response = NextResponse.redirect(new URL('/foundation/dashboard', request.url));
      return response;
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Find or create payment record
    let paymentRecord = await sql`
      SELECT id, user_id, status 
      FROM payments 
      WHERE reference = ${reference}
    `;
    
    let userId = sessionId;
    
    if (paymentRecord && paymentRecord.length > 0) {
      userId = paymentRecord[0].user_id;
      console.log('Found existing payment record for user:', userId);
      
      // Update payment status
      await sql`
        UPDATE payments 
        SET status = 'success' 
        WHERE reference = ${reference}
      `;
      console.log('Payment status updated to success');
    } else if (sessionId) {
      // Create payment record
      console.log('Creating new payment record for user:', sessionId);
      await sql`
        INSERT INTO payments (id, user_id, reference, amount, status, course_type, created_at)
        VALUES (gen_random_uuid(), ${sessionId}, ${reference}, ${paystackData.data.amount}, 'success', 'foundation', NOW())
      `;
      userId = sessionId;
    } else {
      console.log('No user session found');
      return NextResponse.redirect(new URL('/login?redirect=/foundation/dashboard', request.url));
    }
    
    // 3. Initialize user progress if not exists
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
    
    console.log('Payment verified, redirecting to dashboard');
    
    // Create response with refreshed session
    const response = NextResponse.redirect(new URL('/foundation/dashboard', request.url));
    
    // Ensure session cookie is set
    if (sessionId) {
      response.cookies.set('session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    
    return response;
    
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.redirect(new URL('/foundation/cancel', request.url));
  }
}
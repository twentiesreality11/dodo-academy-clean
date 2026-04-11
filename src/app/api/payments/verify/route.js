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
    console.log('Paystack response:', JSON.stringify(paystackData, null, 2));
    
    if (!paystackData.status || paystackData.data?.status !== 'success') {
      console.log('Payment verification failed');
      return NextResponse.redirect(new URL('/foundation/cancel', request.url));
    }
    
    // 2. Get user from cookie
    const cookieStore = cookies();
    let sessionId = cookieStore.get('session')?.value;
    console.log('Session ID from cookie:', sessionId);
    
    if (!sessionId) {
      console.log('No session cookie found');
      return NextResponse.redirect(new URL('/login?redirect=/foundation/dashboard', request.url));
    }
    
    if (!process.env.POSTGRES_URL) {
      console.log('No database URL');
      return NextResponse.redirect(new URL('/foundation/dashboard', request.url));
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // 3. Check if payment already recorded
    const existingPayment = await sql`
      SELECT id, status FROM payments WHERE reference = ${reference}
    `;
    
    if (existingPayment && existingPayment.length > 0) {
      console.log('Payment already exists, status:', existingPayment[0].status);
      
      if (existingPayment[0].status === 'success') {
        // Already successful, just redirect
        return NextResponse.redirect(new URL('/foundation/dashboard', request.url));
      }
      
      // Update existing payment
      await sql`
        UPDATE payments 
        SET status = 'success' 
        WHERE reference = ${reference}
      `;
      console.log('Updated existing payment to success');
    } else {
      // Create new payment record
      console.log('Creating new payment record for user:', sessionId);
      await sql`
        INSERT INTO payments (id, user_id, reference, amount, status, course_type, created_at)
        VALUES (gen_random_uuid(), ${sessionId}, ${reference}, ${paystackData.data.amount}, 'success', 'foundation', NOW())
      `;
      console.log('Created new payment record');
    }
    
    // 4. Initialize progress for lessons
    try {
      const lessons = await sql`SELECT id FROM lessons`;
      console.log(`Found ${lessons.length} lessons`);
      
      for (const lesson of lessons) {
        await sql`
          INSERT INTO progress (user_id, lesson_id, completed) 
          VALUES (${sessionId}, ${lesson.id}, false)
          ON CONFLICT (user_id, lesson_id) DO NOTHING
        `;
      }
      console.log('Progress initialized');
    } catch (progressError) {
      console.log('Progress init error (non-critical):', progressError.message);
    }
    
    console.log('Payment verified successfully, redirecting to dashboard');
    
    // 5. Redirect to dashboard with a cache-busting parameter
    const response = NextResponse.redirect(new URL('/foundation/dashboard?paid=true&t=' + Date.now(), request.url));
    
    // Refresh the session cookie
    response.cookies.set('session', sessionId, {
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
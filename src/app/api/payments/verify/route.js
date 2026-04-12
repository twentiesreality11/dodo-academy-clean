import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get('reference');
  
  console.log('=== PAYMENT VERIFICATION ===');
  console.log('Reference:', reference);
  
  if (!reference) {
    return NextResponse.redirect(new URL('/foundation/cancel', request.url));
  }
  
  try {
    // Verify with Paystack
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { 'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    
    const paystackData = await paystackRes.json();
    console.log('Paystack verification:', paystackData.status);
    
    if (!paystackData.status || paystackData.data?.status !== 'success') {
      return NextResponse.redirect(new URL('/foundation/cancel', request.url));
    }
    
    // Get user from cookie
    const cookieStore = cookies();
    let userId = cookieStore.get('session')?.value;
    
    if (!userId) {
      return NextResponse.redirect(new URL('/login?redirect=/foundation/dashboard', request.url));
    }
    
    if (!process.env.POSTGRES_URL) {
      return NextResponse.redirect(new URL('/foundation/dashboard?paid=true', request.url));
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Save payment record
    await sql`
      INSERT INTO payments (id, user_id, reference, amount, status, course_type, created_at)
      VALUES (${uuidv4()}, ${userId}, ${reference}, ${paystackData.data.amount}, 'success', 'foundation', NOW())
      ON CONFLICT (reference) DO UPDATE 
      SET status = 'success', user_id = ${userId}
    `;
    
    // Initialize progress
    const lessons = await sql`SELECT id FROM lessons`;
    for (const lesson of lessons) {
      await sql`
        INSERT INTO progress (user_id, lesson_id, completed) 
        VALUES (${userId}, ${lesson.id}, false)
        ON CONFLICT (user_id, lesson_id) DO NOTHING
      `;
    }
    
    const response = NextResponse.redirect(new URL('/foundation/dashboard?payment=success', request.url));
    response.cookies.set('session', userId, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    
    return response;
    
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect(new URL('/foundation/cancel', request.url));
  }
}
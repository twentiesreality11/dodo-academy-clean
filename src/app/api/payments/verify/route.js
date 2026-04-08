import { getOne, execute, getAll } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

// Force dynamic rendering and Node.js runtime
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('reference');
    
    console.log('Callback received with reference:', reference); // Debug log
    
    if (!reference) {
      console.error('No reference provided');
      return NextResponse.redirect(new URL('/foundation/cancel', request.url));
    }
    
    // Verify with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    
    console.log('Paystack verification response:', response.data.status); // Debug log
    
    const data = response.data.data;
    
    if (data.status === 'success') {
      // Update payment status
      await execute(
        'UPDATE payments SET status = $1 WHERE reference = $2',
        ['success', reference]
      );
      
      // Get user_id from payment
      const payment = await getOne(
        'SELECT user_id FROM payments WHERE reference = $1',
        [reference]
      );
      
      if (payment) {
        // Initialize progress for all lessons
        const lessons = await getAll('SELECT id FROM lessons');
        for (const lesson of lessons) {
          await execute(
            `INSERT INTO progress (user_id, lesson_id, completed) 
             VALUES ($1, $2, false)
             ON CONFLICT (user_id, lesson_id) DO NOTHING`,
            [payment.user_id, lesson.id]
          );
        }
      }
      
      console.log('Payment verified, redirecting to dashboard'); // Debug log
      return NextResponse.redirect(new URL('/foundation/dashboard', request.url));
    } else {
      console.error('Payment verification failed:', data.status);
      return NextResponse.redirect(new URL('/foundation/cancel', request.url));
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    // Return a proper error response instead of letting Vercel mask it
    return NextResponse.redirect(new URL('/foundation/cancel?error=verification_failed', request.url));
  }
}
import { getOne, execute, getAll } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get('reference');
  
  if (!reference) {
    return NextResponse.redirect(new URL('/foundation/cancel', request.url));
  }
  
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    
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
      
      return NextResponse.redirect(new URL('/foundation/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/foundation/cancel', request.url));
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.redirect(new URL('/foundation/cancel', request.url));
  }
}
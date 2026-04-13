import { NextResponse } from 'next/server';
import { updatePaymentStatus, getLessons, markLessonComplete } from '@/lib/db';
import axios from 'axios';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get('reference');
  
  if (!reference) {
    return NextResponse.redirect(new URL('/foundation/checkout', request.url));
  }
  
  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    
    if (response.data.data.status === 'success') {
      const payment = await updatePaymentStatus(reference, 'success');
      return NextResponse.redirect(new URL('/foundation/dashboard?payment=success', request.url));
    } else {
      return NextResponse.redirect(new URL('/foundation/checkout?payment=failed', request.url));
    }
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect(new URL('/foundation/checkout?payment=error', request.url));
  }
}
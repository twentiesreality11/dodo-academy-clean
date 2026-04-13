import { NextResponse } from 'next/server';
import { getUserById, createPayment } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export async function POST(request) {
  try {
    const sessionId = request.cookies.get('session')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Please login first' }, { status: 401 });
    }
    
    const user = await getUserById(sessionId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }
    
    const reference = `DODO-${uuidv4()}`;
    const amount = 5000000; // ₦50,000 in kobo
    
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      email: user.email,
      amount: amount,
      reference: reference,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify`,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.data.status) {
      await createPayment(sessionId, reference, amount);
      return NextResponse.json({ authorization_url: response.data.data.authorization_url });
    } else {
      return NextResponse.json({ error: 'Payment initiation failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
  }
}
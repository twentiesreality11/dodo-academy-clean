import { requireAuth } from '@/lib/auth';
import { execute } from '@/lib/db';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export async function POST() {
  try {
    const user = await requireAuth();
    
    const reference = `DODO-${uuidv4()}`;
    const amount = 5000000; // ₦50,000 in kobo (50,000 × 100)
    
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: user.email,
        amount: amount,
        reference: reference,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (response.data.status) {
      await execute(
        `INSERT INTO payments (id, user_id, reference, amount, status, course_type) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [uuidv4(), user.id, reference, amount, 'pending', 'foundation']
      );
      
      return NextResponse.json({ 
        authorization_url: response.data.data.authorization_url 
      });
    } else {
      return NextResponse.json(
        { error: 'Payment initiation failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: 'Payment initialization failed' },
      { status: 500 }
    );
  }
}
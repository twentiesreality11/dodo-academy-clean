import { requireAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export async function POST(request) {
  try {
    const user = await requireAuth();
    const db = await getDb();
    
    const reference = `DODO-${uuidv4()}`;
    const amount = 50000; // ₦50,000 in kobo
    
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
      // Store pending payment
      await db.run(
        `INSERT INTO payments (id, user_id, reference, amount, status, course_type) 
         VALUES (?, ?, ?, ?, ?, ?)`,
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
    console.error('Paystack error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Payment initialization failed' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    // Get session from cookie
    const sessionId = request.cookies.get('session')?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Please login first' },
        { status: 401 }
      );
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Get user
    const users = await sql`
      SELECT id, email FROM users WHERE id = ${sessionId}
    `;
    
    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }
    
    const user = users[0];
    const reference = `DODO-${uuidv4()}`;
    const amount = 5000000; // ₦50,000 in kobo
    
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
      await sql`
        INSERT INTO payments (id, user_id, reference, amount, status, course_type)
        VALUES (${uuidv4()}, ${user.id}, ${reference}, ${amount}, 'pending', 'foundation')
      `;
      
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
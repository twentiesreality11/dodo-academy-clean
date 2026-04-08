export const dynamic = 'force-dynamic';

import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { sendInquiryNotification } from '@/utils/email';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();
    
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    const id = uuidv4();
    
    await db.run(
      'INSERT INTO inquiries (id, name, email, message) VALUES (?, ?, ?, ?)',
      [id, name, email, message || '']
    );
    
    // Send notification email to admin
    await sendInquiryNotification(name, email, message);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
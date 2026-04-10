// src/app/api/auth/logout/route.js
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';



export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('session');
  return response;
}
import { NextResponse } from 'next/server';
import { isDbConnected } from '@/lib/db';

export async function GET() {
  const dbConnected = await isDbConnected();
  
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV
  });
}
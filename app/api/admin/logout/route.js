import { logout } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  await logout();
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}

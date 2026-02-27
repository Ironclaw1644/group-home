import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminCookieName } from '@/lib/auth';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, '', { expires: new Date(0), path: '/' });
  return NextResponse.json({ ok: true });
}

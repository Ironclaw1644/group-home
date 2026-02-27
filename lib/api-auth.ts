import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminCookieName, isAllowedAdminEmail } from '@/lib/auth';

export async function requireAdminApi() {
  const cookieStore = await cookies();
  const email = cookieStore.get(adminCookieName)?.value;
  if (!isAllowedAdminEmail(email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

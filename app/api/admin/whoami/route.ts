import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAllowlist, adminCookieName, isAllowedAdminEmail } from '@/lib/auth';

export const runtime = 'nodejs';

function getProvidedDebugToken(req: Request) {
  const headerToken = req.headers.get('x-debug-token');
  if (headerToken?.trim()) return headerToken.trim();
  const url = new URL(req.url);
  const queryToken = url.searchParams.get('token');
  return queryToken?.trim() || '';
}

export async function GET(req: Request) {
  const expectedToken = process.env.DEBUG_TOKEN?.trim();
  if (!expectedToken) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  const providedToken = getProvidedDebugToken(req);
  if (!providedToken || providedToken !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const allowlist = adminAllowlist();
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(adminCookieName)?.value?.trim().toLowerCase() || '';
  const hasAuthCookie = Boolean(cookieValue);
  const hasAllowlistEnv = Boolean(process.env.ADMIN_ALLOWLIST && process.env.ADMIN_ALLOWLIST.trim());

  let authResult: 'authorized' | 'unauthorized' = 'unauthorized';
  let reason = 'Missing auth cookie';

  if (!hasAllowlistEnv) {
    reason = 'ADMIN_ALLOWLIST is missing or empty';
  } else if (!allowlist.length) {
    reason = 'ADMIN_ALLOWLIST parsed to zero entries';
  } else if (!hasAuthCookie) {
    reason = `Cookie ${adminCookieName} is missing`;
  } else if (!isAllowedAdminEmail(cookieValue)) {
    reason = 'Cookie email is not in ADMIN_ALLOWLIST';
  } else {
    authResult = 'authorized';
    reason = 'Cookie email matches ADMIN_ALLOWLIST';
  }

  return NextResponse.json({
    hasAllowlistEnv,
    allowlistParsed: allowlist,
    allowlistCount: allowlist.length,
    cookieName: adminCookieName,
    hasAuthCookie,
    authResult,
    reason,
    runtime: 'nodejs' as const
  });
}

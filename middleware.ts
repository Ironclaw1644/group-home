import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { adminCookieName, isAllowedAdminEmail } from '@/lib/auth';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/admin')) return NextResponse.next();
  if (pathname === '/admin/login') return NextResponse.next();

  const email = req.cookies.get(adminCookieName)?.value;
  if (isAllowedAdminEmail(email)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*']
};

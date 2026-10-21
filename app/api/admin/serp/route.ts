import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/api-auth';
import { getSerpHistory } from '@/lib/seo/serp-sync';

export const dynamic = 'force-dynamic';

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    return NextResponse.json(await getSerpHistory());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load rankings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

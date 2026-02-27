import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/api-auth';
import { dbGet, upsertSubscriber } from '@/lib/storage';

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  return NextResponse.json(await dbGet('subscribers'));
}

export async function POST(req: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const body = await req.json();
  const item = await upsertSubscriber({
    email: String(body.email || ''),
    name: body.name ? String(body.name) : undefined,
    source: String(body.source || 'admin'),
    opted_in: body.opted_in !== false
  });
  return NextResponse.json(item);
}

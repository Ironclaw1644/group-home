import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/api-auth';
import { dbGet, upsertPageBlocks } from '@/lib/storage';

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  return NextResponse.json(await dbGet('pages'));
}

export async function POST(req: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const body = await req.json();
  const items = Array.isArray(body) ? body : Array.isArray(body.items) ? body.items : [];
  const saved = await upsertPageBlocks(items);
  return NextResponse.json(saved);
}

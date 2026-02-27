import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/api-auth';
import { dbGet, upsertGalleryImage, deleteGalleryImage } from '@/lib/storage';

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  return NextResponse.json(await dbGet('gallery'));
}

export async function POST(req: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const body = await req.json();
  const item = await upsertGalleryImage(body);
  return NextResponse.json(item);
}

export async function DELETE(req: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await deleteGalleryImage(id);
  return NextResponse.json({ ok: true });
}

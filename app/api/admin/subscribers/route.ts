import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/api-auth';
import { dbGet, updateSubscriberStatusById, upsertSubscriber } from '@/lib/storage';

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
    opted_in: body.opted_in !== false,
    status: body.status || (body.opted_in === false ? 'unsubscribed' : 'active'),
    forceResubscribe: body.force_resubscribe === true
  });
  return NextResponse.json(item);
}

export async function PATCH(req: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const body = await req.json();
  const id = String(body.id || '');
  const status = String(body.status || '') as 'active' | 'unsubscribed' | 'bounced' | 'complaint';
  if (!id || !status) return NextResponse.json({ error: 'id and status are required' }, { status: 400 });

  try {
    const item = await updateSubscriberStatusById(id, status, {
      reason: body.reason ? String(body.reason) : undefined,
      forceResubscribe: body.force_resubscribe === true
    });
    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update subscriber';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

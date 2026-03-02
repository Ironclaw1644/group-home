import { NextResponse } from 'next/server';
import { verifyEmailToken } from '@/lib/email/tokens';
import { logEmailEvent, updateSubscriberStatusByEmail } from '@/lib/storage';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { token?: string };
    const token = String(body.token || '').trim();
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

    const payload = verifyEmailToken(token);
    const email = payload.email.toLowerCase();
    await updateSubscriberStatusByEmail(email, 'unsubscribed', {
      reason: 'unsubscribe_link'
    });
    await logEmailEvent({ email, type: 'unsubscribed', meta: { source: 'unsubscribe_link' } });

    return NextResponse.json({ ok: true, email });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to unsubscribe';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';
import { syncSerpRankings } from '@/lib/seo/serp-sync';

/**
 * Weekly rank check, scheduled from vercel.json (Tuesdays 09:00 UTC; Monday
 * 08:00 is another site's slot on the same shared Apify credit).
 *
 * Cron secret only — no admin-session fallback like purge-archived has, because
 * every call spends scraper credit. With no secret configured it fails closed.
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(req: Request) {
  const expected = process.env.CRON_SECRET?.trim();
  if (!expected || req.headers.get('authorization') !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await syncSerpRankings();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    // Logged so the reason shows in Vercel logs; serp_runs also keeps it.
    const message = error instanceof Error ? error.message : 'Rank check failed';
    console.error('[cron/serp-sync] failed:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

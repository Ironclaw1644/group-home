import 'server-only';

import { cmsServerClient } from '@/lib/supabase/cmsServer';
import { SERP_KEYWORDS, actorInput, ranksFromPages, type QueryRank } from '@/lib/seo/serp-parse';

/**
 * Scrapes a Chesterfield, VA-localised Google SERP (top 20) for every tracked
 * keyword and records where athomefamilyservices.com sits.
 *
 * The older tracker (scripts/serp-tracker.mjs) reads Search Console exports by
 * hand, so in practice it is only as fresh as the last export. Position is the
 * one number that can be measured without first-party access, and it answers
 * "are we climbing?". Clicks and impressions are not invented here — only
 * Search Console knows those.
 *
 * The actor is started asynchronously and polled rather than called through
 * run-sync, which on a slow queue can come back with an empty dataset.
 */

const APIFY = 'https://api.apify.com/v2';
const ACTOR = 'apify~google-search-scraper';

/** Stop polling with enough margin left for the DB writes inside maxDuration (300s). */
const DEADLINE_MS = 250_000;

export interface SerpSyncResult {
  runId: number | null;
  apifyRunId: string;
  checked: number;
  ranking: number;
  recorded: number;
  positions: QueryRank[];
}

/** Apify's own error text (e.g. the monthly usage cap). Never includes the token. */
async function apifyError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: { type?: string; message?: string } };
    const e = body?.error;
    if (e) return [e.type, e.message].filter(Boolean).join(': ').slice(0, 300);
  } catch {
    /* not JSON */
  }
  return res.statusText || 'no detail';
}

async function apify(path: string, token: string, init?: RequestInit) {
  return fetch(`${APIFY}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      // Header rather than `?token=`; query strings leak into logs.
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {})
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(90_000)
  });
}

async function scrape(token: string, onStart: (apifyRunId: string) => Promise<void>): Promise<{ apifyRunId: string; items: unknown[] }> {
  const started = Date.now();
  const startRes = await apify(`/acts/${ACTOR}/runs`, token, { method: 'POST', body: JSON.stringify(actorInput(SERP_KEYWORDS)) });
  if (!startRes.ok) throw new Error(`Rank check did not start (${startRes.status}): ${await apifyError(startRes)}`);
  const run = ((await startRes.json()) as { data: { id: string; status: string; defaultDatasetId: string } }).data;
  await onStart(run.id);

  let status = run.status;
  while (!['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT'].includes(status)) {
    if (Date.now() - started > DEADLINE_MS) throw new Error(`Rank check still ${status} after ${Math.round(DEADLINE_MS / 1000)}s (Apify run ${run.id})`);
    const res = await apify(`/actor-runs/${run.id}?waitForFinish=60`, token);
    if (!res.ok) throw new Error(`Could not read rank check status (${res.status}): ${await apifyError(res)}`);
    status = ((await res.json()) as { data: { status: string } }).data.status;
  }
  if (status !== 'SUCCEEDED') throw new Error(`Rank check ${status} (Apify run ${run.id})`);

  const itemsRes = await apify(`/datasets/${run.defaultDatasetId}/items?clean=true&format=json`, token);
  if (!itemsRes.ok) throw new Error(`Could not read rank check results (${itemsRes.status}): ${await apifyError(itemsRes)}`);
  const items: unknown = await itemsRes.json();
  if (!Array.isArray(items)) throw new Error('Rank check returned an unexpected shape.');
  if (items.length === 0) throw new Error(`Rank check returned no SERP pages (Apify run ${run.id})`);
  return { apifyRunId: run.id, items };
}

/** Eastern date, matching the column default, so one day never splits into two rows. */
function easternDate() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

export async function syncSerpRankings(): Promise<SerpSyncResult> {
  const token = process.env.APIFY_API_KEY?.trim();
  if (!token) throw new Error('APIFY_API_KEY is not set.');

  const db = cmsServerClient();
  const { data: runRow, error: runError } = await db
    .from('serp_runs')
    .insert({ status: 'running', queries: SERP_KEYWORDS.length })
    .select('id')
    .single();
  if (runError) throw new Error(`Could not open rank check run: ${runError.message}`);
  const runId = (runRow as { id: number } | null)?.id ?? null;

  const finish = async (patch: { status: 'ok' | 'error'; ranking?: number; error?: string }) => {
    if (runId === null) return;
    const { error } = await db
      .from('serp_runs')
      .update({ ...patch, finished_at: new Date().toISOString() })
      .eq('id', runId);
    if (error) console.error('[serp-sync] could not close run', runId, error.message);
  };

  try {
    const { apifyRunId, items } = await scrape(token, async (id) => {
      if (runId !== null) await db.from('serp_runs').update({ apify_run_id: id }).eq('id', runId);
    });

    const capturedOn = easternDate();
    const found = new Map(ranksFromPages(items).map((r) => [r.query, r]));
    // Every tracked keyword gets a row, ranked or not, so "not in the top 20"
    // is recorded rather than looking like a missed week.
    const positions: QueryRank[] = SERP_KEYWORDS.map((q) => found.get(q) ?? { query: q, position: null, url: null });
    const rows = positions.map((p) => ({ query: p.query, position: p.position, page: p.url, captured_on: capturedOn, source: 'apify' }));

    const { error } = await db.from('serp_snapshots').upsert(rows, { onConflict: 'query,captured_on,source' });
    if (error) throw new Error(`Could not save rankings: ${error.message}`);

    const ranking = positions.filter((p) => p.position !== null).length;
    await finish({ status: 'ok', ranking });
    return {
      runId,
      apifyRunId,
      checked: positions.length,
      ranking,
      recorded: rows.length,
      positions: [...positions].sort((a, b) => (a.position ?? 999) - (b.position ?? 999) || a.query.localeCompare(b.query))
    };
  } catch (e) {
    await finish({ status: 'error', error: (e instanceof Error ? e.message : String(e)).slice(0, 500) });
    throw e;
  }
}

export interface SerpHistoryRow {
  query: string;
  latest: number | null;
  latestOn: string | null;
  previous: number | null;
  best: number | null;
  page: string | null;
}

/** Latest vs previous week per tracked keyword, for the admin dashboard. */
export async function getSerpHistory() {
  const db = cmsServerClient();
  const [snapshots, runs] = await Promise.all([
    db.from('serp_snapshots').select('query, position, page, captured_on').eq('source', 'apify').order('captured_on', { ascending: false }).limit(1000),
    db.from('serp_runs').select('started_at, finished_at, status, ranking, queries, error').order('started_at', { ascending: false }).limit(5)
  ]);
  if (snapshots.error) throw new Error(snapshots.error.message);
  if (runs.error) throw new Error(runs.error.message);

  const byQuery = new Map<string, { position: number | null; page: string | null; captured_on: string }[]>();
  for (const row of (snapshots.data ?? []) as { query: string; position: number | null; page: string | null; captured_on: string }[]) {
    byQuery.set(row.query, [...(byQuery.get(row.query) ?? []), row]);
  }

  const keywords: SerpHistoryRow[] = SERP_KEYWORDS.map((query) => {
    const rows = byQuery.get(query) ?? [];
    const ranked = rows.map((r) => r.position).filter((p): p is number => p !== null);
    return {
      query,
      latest: rows[0]?.position ?? null,
      latestOn: rows[0]?.captured_on ?? null,
      previous: rows[1]?.position ?? null,
      best: ranked.length ? Math.min(...ranked) : null,
      page: rows.find((r) => r.page)?.page ?? null
    };
  });

  return { keywords, runs: runs.data ?? [] };
}

/**
 * Pure helpers for the weekly rank check (lib/seo/serp-sync.ts): the tracked
 * keywords, the Apify actor input, and how the actor's one-item-per-SERP-page
 * output becomes one position per query.
 *
 * Kept free of `server-only` and Supabase so it can be run under plain node.
 *
 * Input notes carried over from the Bond & Fifth tracker (2026-10-12):
 * apify/google-search-scraper silently ignores `locationUiValue` and
 * `resultsPerPage`. Localisation needs `locationUule` (Google's base64 location
 * token) and the top 20 needs `maxPagesPerQuery: 2`, which returns a separate
 * item per page.
 */

/**
 * The searches families and support coordinators actually type, taken from the
 * Search Console phrasing in reports/serp/targets.json (where "disability
 * services" beat the industry's own "ID/DD" vocabulary). Capped at 12: the
 * Apify plan is a shared free monthly credit.
 */
export const SERP_KEYWORDS = [
  'disability services chesterfield va',
  'disability services north chesterfield va',
  'disability services midlothian va',
  'disability services richmond va',
  'group home for adults with disabilities chesterfield va',
  'adult group home north chesterfield va',
  'group home for adults with intellectual disabilities richmond va',
  'residential services for adults with disabilities richmond va',
  'supportive living for adults with disabilities chesterfield va',
  'adult group home colonial heights va',
  'dd waiver providers chesterfield county',
  'at home family services llc'
] as const;

/**
 * "Chesterfield,Virginia,United States" — Google's geotarget 1027075, the
 * closest canonical location to the home (Google has no North Chesterfield
 * entry). Token = "w+CAIQICI" + length char + base64 of the canonical name.
 */
export const UULE_CHESTERFIELD_VA = 'w+CAIQICIjQ2hlc3RlcmZpZWxkLFZpcmdpbmlhLFVuaXRlZCBTdGF0ZXM=';

/** Two Google pages = top ~20. Past that the exact number stops being actionable. */
export const PAGES_PER_QUERY = 2;

export const SITE_PATTERN = /(^|\/\/|\.)athomefamilyservices\.com/i;

export function actorInput(queries: readonly string[]) {
  return {
    queries: queries.join('\n'),
    maxPagesPerQuery: PAGES_PER_QUERY,
    countryCode: 'us',
    languageCode: 'en',
    locationUule: UULE_CHESTERFIELD_VA,
    mobileResults: false
  };
}

type Json = Record<string, unknown>;

export interface QueryRank {
  query: string;
  /** Best organic position for our site across the pages fetched, or null. */
  position: number | null;
  /** Which of our URLs Google chose, without query parameters. */
  url: string | null;
}

/**
 * One rank per query from the actor's items (one item per query per page).
 *
 * Page 2 positions normally continue from page 1 (11..20). If a page restarts
 * at 1, the earlier pages' result counts are added so positions stay absolute.
 * Several items for the same query collapse into one row, because the
 * snapshots upsert conflicts on (query, captured_on, source).
 */
export function ranksFromPages(items: unknown[], sitePattern: RegExp = SITE_PATTERN): QueryRank[] {
  const byQuery = new Map<string, { page: number; organic: Json[] }[]>();
  for (const raw of items) {
    if (!raw || typeof raw !== 'object') continue;
    const item = raw as Json;
    const sq = (item.searchQuery as Json | undefined) ?? {};
    const term = typeof sq.term === 'string' ? sq.term : null;
    if (!term) continue;
    const page = Number(sq.page) || 1;
    const organic = Array.isArray(item.organicResults) ? (item.organicResults as Json[]) : [];
    const list = byQuery.get(term) ?? [];
    list.push({ page, organic });
    byQuery.set(term, list);
  }

  const out: QueryRank[] = [];
  for (const [query, pages] of byQuery) {
    pages.sort((a, b) => a.page - b.page);
    let offset = 0;
    let best: { position: number; url: string } | null = null;
    for (const { page, organic } of pages) {
      const positions = organic.map((r) => Number(r.position)).filter(Number.isFinite);
      const restarts = page > 1 && positions.length > 0 && Math.min(...positions) === 1;
      const add = restarts ? offset : 0;
      for (const r of organic) {
        const url = String(r.url ?? '');
        const pos = Number(r.position);
        if (!sitePattern.test(url) || !Number.isFinite(pos)) continue;
        const abs = pos + add;
        if (!best || abs < best.position) best = { position: abs, url: url.split('?')[0] };
      }
      offset += organic.length;
    }
    out.push({ query, position: best?.position ?? null, url: best?.url ?? null });
  }
  return out;
}

#!/usr/bin/env node
/**
 * SERP tracker.
 *
 * Search Console only keeps 16 months and its UI will not show you how a given
 * query moved between two arbitrary exports. This keeps a local, append-only
 * history so position changes are visible over time.
 *
 *   node scripts/serp-tracker.mjs ingest ~/Downloads/site-Performance-on-Search-2026-08-03.zip
 *   node scripts/serp-tracker.mjs report
 *   node scripts/serp-tracker.mjs ingest <zip-or-dir> --report
 *
 * Export from: Search Console -> Performance -> Export -> Download CSV (zip).
 * Snapshots are keyed by the export's end date, so re-ingesting the same export
 * updates that entry rather than duplicating it.
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'reports', 'serp');
const SNAPSHOTS = join(DIR, 'snapshots.json');
const TARGETS = join(DIR, 'targets.json');
const REPORT = join(DIR, 'latest-report.md');

const SITE = 'https://athomefamilyservices.com';

/** Minimal RFC-4180 parser: GSC quotes any field containing a comma. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { quoted = false; }
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }

  const header = rows.shift() || [];
  return rows
    .filter((r) => r.some((v) => v !== ''))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

const num = (v) => Number(String(v ?? '').replace(/[%,]/g, '')) || 0;

function loadExport(target) {
  let dir = target;
  let cleanup = null;

  if (statSync(target).isFile()) {
    dir = mkdtempSync(join(tmpdir(), 'serp-'));
    cleanup = dir;
    execFileSync('unzip', ['-o', '-q', target, '-d', dir]);
  }

  const read = (name) => {
    const p = join(dir, name);
    return existsSync(p) ? parseCsv(readFileSync(p, 'utf8')) : [];
  };

  const data = {
    chart: read('Chart.csv'),
    queries: read('Queries.csv'),
    pages: read('Pages.csv'),
    devices: read('Devices.csv'),
    countries: read('Countries.csv')
  };

  if (cleanup) rmSync(cleanup, { recursive: true, force: true });
  return data;
}

function toSnapshot(data) {
  const chart = data.chart;
  if (!chart.length) throw new Error('Chart.csv missing or empty — is this a Search Console performance export?');

  const clicks = chart.reduce((n, r) => n + num(r.Clicks), 0);
  const impressions = chart.reduce((n, r) => n + num(r.Impressions), 0);

  return {
    windowStart: chart[0].Date,
    windowEnd: chart[chart.length - 1].Date,
    days: chart.length,
    totals: {
      clicks,
      impressions,
      ctr: impressions ? +(clicks / impressions * 100).toFixed(2) : 0,
      daysWithImpressions: chart.filter((r) => num(r.Impressions) > 0).length
    },
    queries: data.queries.map((r) => ({
      query: r['Top queries'],
      clicks: num(r.Clicks),
      impressions: num(r.Impressions),
      position: num(r.Position)
    })),
    pages: data.pages.map((r) => ({
      path: (r['Top pages'] || '').replace(SITE, '') || '/',
      clicks: num(r.Clicks),
      impressions: num(r.Impressions),
      position: num(r.Position)
    })),
    devices: data.devices.map((r) => ({
      device: r.Device,
      clicks: num(r.Clicks),
      impressions: num(r.Impressions),
      position: num(r.Position)
    }))
  };
}

const readJson = (p, fallback) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : fallback);

function ingest(target) {
  const snapshot = toSnapshot(loadExport(target));
  mkdirSync(DIR, { recursive: true });

  const all = readJson(SNAPSHOTS, []);
  const at = all.findIndex((s) => s.windowEnd === snapshot.windowEnd);
  if (at >= 0) {
    all[at] = snapshot;
    console.log(`Updated existing snapshot for ${snapshot.windowEnd}`);
  } else {
    all.push(snapshot);
    console.log(`Added snapshot ${snapshot.windowStart} -> ${snapshot.windowEnd}`);
  }

  all.sort((a, b) => a.windowEnd.localeCompare(b.windowEnd));
  writeFileSync(SNAPSHOTS, JSON.stringify(all, null, 2) + '\n');
  console.log(`${all.length} snapshot(s) in reports/serp/snapshots.json`);
  return all;
}

/** Positive delta = moved up the page (position number went down). */
function delta(current, previous, hasBaseline = true) {
  if (current == null) return null;
  // With no earlier export to compare against, everything would read "new".
  if (!hasBaseline) return { text: '—', dir: 'flat' };
  if (previous == null) return { text: 'new', dir: 'new' };
  const diff = +(previous - current).toFixed(1);
  if (Math.abs(diff) < 0.05) return { text: 'flat', dir: 'flat' };
  return { text: `${diff > 0 ? '+' : ''}${diff}`, dir: diff > 0 ? 'up' : 'down' };
}

function report() {
  const all = readJson(SNAPSHOTS, []);
  if (!all.length) {
    console.error('No snapshots yet. Run: node scripts/serp-tracker.mjs ingest <export.zip>');
    process.exit(1);
  }

  const cur = all[all.length - 1];
  const prev = all.length > 1 ? all[all.length - 2] : null;
  const { targets, excluded } = readJson(TARGETS, { targets: [], excluded: [] });

  const find = (snap, q) => snap?.queries.find((x) => x.query.toLowerCase() === q.toLowerCase());
  const out = [];

  out.push('# SERP tracker');
  out.push('');
  out.push(`Window **${cur.windowStart} → ${cur.windowEnd}** (${cur.days} days)${prev ? `, compared with the export ending ${prev.windowEnd}` : ' — first snapshot, no comparison yet'}.`);
  out.push('');
  out.push('| Metric | Value |');
  out.push('| --- | --- |');
  out.push(`| Clicks | ${cur.totals.clicks}${prev ? ` (${cur.totals.clicks - prev.totals.clicks >= 0 ? '+' : ''}${cur.totals.clicks - prev.totals.clicks})` : ''} |`);
  out.push(`| Impressions | ${cur.totals.impressions}${prev ? ` (${cur.totals.impressions - prev.totals.impressions >= 0 ? '+' : ''}${cur.totals.impressions - prev.totals.impressions})` : ''} |`);
  out.push(`| CTR | ${cur.totals.ctr}% |`);
  out.push(`| Days with any impression | ${cur.totals.daysWithImpressions} of ${cur.days} |`);
  out.push('');

  const named = cur.queries.reduce((n, q) => n + q.impressions, 0);
  const hidden = cur.totals.impressions - named;
  out.push(`Search Console named ${cur.queries.length} queries covering ${named} impressions; ${hidden} (${Math.round(hidden / cur.totals.impressions * 100)}%) came from queries too rare to be disclosed.`);
  out.push('');

  out.push('## Tracked keywords');
  out.push('');
  out.push('Position is the Search Console average for the window. "—" means the query did not appear in this export at all, which at this traffic level usually means no impressions rather than a lost ranking.');
  out.push('');
  out.push('| Query | Priority | Target page | Position | Change | Impr |');
  out.push('| --- | --- | --- | ---: | ---: | ---: |');

  const rank = { high: 0, medium: 1, brand: 2 };
  for (const t of [...targets].sort((a, b) => (rank[a.priority] ?? 3) - (rank[b.priority] ?? 3) || a.query.localeCompare(b.query))) {
    const c = find(cur, t.query);
    const p = find(prev, t.query);
    const d = c ? delta(c.position, p?.position, Boolean(prev)) : null;
    const arrow = d ? { up: '▲ ', down: '▼ ', flat: '', new: '' }[d.dir] : '';
    out.push(`| ${t.query} | ${t.priority} | \`${t.page}\` | ${c ? c.position.toFixed(1) : '—'} | ${d ? arrow + d.text : '—'} | ${c ? c.impressions : 0} |`);
  }
  out.push('');

  const ranking = targets.filter((t) => find(cur, t.query)).length;
  out.push(`**${ranking} of ${targets.length} tracked keywords appear in this export.**`);
  out.push('');

  out.push('## Pages');
  out.push('');
  out.push('| Page | Position | Change | Impr | Clicks | CTR |');
  out.push('| --- | ---: | ---: | ---: | ---: | ---: |');
  for (const pg of [...cur.pages].sort((a, b) => b.impressions - a.impressions)) {
    const before = prev?.pages.find((x) => x.path === pg.path);
    const d = delta(pg.position, before?.position, Boolean(prev));
    const arrow = { up: '▲ ', down: '▼ ', flat: '', new: '' }[d.dir];
    const ctr = pg.impressions ? (pg.clicks / pg.impressions * 100).toFixed(1) : '0.0';
    out.push(`| \`${pg.path}\` | ${pg.position.toFixed(1)} | ${arrow}${d.text} | ${pg.impressions} | ${pg.clicks} | ${ctr}% |`);
  }
  out.push('');

  const wasted = cur.pages.filter((p) => p.clicks === 0 && p.position <= 10 && p.impressions > 0);
  if (wasted.length) {
    const lost = wasted.reduce((n, p) => n + p.impressions, 0);
    out.push('## Ranking but not earning clicks');
    out.push('');
    out.push(`${lost} impressions sit in the top 10 with zero clicks. At this volume that is suggestive rather than conclusive, but it points at titles and meta descriptions before it points at rankings.`);
    out.push('');
    for (const p of wasted.sort((a, b) => b.impressions - a.impressions)) {
      out.push(`- \`${p.path}\` — position ${p.position.toFixed(1)}, ${p.impressions} impressions, 0 clicks`);
    }
    out.push('');
  }

  if (cur.queries.length) {
    const tracked = new Set(targets.map((t) => t.query.toLowerCase()));
    const known = new Set((excluded || []).map((e) => e.query.toLowerCase()));
    const untracked = cur.queries.filter((q) => !tracked.has(q.query.toLowerCase()) && !known.has(q.query.toLowerCase()));
    if (untracked.length) {
      out.push('## Unclassified queries');
      out.push('');
      out.push('New phrasing that is neither tracked nor deliberately excluded. Triage into targets.json.');
      out.push('');
      for (const q of untracked.sort((a, b) => b.impressions - a.impressions)) {
        out.push(`- "${q.query}" — position ${q.position.toFixed(1)}, ${q.impressions} impressions`);
      }
      out.push('');
    }
  }

  if (excluded?.length) {
    out.push('## Deliberately not targeted');
    out.push('');
    for (const e of excluded) out.push(`- "${e.query}" — ${e.reason}`);
    out.push('');
  }

  if (all.length > 1) {
    out.push('## History');
    out.push('');
    out.push('| Window end | Clicks | Impressions | CTR |');
    out.push('| --- | ---: | ---: | ---: |');
    for (const s of all) out.push(`| ${s.windowEnd} | ${s.totals.clicks} | ${s.totals.impressions} | ${s.totals.ctr}% |`);
    out.push('');
  }

  const text = out.join('\n');
  mkdirSync(DIR, { recursive: true });
  writeFileSync(REPORT, text);
  console.log(text);
  console.log(`\nWritten to reports/serp/latest-report.md`);
}

const [cmd, arg] = process.argv.slice(2);

if (cmd === 'ingest') {
  if (!arg) { console.error('Usage: node scripts/serp-tracker.mjs ingest <export.zip|dir> [--report]'); process.exit(1); }
  ingest(arg);
  if (process.argv.includes('--report')) { console.log(''); report(); }
} else if (cmd === 'report' || !cmd) {
  report();
} else {
  console.error(`Unknown command "${cmd}". Use "ingest <export.zip>" or "report".`);
  process.exit(1);
}

#!/usr/bin/env node
/**
 * Submit every sitemap URL to IndexNow after a production deploy.
 *
 *   npm run indexnow            # all URLs in the live sitemap
 *   npm run indexnow -- /faq    # just these paths
 *
 * Reads the key from lib/seo/indexnow.ts so there is one source of truth.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://athomefamilyservices.com';
const key = readFileSync(join(ROOT, 'lib/seo/indexnow.ts'), 'utf8').match(/INDEXNOW_KEY = '([0-9a-f]+)'/)?.[1];
if (!key) throw new Error('INDEXNOW_KEY not found in lib/seo/indexnow.ts');

const keyRes = await fetch(`${SITE}/${key}.txt`, { cache: 'no-store' });
const served = keyRes.ok ? (await keyRes.text()).trim() : '';
if (served !== key) throw new Error(`Key file not live at ${SITE}/${key}.txt (status ${keyRes.status}). Deploy first.`);

let urls = process.argv.slice(2).map((p) => (p.startsWith('http') ? p : `${SITE}${p.startsWith('/') ? p : `/${p}`}`));
if (urls.length === 0) {
  const xml = await (await fetch(`${SITE}/sitemap.xml`, { cache: 'no-store' })).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const res = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation: `${SITE}/${key}.txt`, urlList: urls })
});
const meaning = { 200: 'accepted', 202: 'accepted, key validation pending', 400: 'bad request', 403: 'key not valid', 422: 'URL not on this host', 429: 'rate limited' }[res.status] ?? 'unexpected';
console.log(`IndexNow: ${urls.length} URL(s) -> ${res.status} (${meaning})`);
if (!res.ok) process.exit(1);

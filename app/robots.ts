import type { MetadataRoute } from 'next';
import { SITE_URL, absoluteUrl } from '@/lib/utils';

/**
 * AI answer engines are named explicitly. They already match `*`, but naming
 * them makes the opt-in deliberate and survives anyone later tightening the
 * wildcard: OAI-SearchBot/ChatGPT-User feed ChatGPT search (which also reads
 * Bing's index, hence Bingbot), PerplexityBot feeds Perplexity, ClaudeBot feeds
 * Claude, and Google-Extended covers Gemini.
 */
const AI_CRAWLERS = ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'PerplexityBot', 'ClaudeBot', 'Claude-SearchBot', 'Google-Extended', 'Bingbot'];

export default function robots(): MetadataRoute.Robots {
  return {
    // /admin stays crawlable so its noindex tag is actually read; API routes
    // return JSON only and have nothing to offer a crawler.
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: ['/api/'] }
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL
  };
}

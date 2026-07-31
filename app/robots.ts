import type { MetadataRoute } from 'next';
import { SITE_URL, absoluteUrl } from '@/lib/utils';

export default function robots(): MetadataRoute.Robots {
  return {
    // /admin stays crawlable so its noindex tag is actually read; API routes
    // return JSON only and have nothing to offer a crawler.
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL
  };
}

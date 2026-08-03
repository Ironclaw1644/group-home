import type { MetadataRoute } from 'next';
import { publicPaths, contentUpdatedAt } from '@/lib/content';
import { absoluteUrl } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
  // publicPaths comes from the site directory rendered on every page, so the
  // sitemap and the internal link graph always list exactly the same URLs.
  return publicPaths.map((path) => ({
    url: absoluteUrl(path),
    // A real per-page date. This used to be `new Date()`, which told Google every
    // page changed on every deploy — the fastest way to make lastmod ignored.
    lastModified: new Date(contentUpdatedAt[path] ?? contentUpdatedAt.default),
    changeFrequency: 'weekly' as const,
    priority: path === '/' ? 1 : path.startsWith('/services/') || path.startsWith('/locations/') ? 0.8 : 0.7
  }));
}

import type { MetadataRoute } from 'next';
import { publicPaths } from '@/lib/content';
import { absoluteUrl } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // publicPaths comes from the site directory rendered on every page, so the
  // sitemap and the internal link graph always list exactly the same URLs.
  return publicPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: path === '/' ? 1 : path.startsWith('/services/') || path.startsWith('/locations/') ? 0.8 : 0.7
  }));
}

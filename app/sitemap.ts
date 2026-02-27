import type { MetadataRoute } from 'next';
import { locationSlugs, serviceSlugs } from '@/lib/content';
import { absoluteUrl } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '/',
    '/services',
    '/our-home',
    '/requirements',
    '/placement-inquiry',
    '/placement-inquiry/success',
    '/tour',
    '/contact',
    '/announcements',
    '/resources',
    '/faq'
  ];

  return [
    ...staticPaths.map((path) => ({ url: absoluteUrl(path), lastModified: new Date(), changeFrequency: 'weekly' as const, priority: path === '/' ? 1 : 0.7 })),
    ...serviceSlugs.map((slug) => ({ url: absoluteUrl(`/services/${slug}`), lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...locationSlugs.map((slug) => ({ url: absoluteUrl(`/locations/${slug}`), lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 }))
  ];
}

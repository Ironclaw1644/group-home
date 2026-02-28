import type { Metadata } from 'next';
import { business } from '@/lib/content';
import { absoluteUrl } from '@/lib/utils';

export const defaultDescription = 'Warm, supportive living services for adults with developmental disabilities in North Chesterfield, VA. Placement inquiries, tours, and family-centered care.';

export function buildMetadata({ title, description, path = '/' }: { title: string; description?: string; path?: string }): Metadata {
  const desc = description || defaultDescription;
  const url = absoluteUrl(path);
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: business.name,
      type: 'website',
      images: [{ url: absoluteUrl('/opengraph-image') }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [absoluteUrl('/twitter-image')]
    }
  };
}

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    image: absoluteUrl('/brand/logo.png'),
    url: absoluteUrl('/'),
    telephone: business.phone,
    email: business.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '9207 Clovis St.',
      addressLocality: 'North Chesterfield',
      addressRegion: 'VA',
      postalCode: '23237',
      addressCountry: 'US'
    },
    sameAs: [business.instagram]
  };
}

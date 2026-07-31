import type { Metadata } from 'next';
import { business } from '@/lib/content';
import { absoluteUrl } from '@/lib/utils';

export const defaultDescription = 'Warm, supportive living services for adults with developmental disabilities in North Chesterfield, VA. Placement inquiries, tours, and family-centered care.';

export function buildMetadata({ title, description, path = '/', noIndex = false }: { title: string; description?: string; path?: string; noIndex?: boolean }): Metadata {
  const desc = description || defaultDescription;
  const url = absoluteUrl(path);
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
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

const BUSINESS_ID = absoluteUrl('/#business');

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': BUSINESS_ID,
    name: business.name,
    description: defaultDescription,
    image: absoluteUrl('/brand/logo.png'),
    logo: absoluteUrl('/brand/logo.png'),
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
    areaServed: ['North Chesterfield, VA', 'Chesterfield County, VA', 'Richmond, VA', 'Midlothian, VA', 'Colonial Heights, VA'].map((name) => ({
      '@type': 'Place',
      name
    })),
    sameAs: [business.instagram]
  };
}

/** Marks up an FAQ block so it is eligible for the FAQ rich result in search. */
export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  };
}

/** Gives search engines the page's position in the hierarchy, matching the visible breadcrumb trail. */
export function breadcrumbJsonLd(items: { label: string; href?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {})
    }))
  };
}

export function serviceJsonLd({ name, description, path, areaServed }: { name: string; description: string; path: string; areaServed?: string[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteUrl(path),
    serviceType: name,
    provider: { '@id': BUSINESS_ID },
    ...(areaServed ? { areaServed: areaServed.map((area) => ({ '@type': 'Place', name: area })) } : {})
  };
}

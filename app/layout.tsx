import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Manrope, Fraunces } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { MobileStickyCTA } from '@/components/mobile-sticky-cta';
import { StructuredData } from '@/components/structured-data';
import { ActivityTracker } from '@/components/activity-tracker';
import { buildMetadata, localBusinessJsonLd } from '@/lib/site';
import { SITE_URL } from '@/lib/utils';
import { IS_DEMO } from '@/lib/supabase/cmsServer';
import { DemoTourguide } from '@/components/DemoTourguide';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  ...buildMetadata({ title: 'At Home Family Services, LLC | Supportive Living in North Chesterfield, VA' }),
  metadataBase: new URL(SITE_URL),
  manifest: '/site.webmanifest',
  // In demo mode emit noindex/nofollow everywhere. This static metadata export wins
  // over any header-based directive, so it's the reliable way to keep the throwaway
  // demo out of search indexes.
  robots: {
    index: !IS_DEMO,
    follow: !IS_DEMO,
    googleBot: { index: !IS_DEMO, follow: !IS_DEMO }
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }]
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`}>
      <body className="pb-20 md:pb-0" style={{ fontFamily: 'var(--font-sans)' }}>
        <StructuredData data={localBusinessJsonLd()} />
        <ActivityTracker />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <MobileStickyCTA />
        {IS_DEMO ? <DemoTourguide /> : null}
      </body>
    </html>
  );
}

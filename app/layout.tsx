import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Manrope } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { MobileStickyCTA } from '@/components/mobile-sticky-cta';
import { StructuredData } from '@/components/structured-data';
import { ActivityTracker } from '@/components/activity-tracker';
import { buildMetadata, localBusinessJsonLd } from '@/lib/site';
import { SITE_URL } from '@/lib/utils';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  ...buildMetadata({ title: 'At Home Family Services, LLC | Supportive Living in North Chesterfield, VA' }),
  metadataBase: new URL(SITE_URL),
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }]
  }
};

export const viewport: Viewport = {
  themeColor: '#0f2d45',
  colorScheme: 'light'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <head>
        {/* .reveal starts at opacity 0 and is revealed by JS; without this, a
            no-JS visitor sees blank sections where real content should be. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="font-sans pb-20 md:pb-0">
        <StructuredData data={localBusinessJsonLd()} />
        <ActivityTracker />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-brand-navy focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <MobileStickyCTA />
      </body>
    </html>
  );
}

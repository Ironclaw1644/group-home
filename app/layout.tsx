import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Manrope, Fraunces } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { MobileStickyCTA } from '@/components/mobile-sticky-cta';
import { StructuredData } from '@/components/structured-data';
import { buildMetadata, localBusinessJsonLd } from '@/lib/site';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  ...buildMetadata({ title: 'At Home Family Services, LLC | Supportive Living in North Chesterfield, VA' }),
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://group-home.vercel.app'),
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`}>
      <body className="pb-20 md:pb-0" style={{ fontFamily: 'var(--font-sans)' }}>
        <StructuredData data={localBusinessJsonLd()} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <MobileStickyCTA />
      </body>
    </html>
  );
}

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
  icons: {
    icon: '/icon.svg'
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

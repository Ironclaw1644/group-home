import Link from 'next/link';
import Image from 'next/image';
import { navLinks } from '@/lib/content';
import { Button } from '@/components/ui';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/85 backdrop-blur-md">
      <div className="container-shell flex items-center justify-between gap-2 py-2.5 md:gap-3 md:py-3">
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2 md:gap-2.5">
          <Image
            src="/brand/logo.png"
            alt="At Home Family Services, LLC"
            width={44}
            height={44}
            sizes="(max-width: 768px) 40px, 44px"
            className="h-10 w-10 shrink-0 rounded-full object-contain md:h-11 md:w-11"
            priority
          />
          <span className="min-w-0 self-center">
            <p className="truncate text-sm font-semibold tracking-tight text-brand-navy sm:text-base">At Home Family Services, LLC</p>
            <p className="hidden text-xs text-brand-slate sm:block">Supportive living with dignity, trust, and daily care</p>
          </span>
        </Link>
        <nav className="hidden items-center gap-4 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-brand-slate hover:text-brand-navy">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button href="/placement-inquiry" trackCta="placement-inquiry" className="hidden sm:inline-flex">Placement Inquiry</Button>
          <Button href="/tour" variant="ghost" trackCta="request-tour" className="hidden md:inline-flex">Request Tour</Button>
        </div>
      </div>
      <div className="container-shell overflow-x-auto pb-2 lg:hidden">
        <div className="flex gap-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap rounded-full border border-brand-navy/10 bg-white px-3 py-1.5 text-xs font-medium text-brand-slate hover:text-brand-navy">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { business, footerLinks } from '@/lib/content';

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-brand-navy/10 bg-white/75">
      <div className="container-shell grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Image
              src="/brand/logo.png"
              alt="At Home Family Services, LLC"
              width={44}
              height={44}
              sizes="44px"
              className="h-11 w-11 rounded-full object-contain"
              loading="lazy"
            />
            <p className="font-semibold tracking-tight text-brand-navy">{business.name}</p>
          </div>
          <p className="mt-2 text-sm text-brand-slate">Warm, supportive living for adults with developmental disabilities with a focus on independence, dignity, and wellbeing.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-brand-navy">Contact</h3>
          <ul className="mt-2 space-y-1 text-sm text-brand-slate">
            <li><a href={business.phoneHref} className="hover:text-brand-navy">{business.phone}</a></li>
            <li><a href={`mailto:${business.email}`} className="hover:text-brand-navy">{business.email}</a></li>
            <li>{business.address}</li>
            <li>
              <span>Instagram: </span>
              <a
                href={business.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-brand-teal hover:underline"
                aria-label="Instagram profile for At Home Family Services"
              >
                @athomefamilyservicesllc
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-brand-navy">Explore</h3>
          <ul className="mt-2 space-y-1 text-sm text-brand-slate">
            {footerLinks.map((href) => (
              <li key={href}><Link href={href} className="hover:text-brand-navy">{href.replace(/\//g, ' ').trim()}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-brand-navy">Action</h3>
          <div className="mt-2 flex flex-col gap-2 text-sm">
            <Link href="/placement-inquiry" className="rounded-xl bg-brand-navy px-4 py-2 text-center font-semibold text-white">Start Placement Inquiry</Link>
            <Link href="/tour" className="rounded-xl border border-brand-navy/10 bg-white px-4 py-2 text-center font-semibold text-brand-navy">Request a Tour</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

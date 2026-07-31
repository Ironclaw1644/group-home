import Link from 'next/link';
import { Phone } from 'lucide-react';
import { business } from '@/lib/content';

export function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-navy/10 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
        <a
          href={business.phoneHref}
          data-track-cta="call"
          aria-label={`Call ${business.phone}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-navy/10 bg-white px-3 py-3 text-sm font-semibold text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/60"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call
        </a>
        {/* Link, not <a> — a raw anchor forced a full document reload on the primary mobile CTA. */}
        <Link
          href="/placement-inquiry"
          data-track-cta="placement-inquiry"
          className="rounded-xl bg-brand-teal px-3 py-3 text-center text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/60"
        >
          Placement Inquiry
        </Link>
      </div>
    </div>
  );
}

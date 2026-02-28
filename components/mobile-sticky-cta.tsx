import { business } from '@/lib/content';

export function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-navy/10 bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
        <a href={business.phoneHref} data-track-cta="call" className="rounded-xl border border-brand-navy/10 bg-white px-3 py-3 text-center text-sm font-semibold text-brand-navy">Call</a>
        <a href="/placement-inquiry" data-track-cta="placement-inquiry" className="rounded-xl bg-brand-teal px-3 py-3 text-center text-sm font-semibold text-white">Placement Inquiry</a>
      </div>
    </div>
  );
}

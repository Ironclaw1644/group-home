import { ChevronDown } from 'lucide-react';

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details
          key={item.q}
          className="group rounded-2xl border border-brand-navy/10 bg-white p-4 shadow-card transition-colors hover:border-brand-navy/20 open:border-brand-teal/30"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded font-semibold text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/60 focus-visible:ring-offset-4 [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <ChevronDown
              className="mt-0.5 h-5 w-5 shrink-0 text-brand-teal transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="mt-2 text-sm leading-7 text-brand-slate">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

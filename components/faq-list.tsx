export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details key={item.q} className="rounded-2xl border border-brand-navy/10 bg-white p-4 shadow-card">
          <summary className="cursor-pointer list-none pr-6 font-semibold text-brand-navy">{item.q}</summary>
          <p className="mt-2 text-sm leading-7 text-brand-slate">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

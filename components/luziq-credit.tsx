'use client';

import { usePathname } from 'next/navigation';

export function LuziqCredit() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <div className="border-t border-brand-navy/10">
      <p className="container-shell py-4 text-xs text-brand-slate">
        Website by <a href="https://luziq.ai" className="hover:text-brand-navy">Luziq.ai</a>
      </p>
    </div>
  );
}

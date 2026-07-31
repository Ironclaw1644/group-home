'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteDirectory } from '@/lib/content';

export function SiteLinkHub() {
  const pathname = usePathname();

  return (
    <nav aria-label="All pages" className="container-shell border-t border-brand-navy/10 py-10">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">Everything on this site</h2>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-8 lg:grid-cols-4">
        {siteDirectory.map((group) => (
          <div key={group.heading}>
            <h3 className="text-sm font-semibold text-brand-navy">{group.heading}</h3>
            <ul className="mt-2 space-y-1 text-sm text-brand-slate">
              {group.links.map((link) => (
                <li key={link.href}>
                  {link.href === pathname ? (
                    <span aria-current="page" className="font-semibold text-brand-navy">{link.label}</span>
                  ) : (
                    <Link href={link.href} className="hover:text-brand-navy">{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

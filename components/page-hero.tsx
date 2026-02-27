import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';

export function PageHero({ title, description, breadcrumbs, actions }: { title: string; description: string; breadcrumbs?: { label: string; href?: string }[]; actions?: ReactNode }) {
  return (
    <section className="relative overflow-hidden py-8 sm:py-12">
      <div className="container-shell">
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        <div className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-card backdrop-blur-sm sm:p-10">
          <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-brand-navy sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-brand-slate sm:text-base">{description}</p>
          {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}

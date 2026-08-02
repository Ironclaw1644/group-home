import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';

export function Section({ title, eyebrow, description, children, className }: { title: string; eyebrow?: string; description?: string; children?: ReactNode; className?: string }) {
  return (
    <section className={cn('py-10 sm:py-14', className)}>
      <div className="container-shell">
        <div className="mb-6 max-w-3xl">
          {eyebrow ? <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">{eyebrow}</p> : null}
          <h2 className="text-2xl font-semibold tracking-tight text-brand-navy sm:text-4xl">{title}</h2>
          {description ? <p className="mt-3 text-sm leading-7 text-brand-slate sm:text-base">{description}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-2xl border border-white/80 bg-white/90 p-5 shadow-card backdrop-blur-sm', className)}>{children}</div>;
}

export function Button({
  href,
  children,
  variant = 'primary',
  className,
  type = 'button',
  onClick,
  disabled,
  trackCta
}: {
  href?: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: ButtonHTMLAttributes<HTMLButtonElement>['disabled'];
  trackCta?: string;
}) {
  const base = cn(
    'inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/60',
    variant === 'primary' && 'bg-brand-navy text-white hover:bg-brand-navy/90',
    variant === 'secondary' && 'bg-brand-teal text-white hover:bg-brand-teal/90',
    variant === 'ghost' && 'border border-brand-navy/10 bg-white text-brand-navy hover:bg-brand-sand',
    className
  );

  if (href) return <Link className={base} href={href} data-track-cta={trackCta}>{children}</Link>;
  return <button type={type} className={base} onClick={onClick} disabled={disabled} data-track-cta={trackCta}>{children}</button>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center rounded-full bg-brand-aqua/25 px-2.5 py-1 text-xs font-semibold text-brand-navy">{children}</span>;
}

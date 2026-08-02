import Image from 'next/image';

/**
 * Route-transition loader. Rendered by app/loading.tsx as the Suspense
 * fallback, so it sits inside <main> and the header/footer stay put.
 */
export function LoadingLogo({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex min-h-[55vh] items-center justify-center px-4 py-16" role="status" aria-live="polite">
      <div className="flex flex-col items-center">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <span aria-hidden="true" className="loader-ring absolute inset-0 rounded-full border-2 border-brand-teal/50" />
          <span aria-hidden="true" className="loader-ring loader-ring-delayed absolute inset-0 rounded-full border-2 border-brand-aqua/70" />
          {/* alt="" — the visible label below already announces the state. */}
          <Image
            src="/brand/logo.png"
            alt=""
            width={96}
            height={96}
            sizes="96px"
            className="loader-mark relative h-20 w-20 rounded-full object-contain"
          />
        </div>
        <p className="mt-5 text-sm font-medium text-brand-slate">{label}</p>
      </div>
    </div>
  );
}

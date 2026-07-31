'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Slide = {
  src: string;
  alt: string;
};

export function OurHomeCarousel({ slides }: { slides: readonly Slide[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const width = track.clientWidth;
      if (!width) return;
      const index = Math.round(track.scrollLeft / width);
      const bounded = Math.max(0, Math.min(slides.length - 1, index));
      setActive(bounded);
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => track.removeEventListener('scroll', onScroll);
  }, [slides.length]);

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const bounded = Math.max(0, Math.min(slides.length - 1, index));
    track.scrollTo({ left: bounded * track.clientWidth, behavior: 'smooth' });
  }

  function move(direction: -1 | 1) {
    goTo(active + direction);
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-white shadow-card">
        <div
          ref={trackRef}
          className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
          aria-label="Our home photo carousel"
        >
          {slides.map((slide, index) => (
            <figure key={slide.src} className="w-full shrink-0 snap-center">
              <div className="relative aspect-[16/9] w-full bg-brand-sand">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 960px"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </figure>
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => move(-1)}
          disabled={active === 0}
          className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-brand-navy/85 p-2.5 text-white shadow-lg backdrop-blur transition hover:bg-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-0 md:block"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => move(1)}
          disabled={active === slides.length - 1}
          className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-brand-navy/85 p-2.5 text-white shadow-lg backdrop-blur transition hover:bg-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-0 md:block"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
        <p className="absolute bottom-3 right-3 rounded-full bg-brand-navy/75 px-2.5 py-1 text-xs font-medium text-white backdrop-blur" aria-hidden="true">
          {active + 1} / {slides.length}
        </p>
      </div>

      <div className="mt-1 flex items-center justify-center" aria-label="Carousel pagination">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={active === index}
            onClick={() => goTo(index)}
            // Dot is small, but the button keeps a 44px tap target around it.
            className="group grid h-11 w-8 place-items-center focus-visible:outline-none"
          >
            <span
              className={`h-2.5 rounded-full transition-all group-focus-visible:ring-2 group-focus-visible:ring-brand-teal group-focus-visible:ring-offset-2 ${
                active === index ? 'w-6 bg-brand-teal' : 'w-2.5 bg-brand-navy/20 group-hover:bg-brand-navy/40'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

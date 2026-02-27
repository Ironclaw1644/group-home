import Image from 'next/image';
import type { GalleryImage } from '@/lib/types';

export function SiteImageGrid({ images }: { images: GalleryImage[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((img, idx) => (
        <figure key={img.id} className={idx === 0 ? 'sm:col-span-2 lg:row-span-2' : ''}>
          <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-white shadow-card">
            <Image src={img.url} alt={img.alt} width={1200} height={900} className="h-56 w-full object-cover sm:h-64 lg:h-full" loading={idx < 2 ? 'eager' : 'lazy'} />
          </div>
          {img.credit ? <figcaption className="mt-1 text-xs text-brand-slate">{img.credit}</figcaption> : null}
        </figure>
      ))}
    </div>
  );
}

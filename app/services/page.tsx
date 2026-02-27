import Link from 'next/link';
import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section, Card, Button } from '@/components/ui';
import { servicePages, serviceSlugs } from '@/lib/content';

export const metadata = buildMetadata({ title: 'Services | At Home Family Services, LLC', path: '/services', description: 'Explore supportive living, placement support, life skills training, community outings, and individualized support planning.' });

export default function ServicesPage() {
  return (
    <>
      <PageHero title="Supportive services built around dignity and daily life" description="We provide 24/7 supportive living and personalized daily support for adults with developmental disabilities, with a focus on safety, consistency, and independence." actions={<><Button href="/placement-inquiry">Placement Inquiry</Button><Button href="/tour" variant="ghost">Request Tour</Button></>} />
      <Section title="Service areas" description="Each service page includes detailed information, FAQs, and next steps for placement or tours.">
        <div className="grid gap-4 md:grid-cols-2">
          {serviceSlugs.map((slug) => {
            const page = servicePages[slug];
            return (
              <Card key={slug}>
                <h3 className="text-lg font-semibold text-brand-navy">{page.title}</h3>
                <p className="mt-2 text-sm leading-7 text-brand-slate">{page.summary}</p>
                <ul className="mt-3 space-y-1 text-sm text-brand-slate">
                  {page.bullets.map((b) => <li key={b}>• {b}</li>)}
                </ul>
                <Link href={`/services/${slug}`} className="mt-4 inline-flex text-sm font-semibold text-brand-teal hover:text-brand-navy">Read more</Link>
              </Card>
            );
          })}
        </div>
      </Section>
    </>
  );
}

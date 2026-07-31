import Link from 'next/link';
import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section, Card, Button } from '@/components/ui';
import { locationPages, locationSlugs } from '@/lib/content';

export const metadata = buildMetadata({
  title: 'Service Areas | At Home Family Services, LLC',
  path: '/locations',
  description: 'Supportive living and group home placement for adults with ID/DD across North Chesterfield, Chesterfield County, Richmond, Midlothian, and Colonial Heights, VA.'
});

export default function LocationsPage() {
  return (
    <>
      <PageHero
        title="Service areas across the Richmond region"
        description="Our home is in North Chesterfield, Virginia, and we support families and coordinators throughout the surrounding communities."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Service Areas' }]}
        actions={<><Button href="/placement-inquiry">Placement Inquiry</Button><Button href="/tour" variant="ghost">Request a Tour</Button></>}
      />
      <Section title="Where we serve" description="Each area page covers local placement support, nearby communities, and how to start a tour or inquiry.">
        <div className="grid gap-4 md:grid-cols-2">
          {locationSlugs.map((slug) => {
            const page = locationPages[slug];
            return (
              <Card key={slug}>
                <h3 className="font-display text-lg font-semibold text-brand-navy">{page.title}</h3>
                <p className="mt-2 text-sm leading-7 text-brand-slate">{page.summary}</p>
                <p className="mt-3 text-sm text-brand-slate">Nearby: {page.nearby.join(', ')}</p>
                <Link href={`/locations/${slug}`} className="mt-4 inline-flex text-sm font-semibold text-brand-teal hover:text-brand-navy">
                  {page.linkLabel} details
                </Link>
              </Card>
            );
          })}
        </div>
      </Section>
    </>
  );
}

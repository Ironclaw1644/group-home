import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { locationPages, locationSlugs, faqs } from '@/lib/content';
import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section, Card, Button } from '@/components/ui';
import { FaqList } from '@/components/faq-list';

export function generateStaticParams() {
  return locationSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = locationPages[slug as keyof typeof locationPages];
  if (!page) return buildMetadata({ title: 'Location | At Home Family Services, LLC' });
  return buildMetadata({ title: `${page.title} | At Home Family Services, LLC`, description: page.summary, path: `/locations/${slug}` });
}

export default async function LocationLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = locationPages[slug as keyof typeof locationPages];
  if (!page) notFound();

  return (
    <>
      <PageHero
        title={page.title}
        description={page.summary}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Locations', href: '/services' }, { label: page.title }]}
        actions={<><Button href="/placement-inquiry">Placement Inquiry</Button><Button href="/tour" variant="ghost">Request Tour</Button></>}
      />
      <Section title="How we support families in this area" description="We work with families and coordinators who need a responsive, trust-centered placement process.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <p className="text-sm leading-7 text-brand-slate">{page.summary}</p>
            <p className="mt-3 text-sm leading-7 text-brand-slate">Our North Chesterfield home offers a warm environment, trained direct support professionals, and a structured daily support approach that centers dignity and wellbeing.</p>
            <p className="mt-3 text-sm leading-7 text-brand-slate">We encourage families to start with a placement inquiry that includes timeframe, broad support level, and coverage type so we can follow up efficiently.</p>
          </Card>
          <Card>
            <h3 className="font-semibold text-brand-navy">Nearby areas we commonly support</h3>
            <ul className="mt-3 space-y-2 text-sm text-brand-slate">{page.nearby.map((n) => <li key={n}>• {n}</li>)}</ul>
            <div className="mt-4 space-y-2 text-sm">
              <Link href="/services/group-home-adults-id-dd" className="block font-semibold text-brand-teal">Group Home Placement for Adults with ID/DD</Link>
              <Link href="/services/supportive-living-id-dd" className="block font-semibold text-brand-teal">Supportive Living Services</Link>
              <Link href="/resources" className="block font-semibold text-brand-teal">Placement Process Resources</Link>
            </div>
          </Card>
        </div>
      </Section>
      <Section title="Frequently asked questions for local placement inquiries">
        <FaqList items={faqs.slice(0, 3)} />
      </Section>
    </>
  );
}

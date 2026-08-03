import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { locationPages, locationSlugs, faqs, serviceSlugs, servicePages } from '@/lib/content';
import { buildMetadata, serviceJsonLd } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section, Card, Button } from '@/components/ui';
import { FaqList } from '@/components/faq-list';
import { StructuredData } from '@/components/structured-data';

export function generateStaticParams() {
  return locationSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = locationPages[slug as keyof typeof locationPages];
  if (!page) return buildMetadata({ title: 'Location | At Home Family Services, LLC' });
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: `/locations/${slug}` });
}

export default async function LocationLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = locationPages[slug as keyof typeof locationPages];
  if (!page) notFound();

  const nearbySlugs = locationSlugs.filter((s) => s !== slug);

  return (
    <>
      <StructuredData data={serviceJsonLd({ name: page.title, description: page.summary, path: `/locations/${slug}`, areaServed: [page.linkLabel, ...page.nearby] })} />
      <PageHero
        title={page.title}
        description={page.summary}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Service Areas', href: '/locations' }, { label: page.linkLabel }]}
        actions={<><Button href="/placement-inquiry">Placement Inquiry</Button><Button href="/tour" variant="ghost">Request Tour</Button></>}
      />
      <Section title="How we support families in this area" description="We work with families and coordinators who need a responsive, trust-centered placement process.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            {page.detail.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? 'text-sm leading-7 text-brand-slate' : 'mt-3 text-sm leading-7 text-brand-slate'}>{paragraph}</p>
            ))}
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              We encourage families to start with a <Link href="/placement-inquiry" className="font-semibold text-brand-teal hover:text-brand-navy">placement inquiry</Link> that includes timeframe, broad support level, and coverage type so we can follow up efficiently. It also helps to review our <Link href="/requirements" className="font-semibold text-brand-teal hover:text-brand-navy">placement requirements</Link> first.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold text-brand-navy">Nearby areas we commonly support</h3>
            <ul className="mt-3 space-y-2 text-sm text-brand-slate">
              {nearbySlugs.map((other) => (
                <li key={other}>
                  <Link href={`/locations/${other}`} className="text-brand-teal hover:text-brand-navy">{locationPages[other].linkLabel}</Link>
                </li>
              ))}
            </ul>
            <h3 className="mt-5 font-semibold text-brand-navy">Services available in this area</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {serviceSlugs.map((service) => (
                <li key={service}>
                  <Link href={`/services/${service}`} className="text-brand-teal hover:text-brand-navy">{servicePages[service].title}</Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>
      <Section title="Frequently asked questions for local placement inquiries">
        <FaqList items={faqs.slice(0, 3)} />
        <p className="mt-4 text-sm text-brand-slate">
          See the full <Link href="/faq" className="font-semibold text-brand-teal hover:text-brand-navy">FAQ</Link>, browse <Link href="/resources" className="font-semibold text-brand-teal hover:text-brand-navy">family resources</Link>, or view <Link href="/locations" className="font-semibold text-brand-teal hover:text-brand-navy">all service areas</Link>.
        </p>
      </Section>
    </>
  );
}

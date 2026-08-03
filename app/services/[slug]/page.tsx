import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { servicePages, serviceSlugs, faqs, locationSlugs, locationPages } from '@/lib/content';
import { buildMetadata, serviceJsonLd } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section, Card, Button } from '@/components/ui';
import { FaqList } from '@/components/faq-list';
import { StructuredData } from '@/components/structured-data';

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = servicePages[slug as keyof typeof servicePages];
  if (!page) return buildMetadata({ title: 'Service | At Home Family Services, LLC' });
  // metaTitle leads with search vocabulary and skips the brand suffix, which was
  // pushing the distinguishing words past Google's ~60-character truncation.
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: `/services/${slug}` });
}

export default async function ServiceLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = servicePages[slug as keyof typeof servicePages];
  if (!page) notFound();

  const otherServices = serviceSlugs.filter((s) => s !== slug);

  return (
    <>
      <StructuredData data={serviceJsonLd({ name: page.title, description: page.summary, path: `/services/${slug}`, areaServed: locationSlugs.map((s) => locationPages[s].linkLabel) })} />
      <PageHero
        title={page.title}
        description={page.summary}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: page.title }]}
        actions={<><Button href="/placement-inquiry">Placement Inquiry</Button><Button href="/tour" variant="ghost">Request a Tour</Button></>}
      />
      <Section title="What this service includes" description="We tailor support based on broad needs, goals, and household fit.">
        {/* items-start so the short "at a glance" card sizes to its content instead of stretching. */}
        <div className="grid items-start gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold text-brand-navy">At a glance</h3>
            <ul className="list-check mt-3 text-sm text-brand-slate">{page.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
          </Card>
          <Card>
            {page.detail.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? 'text-sm leading-7 text-brand-slate' : 'mt-3 text-sm leading-7 text-brand-slate'}>{paragraph}</p>
            ))}
          </Card>
        </div>
      </Section>
      <Section title="Placement and tour options" description="Families and support coordinators can start with a placement inquiry or request a tour/call.">
        <Card>
          <p className="text-sm leading-7 text-brand-slate">If you are comparing options, we recommend starting with a placement inquiry so we can review timeframe, coverage type, and broad support needs. You can also request a tour directly.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href="/placement-inquiry">Start Placement Inquiry</Button>
            <Button href="/tour" variant="secondary">Request Tour</Button>
            <Link href="/contact" className="inline-flex items-center text-sm font-semibold text-brand-teal">Contact Us</Link>
          </div>
        </Card>
      </Section>
      <Section title="Other services we provide" description="Support rarely fits in one category, so most residents draw on several of these at once.">
        <div className="grid gap-4 sm:grid-cols-2">
          {otherServices.map((other) => (
            <Card key={other}>
              <h3 className="font-semibold text-brand-navy">{servicePages[other].title}</h3>
              <p className="mt-2 text-sm leading-7 text-brand-slate">{servicePages[other].summary}</p>
              <Link href={`/services/${other}`} className="mt-3 inline-flex text-sm font-semibold text-brand-teal hover:text-brand-navy">Read about {servicePages[other].linkLabel}</Link>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Frequently asked questions">
        <FaqList items={faqs.slice(0, 3)} />
        <p className="mt-4 text-sm text-brand-slate">
          More questions are answered on our <Link href="/faq" className="font-semibold text-brand-teal hover:text-brand-navy">FAQ page</Link>, or review <Link href="/requirements" className="font-semibold text-brand-teal hover:text-brand-navy">placement requirements</Link> before you inquire.
        </p>
      </Section>
    </>
  );
}

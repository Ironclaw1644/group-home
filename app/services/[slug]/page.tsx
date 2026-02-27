import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { servicePages, serviceSlugs, faqs } from '@/lib/content';
import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section, Card, Button } from '@/components/ui';
import { FaqList } from '@/components/faq-list';

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = servicePages[slug as keyof typeof servicePages];
  if (!page) return buildMetadata({ title: 'Service | At Home Family Services, LLC' });
  return buildMetadata({ title: `${page.title} | At Home Family Services, LLC`, description: page.summary, path: `/services/${slug}` });
}

export default async function ServiceLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = servicePages[slug as keyof typeof servicePages];
  if (!page) notFound();

  const detailParagraphs = {
    0: 'Our team focuses on dependable support, a clean home environment, and consistent routines that help residents feel safe and respected. Families and coordinators can expect clear communication and a collaborative intake process.',
    1: 'We take a trust-first approach to placement conversations. The initial inquiry helps us understand timeframe, support level, and broad needs, then we schedule follow-up conversations and tours as appropriate.',
    2: 'Each person’s goals and preferences matter. We work to support independence through daily living skills, structured routines, and individualized support planning that aligns with wellbeing and dignity.'
  } as const;

  return (
    <>
      <PageHero
        title={page.title}
        description={page.summary}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: page.title }]}
        actions={<><Button href="/placement-inquiry">Placement Inquiry</Button><Button href="/tour" variant="ghost">Request a Tour</Button></>}
      />
      <Section title="What this service includes" description="We tailor support based on broad needs, goals, and household fit.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <ul className="space-y-2 text-sm text-brand-slate">{page.bullets.map((b) => <li key={b}>• {b}</li>)}</ul>
          </Card>
          <Card>
            <p className="text-sm leading-7 text-brand-slate">{detailParagraphs[0]}</p>
            <p className="mt-3 text-sm leading-7 text-brand-slate">{detailParagraphs[1]}</p>
            <p className="mt-3 text-sm leading-7 text-brand-slate">{detailParagraphs[2]}</p>
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
      <Section title="Frequently asked questions">
        <FaqList items={faqs.slice(0, 3)} />
      </Section>
    </>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section, Card, Button } from '@/components/ui';
import { business } from '@/lib/content';
import { familyQuestions, getFamilyQuestion, familyQuestionPath } from '@/lib/family-questions';

/*
 * One question per page (the PAA colony). The H1, slug and title are the
 * question, and the first paragraph restates it. Deliberately no FAQPage
 * markup: a single-question page is an article, not an FAQ list.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return familyQuestions.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getFamilyQuestion(slug);
  if (!item) return buildMetadata({ title: 'FAQ | At Home Family Services, LLC' });
  return buildMetadata({ title: item.metaTitle, description: item.metaDescription, path: familyQuestionPath(slug) });
}

const linkClass = 'font-semibold text-brand-teal hover:text-brand-navy';

export default async function FamilyQuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getFamilyQuestion(slug);
  if (!item) notFound();

  const related = item.related.map((s) => getFamilyQuestion(s)).filter((r): r is NonNullable<typeof r> => Boolean(r));
  const reviewed = new Date(`${item.reviewed}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

  return (
    <>
      <PageHero
        title={item.question}
        description="A plain-language answer for families and support coordinators in Virginia, with the official sources it is based on."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'FAQ', href: '/faq' }, { label: item.label }]}
      />
      <Section title="The short answer" className="py-6 sm:py-8">
        <p className="max-w-3xl text-base leading-8 text-brand-navy">{item.answer}</p>
      </Section>

      {item.sections.map((section) => (
        <Section key={section.heading} title={section.heading} className="py-6 sm:py-8">
          <Card className="max-w-4xl">
            {section.paragraphs?.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? 'text-sm leading-7 text-brand-slate' : 'mt-3 text-sm leading-7 text-brand-slate'}>{paragraph}</p>
            ))}
            {section.items ? (
              <ul className={`list-check text-sm leading-7 text-brand-slate ${section.paragraphs?.length ? 'mt-3' : ''}`}>
                {section.items.map((entry) => <li key={entry}>{entry}</li>)}
              </ul>
            ) : null}
          </Card>
        </Section>
      ))}

      <Section title="What this means at At Home Family Services">
        <Card className="max-w-4xl">
          <p className="text-sm leading-7 text-brand-slate">{item.atOurHome}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {item.moneyLinks.map((link) => (
              <li key={link.href}><Link href={link.href} className={linkClass}>{link.label}</Link></li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href="/placement-inquiry" trackCta="placement-inquiry">Start a Placement Inquiry</Button>
            <Button href={business.phoneHref} variant="secondary" trackCta="call">Call {business.phone}</Button>
          </div>
        </Card>
      </Section>

      <Section title="Sources">
        <Card className="max-w-4xl">
          <ul className="space-y-2 text-sm">
            {item.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} className={linkClass} rel="noopener" target="_blank">{source.label}</a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-6 text-brand-slate">
            Sources reviewed {reviewed}. Rules and programs change, so confirm current details with your Community Services Board or support coordinator. This page is general information, not legal or benefits advice.
          </p>
        </Card>
      </Section>

      <Section title="Related questions">
        <div className="grid gap-4 md:grid-cols-3">
          {related.map((other) => (
            <Card key={other.slug}>
              <Link href={familyQuestionPath(other.slug)} className={linkClass}>{other.question}</Link>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-sm text-brand-slate">
          More answers are on our <Link href="/faq" className={linkClass}>FAQ page</Link>.
        </p>
      </Section>
    </>
  );
}

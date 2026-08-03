import Link from 'next/link';
import { buildMetadata, faqJsonLd } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section, Button } from '@/components/ui';
import { FaqList } from '@/components/faq-list';
import { StructuredData } from '@/components/structured-data';
import { faqs } from '@/lib/content';

export const metadata = buildMetadata({ title: 'Group Home FAQ | Eligibility, Tours & Coverage in VA', path: '/faq', description: 'Answers on who is eligible, what care we do and do not provide, how quickly a tour can be arranged, and what to include in a first placement inquiry.' });

export default function FaqPage() {
  return (
    <>
      {/* Canonical home for FAQ markup — service and location pages reuse the questions visually but leave the schema here. */}
      <StructuredData data={faqJsonLd(faqs)} />
      <PageHero
        title="Frequently asked questions"
        description="Answers to common questions from families, support coordinators, and referral partners."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]}
      />
      <Section title="Questions" description="If you need more detail, contact us or request a call.">
        <FaqList items={faqs} />
        <p className="mt-6 text-sm text-brand-slate">
          Still deciding? Review <Link href="/requirements" className="font-semibold text-brand-teal hover:text-brand-navy">placement requirements</Link>, browse our <Link href="/services" className="font-semibold text-brand-teal hover:text-brand-navy">services</Link>, or see <Link href="/our-home" className="font-semibold text-brand-teal hover:text-brand-navy">our home</Link>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3"><Button href="/contact">Contact Us</Button><Button href="/placement-inquiry" variant="ghost">Placement Inquiry</Button></div>
      </Section>
    </>
  );
}

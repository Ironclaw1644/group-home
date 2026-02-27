import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section, Button } from '@/components/ui';
import { FaqList } from '@/components/faq-list';
import { faqs } from '@/lib/content';

export const metadata = buildMetadata({ title: 'FAQ | At Home Family Services, LLC', path: '/faq', description: 'Common questions about eligibility, tours, placement timing, and supportive living services.' });

export default function FaqPage() {
  return (
    <>
      <PageHero title="Frequently asked questions" description="Answers to common questions from families, support coordinators, and referral partners." />
      <Section title="Questions" description="If you need more detail, contact us or request a call.">
        <FaqList items={faqs} />
        <div className="mt-6 flex gap-3"><Button href="/contact">Contact Us</Button><Button href="/placement-inquiry" variant="ghost">Placement Inquiry</Button></div>
      </Section>
    </>
  );
}

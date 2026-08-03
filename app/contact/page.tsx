import Link from 'next/link';
import { buildMetadata } from '@/lib/site';
import { business } from '@/lib/content';
import { PageHero } from '@/components/page-hero';
import { LeadForm } from '@/components/lead-form';
import { Section, Card } from '@/components/ui';

export const metadata = buildMetadata({ title: 'Contact At Home Family Services | North Chesterfield, VA', path: '/contact', description: 'Call (804) 919-3030, email, or send a message about disability services and group home placement for adults 18+ in the Richmond area.' });

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact us" description="Call, email, or send a message. We welcome questions from families, support coordinators, and referral partners." breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
      <Section title="Get in touch" description="For faster placement conversations, use the placement inquiry form.">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <Card><h3 className="font-semibold">Business</h3><p className="mt-2 text-sm text-brand-slate">{business.name}</p></Card>
            <Card><h3 className="font-semibold">Phone</h3><p className="mt-2 text-sm"><a href={business.phoneHref} className="text-brand-teal hover:text-brand-navy">{business.phone}</a></p></Card>
            <Card><h3 className="font-semibold">Email</h3><p className="mt-2 text-sm"><a href={`mailto:${business.email}`} className="text-brand-teal hover:text-brand-navy">{business.email}</a></p></Card>
            <Card><h3 className="font-semibold">Address</h3><p className="mt-2 text-sm text-brand-slate">{business.address}</p><p className="mt-2 text-sm text-brand-slate">Instagram: <a href={business.instagram} className="text-brand-teal" target="_blank" rel="noreferrer">@athomefamilyservicesllc</a></p></Card>
          </div>
          <LeadForm
            leadType="general"
            title="Contact Form"
            extraFields={[
              { name: 'preferred_contact_method', label: 'Preferred contact method', type: 'select', options: ['phone', 'email', 'text'] },
              { name: 'subscribe_updates', label: 'Email updates', type: 'checkbox', placeholder: 'I would like occasional updates and announcements by email (optional).' },
              { name: 'notes', label: 'Message', type: 'textarea', required: true, minLength: 10, helperText: 'Please share at least a short message (10+ characters).' }
            ]}
            summaryLeadLabel="General Contact"
            summaryFields={[
              { name: 'contact_name', label: 'Name' },
              { name: 'contact_email', label: 'Email' },
              { name: 'contact_phone', label: 'Phone' },
              { name: 'preferred_contact_method', label: 'Preferred Contact Method', fallback: 'Not provided' }
            ]}
          />
        </div>
      </Section>

      <Section title="Which route is fastest" description="All three reach us. They just suit different questions.">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="font-semibold text-brand-navy">Call</h3>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              Best for anything time-sensitive, and for questions about coverage or support levels that are hard to answer in writing. If we cannot pick up, leave a message with a good time to call back.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold text-brand-navy">Placement inquiry form</h3>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              The fastest route if you are actively seeking a placement. It captures timeframe, support level, and coverage up front, so our first call with you starts from real information rather than basics.
            </p>
            <Link href="/placement-inquiry" className="mt-3 inline-flex text-sm font-semibold text-brand-teal hover:text-brand-navy">Start an inquiry</Link>
          </Card>
          <Card>
            <h3 className="font-semibold text-brand-navy">This contact form</h3>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              For general questions, referral partners, and anything that is not yet a placement request. Please keep private medical details out of online forms — we will cover specifics by phone.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="Before you get in touch" description="A few things that make the first conversation more useful.">
        <Card>
          <p className="text-sm leading-7 text-brand-slate">
            It helps to know roughly when a placement is needed, the broad level of daily support involved, and what coverage is likely — Medicaid waiver, private pay, or something still being worked out. None of that has to be exact. Approximate answers are enough to tell whether a tour is worth anyone’s time.
          </p>
          <p className="mt-3 text-sm leading-7 text-brand-slate">
            If you are still gathering information, our <Link href="/faq" className="font-semibold text-brand-teal hover:text-brand-navy">FAQ</Link> and <Link href="/resources" className="font-semibold text-brand-teal hover:text-brand-navy">family resources</Link> cover most of what families ask first, and <Link href="/requirements" className="font-semibold text-brand-teal hover:text-brand-navy">placement requirements</Link> sets out who we can and cannot support.
          </p>
        </Card>
      </Section>
    </>
  );
}

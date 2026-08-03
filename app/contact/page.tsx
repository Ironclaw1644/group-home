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
    </>
  );
}

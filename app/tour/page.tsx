import Link from 'next/link';
import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { LeadForm } from '@/components/lead-form';
import { Section, Card } from '@/components/ui';

export const metadata = buildMetadata({ title: 'Request a Tour | Group Home in North Chesterfield, VA', path: '/tour', description: 'Book an in-person or phone tour of our North Chesterfield group home. Share a few preferred times and we will follow up to confirm.' });

export default function TourPage() {
  return (
    <>
      <PageHero title="Request a tour" description="Choose an in-person or phone tour and share a few preferred date/time windows." breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Tour' }]} />
      <Section title="What happens on a tour" description="A tour is a conversation, not a sales visit. Most take under an hour.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold text-brand-navy">In person</h3>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              You see the home as it actually is: the shared living spaces, the bedrooms, the kitchen, and the backyard. We walk through how the day is structured, how staffing works across shifts, and where a prospective resident would fit into the household.
            </p>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              We schedule around the routines of the people already living here, so in-person times are limited to windows that will not disrupt them.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold text-brand-navy">By phone</h3>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              A phone tour covers the same ground without the drive. It is usually the faster first step when you are still comparing several homes, and it costs you nothing but twenty minutes.
            </p>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              Support coordinators and family members in other areas can join the same call, which saves repeating the conversation later.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="Questions worth asking" description="Ask us these. Ask every other home you are considering the same things.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <ul className="list-check text-sm text-brand-slate">
              <li>How many people live in the home, and what are their support levels?</li>
              <li>What does staffing look like overnight and at weekends?</li>
              <li>How are medications coordinated, and with whom?</li>
              <li>How and how often will we hear from you?</li>
            </ul>
          </Card>
          <Card>
            <ul className="list-check text-sm text-brand-slate">
              <li>What does a resident’s day actually look like?</li>
              <li>How are outings and community time decided?</li>
              <li>What happens if support needs change over time?</li>
              <li>What would make this home the wrong fit for us?</li>
            </ul>
            <p className="mt-4 text-sm leading-7 text-brand-slate">
              The last one matters most. Review our <Link href="/requirements" className="font-semibold text-brand-teal hover:text-brand-navy">placement requirements</Link> before the call so the conversation starts from the right place.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="Tour request form">
        <LeadForm
          leadType="tour"
          title="Tour Request"
          extraFields={[
            { name: 'tour_type', label: 'Tour type', type: 'select', required: true, options: ['in-person', 'phone'] },
            { name: 'preferred_dates_times', label: 'Preferred dates/times', type: 'textarea', required: true, minLength: 5, placeholder: 'Example: Tue/Thu afternoons next week' },
            { name: 'preferred_contact_method', label: 'Preferred contact method', type: 'select', required: true, options: ['phone', 'email', 'text'] },
            { name: 'subscribe_updates', label: 'Email updates', type: 'checkbox', placeholder: 'I would like occasional updates and announcements by email (optional).' },
            { name: 'notes', label: 'Notes', type: 'textarea' }
          ]}
          summaryLeadLabel="Tour Request"
          summaryFields={[
            { name: 'contact_name', label: 'Name' },
            { name: 'contact_email', label: 'Email' },
            { name: 'contact_phone', label: 'Phone' },
            { name: 'tour_type', label: 'Tour Type' },
            { name: 'preferred_dates_times', label: 'Preferred Dates/Times' },
            { name: 'preferred_contact_method', label: 'Preferred Contact Method' }
          ]}
        />
      </Section>
    </>
  );
}

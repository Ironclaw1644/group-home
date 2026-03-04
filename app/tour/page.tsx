import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { LeadForm } from '@/components/lead-form';
import { Section } from '@/components/ui';

export const metadata = buildMetadata({ title: 'Request a Tour | At Home Family Services, LLC', path: '/tour', description: 'Request an in-person or phone tour and share your preferred dates/times.' });

export default function TourPage() {
  return (
    <>
      <PageHero title="Request a tour" description="Choose an in-person or phone tour and share a few preferred date/time windows." breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Tour' }]} />
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

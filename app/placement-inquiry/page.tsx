import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { LeadForm } from '@/components/lead-form';
import { Section, Card } from '@/components/ui';

export const metadata = buildMetadata({ title: 'Placement Inquiry | At Home Family Services, LLC', path: '/placement-inquiry', description: 'Submit a placement inquiry for supportive living services in North Chesterfield, VA.' });

export default function PlacementInquiryPage() {
  return (
    <>
      <PageHero title="Placement inquiry" description="Share basic information and broad support needs. Please do not submit private medical details online." breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Placement Inquiry' }]} />
      <Section title="Tell us about the placement need" description="We will follow up to discuss fit, availability, and next steps.">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <LeadForm
            leadType="placement"
            title="Placement Inquiry Form"
            description="Please do not submit private medical details. We’ll discuss specifics by phone."
            successRedirect="/placement-inquiry/success"
            noteWarning="Please do not submit private medical details. We’ll discuss specifics by phone."
            extraFields={[
              { name: 'timeframe', label: 'Timeframe', type: 'select', required: true, options: ['ASAP', '1-2 weeks', '30 days', 'exploring'] },
              { name: 'city_state', label: 'City / State', required: true },
              { name: 'age_range', label: 'Age range', required: true, placeholder: 'Example: 18-25' },
              { name: 'support_level', label: 'Support level', type: 'select', required: true, options: ['light', 'moderate', 'high', 'unsure'] },
              { name: 'mobility_needs', label: 'Mobility needs (broad)' },
              { name: 'coverage_type', label: 'Coverage type', type: 'select', required: true, options: ['Medicaid waiver', 'private pay', 'other', 'unsure'] },
              { name: 'wants_tour_or_call', label: 'Would you like a tour or call?', type: 'select', required: true, options: ['tour', 'call', 'either'] },
              { name: 'preferred_contact_method', label: 'Preferred contact method', type: 'select', required: true, options: ['phone', 'email', 'text'] },
              { name: 'notes', label: 'Notes', type: 'textarea', helperText: 'Please do not submit private medical details. We will discuss specifics by phone.' }
            ]}
            summaryLeadLabel="Placement Inquiry"
            summaryFields={[
              { name: 'contact_name', label: 'Name' },
              { name: 'contact_email', label: 'Email' },
              { name: 'contact_phone', label: 'Phone' },
              { name: 'timeframe', label: 'Timeframe' },
              { name: 'city_state', label: 'Location' },
              { name: 'age_range', label: 'Age Range' },
              { name: 'support_level', label: 'Support Level' },
              { name: 'mobility_needs', label: 'Mobility Needs (broad)', fallback: 'Not provided' },
              { name: 'coverage_type', label: 'Coverage Type' },
              { name: 'wants_tour_or_call', label: 'Tour/Call Preference' },
              { name: 'preferred_contact_method', label: 'Preferred Contact Method' }
            ]}
          />
          <div className="space-y-4">
            <Card><h3 className="font-semibold">What happens next</h3><ol className="mt-3 space-y-2 text-sm text-brand-slate"><li>1. We review your inquiry</li><li>2. We contact you for a screening call</li><li>3. We discuss tour options and next steps</li></ol></Card>
            <Card><h3 className="font-semibold">Privacy reminder</h3><p className="mt-3 text-sm leading-7 text-brand-slate">Online forms are for basic contact and screening information only. Please do not include private medical details.</p></Card>
          </div>
        </div>
      </Section>
    </>
  );
}

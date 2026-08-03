import Link from 'next/link';
import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { LeadForm } from '@/components/lead-form';
import { Section, Card } from '@/components/ui';

export const metadata = buildMetadata({ title: 'Start a Placement Inquiry | Adult Group Home, VA', path: '/placement-inquiry', description: 'Tell us the timeframe, support level, and coverage type and we will follow up about availability at our North Chesterfield home. No private medical details needed.' });

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
              { name: 'age_range', label: 'Age', type: 'number', required: true, min: 18, max: 90, placeholder: '18' },
              { name: 'support_level', label: 'Support level', type: 'select', required: true, options: ['light', 'moderate', 'high', 'unsure'] },
              { name: 'mobility_needs', label: 'Mobility needs (broad)' },
              { name: 'coverage_type', label: 'Coverage type', type: 'select', required: true, options: ['Medicaid waiver', 'private pay', 'other', 'unsure'] },
              { name: 'wants_tour_or_call', label: 'Would you like a tour or call?', type: 'select', required: true, options: ['tour', 'call', 'either'] },
              { name: 'preferred_contact_method', label: 'Preferred contact method', type: 'select', required: true, options: ['phone', 'email', 'text'] },
              { name: 'subscribe_updates', label: 'Email updates', type: 'checkbox', placeholder: 'I would like occasional updates and announcements by email (optional).' },
              { name: 'notes', label: 'Notes', type: 'textarea', helperText: 'Please do not submit private medical details. We will discuss specifics by phone.' }
            ]}
            summaryLeadLabel="Placement Inquiry"
            summaryFields={[
              { name: 'contact_name', label: 'Name' },
              { name: 'contact_email', label: 'Email' },
              { name: 'contact_phone', label: 'Phone' },
              { name: 'timeframe', label: 'Timeframe' },
              { name: 'city_state', label: 'Location' },
              { name: 'age_range', label: 'Age' },
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

      <Section title="What to expect after you submit" description="No obligation at any point, and no pressure from us.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold text-brand-navy">The screening call</h3>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              We follow up to talk through what you have shared. Expect questions about the level of daily support involved, how someone does in a shared household, and what coverage is likely. Approximate answers are fine — the point is to establish whether a tour is worth your time.
            </p>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              If our home is not the right environment, we will say so on that call rather than string the process out.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold text-brand-navy">What we do not need yet</h3>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              Diagnoses, medication lists, incident histories, and other private medical detail should not go into an online form. None of it is needed to decide whether to have a conversation, and it is better discussed by phone with the right people present.
            </p>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              Support coordinators submitting on a family’s behalf are welcome — note that in the form and we will include you in follow-up.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="Not ready to inquire yet?" description="Plenty of families look for months before making a move.">
        <Card>
          <p className="text-sm leading-7 text-brand-slate">
            If you are still gathering information, start with our <Link href="/requirements" className="font-semibold text-brand-teal hover:text-brand-navy">placement requirements</Link> to check basic eligibility, then read the <Link href="/faq" className="font-semibold text-brand-teal hover:text-brand-navy">FAQ</Link> and the <Link href="/resources" className="font-semibold text-brand-teal hover:text-brand-navy">placement guide</Link>. Seeing <Link href="/our-home" className="font-semibold text-brand-teal hover:text-brand-navy">the home itself</Link> often answers more than any amount of reading.
          </p>
          <p className="mt-3 text-sm leading-7 text-brand-slate">
            A <Link href="/tour" className="font-semibold text-brand-teal hover:text-brand-navy">phone tour</Link> is the lowest-commitment way to get a real sense of the place — around twenty minutes, no visit required, and no expectation that you proceed.
          </p>
        </Card>
      </Section>
    </>
  );
}

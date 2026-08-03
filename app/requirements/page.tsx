import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section, Card, Button } from '@/components/ui';

export const metadata = buildMetadata({ title: 'Group Home Placement Requirements | Adults 18+ in VA', path: '/requirements', description: 'Who qualifies: adults 18+ with a developmental disability and acceptable coverage. Medicaid waiver, private pay, and other options reviewed on a screening call.' });

export default function RequirementsPage() {
  return (
    <>
      <PageHero title="Placement requirements" description="We review each inquiry individually. These broad requirements help families and coordinators determine whether to start the placement process." breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Requirements' }]} />
      <Section title="General requirements" description="Please contact us for a screening call to confirm fit and availability.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card><h3 className="font-semibold text-brand-navy">Eligibility</h3><ul className="list-check mt-3 text-sm text-brand-slate"><li>Adult age 18+</li><li>Developmental disorder diagnosis</li><li>Support needs appropriate for our home environment</li></ul></Card>
          <Card><h3 className="font-semibold text-brand-navy">Coverage</h3><ul className="list-check mt-3 text-sm text-brand-slate"><li>Acceptable insurance/coverage required</li><li>Medicaid waiver, private pay, or other options may be discussed</li><li>Final verification occurs during intake screening</li></ul></Card>
        </div>
        <div className="mt-6 flex flex-wrap gap-3"><Button href="/placement-inquiry" trackCta="placement-inquiry">Start Placement Inquiry</Button><Button href="/faq" variant="ghost">Read FAQ</Button></div>
      </Section>
    </>
  );
}

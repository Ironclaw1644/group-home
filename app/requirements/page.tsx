import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section, Card, Button } from '@/components/ui';

export const metadata = buildMetadata({ title: 'Requirements | At Home Family Services, LLC', path: '/requirements', description: 'Review broad placement requirements and next steps before requesting a tour or placement inquiry.' });

export default function RequirementsPage() {
  return (
    <>
      <PageHero title="Placement requirements" description="We review each inquiry individually. These broad requirements help families and coordinators determine whether to start the placement process." />
      <Section title="General requirements" description="Please contact us for a screening call to confirm fit and availability.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card><h3 className="font-semibold text-brand-navy">Eligibility</h3><ul className="mt-3 space-y-2 text-sm text-brand-slate"><li>• Adult age 18+</li><li>• Developmental disorder diagnosis</li><li>• Support needs appropriate for our home environment</li></ul></Card>
          <Card><h3 className="font-semibold text-brand-navy">Coverage</h3><ul className="mt-3 space-y-2 text-sm text-brand-slate"><li>• Acceptable insurance/coverage required</li><li>• Medicaid waiver, private pay, or other options may be discussed</li><li>• Final verification occurs during intake screening</li></ul></Card>
        </div>
        <div className="mt-6 flex flex-wrap gap-3"><Button href="/placement-inquiry">Start Placement Inquiry</Button><Button href="/faq" variant="ghost">Read FAQ</Button></div>
      </Section>
    </>
  );
}

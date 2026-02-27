import Link from 'next/link';
import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section, Card, Button } from '@/components/ui';

export const metadata = buildMetadata({ title: 'Resources | At Home Family Services, LLC', path: '/resources', description: 'Helpful guidance for families and coordinators: what to expect, placement process, and tour checklist.' });

export default function ResourcesPage() {
  return (
    <>
      <PageHero title="Helpful resources for families and coordinators" description="Use these guides to prepare for a placement conversation, schedule a tour, and understand our intake approach." />
      <Section title="What to expect" description="A clear and supportive process helps everyone move faster with less stress.">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card><h3 className="font-semibold">Placement process</h3><ol className="mt-3 space-y-2 text-sm text-brand-slate"><li>1. Submit placement inquiry</li><li>2. Initial call and fit screening</li><li>3. Tour (phone or in-person)</li><li>4. Intake coordination and next steps</li></ol></Card>
          <Card><h3 className="font-semibold">Tour checklist</h3><ul className="mt-3 space-y-2 text-sm text-brand-slate"><li>• Broad support needs</li><li>• Preferred timeframe</li><li>• Coverage type questions</li><li>• Contact preferences</li></ul></Card>
          <Card><h3 className="font-semibold">Preparation tips</h3><p className="mt-3 text-sm leading-7 text-brand-slate">Share general needs and goals, not private medical details, in online forms. We can discuss specifics by phone during the screening process.</p></Card>
        </div>
        <div className="mt-6 flex flex-wrap gap-3"><Button href="/placement-inquiry">Placement Inquiry</Button><Button href="/tour" variant="ghost">Request Tour</Button><Link href="/services" className="inline-flex items-center px-2 text-sm font-semibold text-brand-teal">Browse Services</Link></div>
      </Section>
    </>
  );
}

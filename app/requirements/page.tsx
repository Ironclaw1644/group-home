import Link from 'next/link';
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

      <Section title="How we assess fit" description="Requirements are a starting point, not the whole decision.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold text-brand-navy">What we look at</h3>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              Beyond eligibility, the question is whether this particular household works for this particular person. We look at the level of daily support someone needs, how they do in a shared home with other adults, and what routines matter to them.
            </p>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              We also look at the people already living here. A placement that unsettles the household serves nobody, so fit runs in both directions.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold text-brand-navy">If we are not the right fit</h3>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              We will say so directly rather than leave you waiting. Families comparing residential options are usually working against a deadline, and a slow no is worse than a fast one.
            </p>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              If availability is the only obstacle, we will tell you that too, along with what we know about timing.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="What we do and do not provide" description="Worth being clear on before you invest time in a tour.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold text-brand-navy">We provide</h3>
            <ul className="list-check mt-3 text-sm text-brand-slate">
              <li>24/7 residential supportive living in a shared home</li>
              <li>Daily living assistance and life skills support</li>
              <li>Medication support coordinated with licensed providers</li>
              <li>Community outings and individualized support planning</li>
            </ul>
          </Card>
          <Card>
            <h3 className="font-semibold text-brand-navy">We do not provide</h3>
            <ul className="list-check mt-3 text-sm text-brand-slate">
              <li>Skilled nursing or clinical medical care on site</li>
              <li>A day-support or day-program service for non-residents</li>
              <li>Senior or memory care</li>
            </ul>
            <p className="mt-4 text-sm leading-7 text-brand-slate">
              Clinical services are coordinated with the providers already involved in a resident’s care. See <Link href="/services" className="font-semibold text-brand-teal hover:text-brand-navy">what we do provide</Link> in detail.
            </p>
          </Card>
        </div>
      </Section>
    </>
  );
}

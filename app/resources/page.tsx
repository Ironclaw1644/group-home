import Link from 'next/link';
import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section, Card, Button } from '@/components/ui';

export const metadata = buildMetadata({ title: 'Placement Guide for Families & Support Coordinators | VA', path: '/resources', description: 'What to expect when placing an adult with a developmental disability: the four-step placement process, a tour checklist, and what to share in a first inquiry.' });

export default function ResourcesPage() {
  return (
    <>
      <PageHero title="Helpful resources for families and coordinators" description="Use these guides to prepare for a placement conversation, schedule a tour, and understand our intake approach." breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Resources' }]} />
      <Section title="What to expect" description="A clear and supportive process helps everyone move faster with less stress.">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card><h3 className="font-semibold">Placement process</h3><ol className="mt-3 space-y-2 text-sm text-brand-slate"><li>1. Submit placement inquiry</li><li>2. Initial call and fit screening</li><li>3. Tour (phone or in-person)</li><li>4. Intake coordination and next steps</li></ol></Card>
          <Card><h3 className="font-semibold">Tour checklist</h3><ul className="list-check mt-3 text-sm text-brand-slate"><li>Broad support needs</li><li>Preferred timeframe</li><li>Coverage type questions</li><li>Contact preferences</li></ul></Card>
          <Card><h3 className="font-semibold">Preparation tips</h3><p className="mt-3 text-sm leading-7 text-brand-slate">Share general needs and goals, not private medical details, in online forms. We can discuss specifics by phone during the screening process.</p></Card>
        </div>
        <div className="mt-6 flex flex-wrap gap-3"><Button href="/placement-inquiry">Placement Inquiry</Button><Button href="/tour" variant="ghost">Request Tour</Button><Link href="/services" className="inline-flex items-center px-2 text-sm font-semibold text-brand-teal">Browse Services</Link></div>
      </Section>

      <Section title="The placement process in detail" description="Four steps, and roughly what each one involves.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold text-brand-navy">1. The inquiry</h3>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              A short form covering timeframe, broad support level, and coverage type. It is deliberately light: enough for us to tell whether a conversation makes sense, and no private medical detail. Most families complete it in a few minutes.
            </p>
            <h3 className="mt-5 font-semibold text-brand-navy">2. The screening call</h3>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              We talk through daily support needs, what a good day and a hard day look like, and what the household would need to accommodate. This is also where coverage questions get real answers rather than general ones.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold text-brand-navy">3. The tour</h3>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              By phone or in person. You see the home, meet staff, and ask the questions that are hard to settle over email. Support coordinators are welcome to join. See <Link href="/tour" className="font-semibold text-brand-teal hover:text-brand-navy">what a tour covers</Link>.
            </p>
            <h3 className="mt-5 font-semibold text-brand-navy">4. Intake and transition</h3>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              If it is a fit, we cover what a resident brings, which routines carry over, who needs to be kept informed, and how the first few weeks are paced. The goal is for move-in to feel steady rather than abrupt.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="Comparing homes" description="Useful whether or not you choose us.">
        <Card>
          <p className="text-sm leading-7 text-brand-slate">
            Most families we speak to are considering several residential options at once, and the homes rarely differ on the things brochures emphasize. What actually separates them is staffing consistency, how communication works when something changes, and whether the household composition suits the person moving in.
          </p>
          <p className="mt-3 text-sm leading-7 text-brand-slate">
            Ask every home the same questions and compare the answers side by side. Ask what would make their home the wrong fit — a provider who cannot answer that has not thought carefully about fit. And ask how quickly they will tell you no, because a slow no costs you weeks you may not have.
          </p>
          <p className="mt-3 text-sm leading-7 text-brand-slate">
            Our <Link href="/requirements" className="font-semibold text-brand-teal hover:text-brand-navy">placement requirements</Link> set out plainly who we can and cannot support, and the <Link href="/faq" className="font-semibold text-brand-teal hover:text-brand-navy">FAQ</Link> answers what families ask most often.
          </p>
        </Card>
      </Section>
    </>
  );
}

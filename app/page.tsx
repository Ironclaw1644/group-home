import Link from 'next/link';
import Image from 'next/image';
import { PageHero } from '@/components/page-hero';
import { Section, Card, Button, Badge } from '@/components/ui';
import { AnnouncementList } from '@/components/announcement-list';
import { business } from '@/lib/content';
import { Reveal } from '@/components/reveal';
import { getAnnouncements } from '@/lib/announcements';

const homeHighlights = [
  {
    id: 'ahfs-home-2',
    src: '/images/ahfs/AHFS_home_2.webp',
    alt: 'Caregiver supporting resident'
  },
  {
    id: 'ahfs-home-3',
    src: '/images/ahfs/AHFS_home_3.webp',
    alt: 'Care professional meeting with family'
  },
  {
    id: 'ahfs-home-4',
    src: '/images/ahfs/AHFS_home_4.webp',
    alt: 'Caregiver and resident walking outdoors'
  }
] as const;

// Prerendered and refreshed every 5 minutes rather than rebuilt per request, so
// the highest-traffic page serves from cache. Admin publishes call
// revalidatePath('/'), so new announcements still show up immediately.
export const revalidate = 300;

export default async function HomePage() {
  const announcements = await getAnnouncements({ currentPath: '/', limit: 3 });
  const heroTitle = 'A warm, supportive home built on dignity, trust, and daily care.';
  const heroSubtitle = 'Residential disability services and 24/7 supportive living for adults with developmental disabilities in North Chesterfield, Virginia.';
  const heroCta = 'Start a Placement Inquiry';
  return (
    <>
      <PageHero
        title={heroTitle}
        description={heroSubtitle}
        actions={
          <>
            <Button href="/placement-inquiry" trackCta="placement-inquiry">{heroCta}</Button>
            <Button href="/tour" variant="ghost" trackCta="request-tour">Request a Tour</Button>
            <Button href={business.phoneHref} variant="secondary" trackCta="call">Call {business.phone}</Button>
          </>
        }
      />

      <section className="container-shell pb-6">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white shadow-card">
            <Image
              src="/images/home/AHFS_home_1.webp"
              alt="Supportive living environment with compassionate caregiver in a warm residential setting"
              width={1600}
              height={900}
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="h-full min-h-[260px] w-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <Reveal>
              <Card>
                <Badge>Our Mission</Badge>
                <p className="mt-3 text-sm leading-7 text-brand-slate">We provide a warm, nurturing home with compassion, attention to detail, and high-quality daily living support that promotes independence, dignity, and wellbeing.</p>
              </Card>
            </Reveal>
            <Reveal delayMs={70}>
              <Card>
                <Badge>Core Values</Badge>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm font-semibold text-brand-navy">
                  <span className="rounded-xl bg-brand-sand px-3 py-2">Passion</span>
                  <span className="rounded-xl bg-brand-sand px-3 py-2">Respect</span>
                  <span className="rounded-xl bg-brand-sand px-3 py-2">Trust</span>
                  <span className="rounded-xl bg-brand-sand px-3 py-2">Integrity</span>
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      <Section title="What families and coordinators can expect" eyebrow="Supportive Living" description="A clean, modern home environment with trained direct support professionals and individualized daily support.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            '24/7 supportive living services',
            'Trained direct support professionals',
            'Daily routines and life skills support',
            'Compassionate communication with families'
          ].map((item) => (
            <Card key={item}><p className="text-sm font-medium text-brand-navy">{item}</p></Card>
          ))}
        </div>
      </Section>

      <Section title="Home highlights" description="Three bedrooms, 2.5 bath, updated appliances, modern hardwood flooring, and a backyard/outdoor wellness space.">
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {homeHighlights.map((img) => (
              <Card key={img.id} className="overflow-hidden p-0">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={1000}
                  height={700}
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-52 w-full object-cover"
                />
              </Card>
            ))}
          </div>
        </Reveal>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/our-home" variant="ghost" trackCta="view-our-home">View Our Home</Button>
          <Button href="/requirements" variant="secondary" trackCta="review-requirements">Review Requirements</Button>
        </div>
      </Section>

      <Section title="Who we support" description="Adults 18+ with intellectual and developmental disabilities, in a shared residential home.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <p className="text-sm leading-7 text-brand-slate">
              We are a small residential home rather than a large facility, which shapes almost everything about how support works here. Residents see the same staff regularly, know the people they live with, and follow routines built around them individually rather than around a building-wide schedule.
            </p>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              Support is documented in an <Link href="/services/individualized-support-plans" className="font-semibold text-brand-teal hover:text-brand-navy">individualized support plan</Link> and adjusted as circumstances change, so the level of help someone receives reflects where they are now rather than where they were at intake.
            </p>
          </Card>
          <Card>
            <p className="text-sm leading-7 text-brand-slate">
              Families and support coordinators are part of the picture throughout. We are used to working alongside case teams, being one of several homes under consideration, and being straightforward when our environment is not the right fit for the support level being described.
            </p>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              Check <Link href="/requirements" className="font-semibold text-brand-teal hover:text-brand-navy">placement requirements</Link> for eligibility and coverage, or read how the <Link href="/resources" className="font-semibold text-brand-teal hover:text-brand-navy">placement process</Link> works from first inquiry through move-in.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="Current announcements" description="Updates about tours, openings, and scheduling.">
        <Reveal>
          <AnnouncementList announcements={announcements} />
        </Reveal>
        <div className="mt-4"><Link href="/announcements" className="text-sm font-semibold text-brand-teal hover:text-brand-navy">See all announcements</Link></div>
      </Section>
    </>
  );
}

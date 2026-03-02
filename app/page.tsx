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
    src: '/images/ahfs/AHFS_home_2.png',
    alt: 'Caregiver supporting resident'
  },
  {
    id: 'ahfs-home-3',
    src: '/images/ahfs/AHFS_home_3.png',
    alt: 'Care professional meeting with family'
  },
  {
    id: 'ahfs-home-4',
    src: '/images/ahfs/AHFS_home_4.png',
    alt: 'Caregiver and resident walking outdoors'
  }
] as const;

export default async function HomePage() {
  const announcements = await getAnnouncements({ currentPath: '/', limit: 3 });
  const heroTitle = 'A warm, supportive home built on dignity, trust, and daily care.';
  const heroSubtitle = '24/7 supportive living services for adults with developmental disabilities in North Chesterfield, Virginia.';
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
                <Image src={img.src} alt={img.alt} width={1000} height={700} className="h-52 w-full object-cover" />
              </Card>
            ))}
          </div>
        </Reveal>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/our-home" variant="ghost" trackCta="view-our-home">View Our Home</Button>
          <Button href="/requirements" variant="secondary" trackCta="review-requirements">Review Requirements</Button>
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

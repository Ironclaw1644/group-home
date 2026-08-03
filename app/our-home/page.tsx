import Link from 'next/link';
import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section, Card, Button } from '@/components/ui';
import { OurHomeCarousel } from '@/components/our-home-carousel';
import { Reveal } from '@/components/reveal';

export const metadata = buildMetadata({ title: 'See Our Group Home in North Chesterfield, VA | Photos', path: '/our-home', description: 'Photos of the living spaces, bedrooms, and outdoor area of our North Chesterfield group home for adults with developmental disabilities. Tours available.' });

const ourHomeSlides = [
  {
    src: '/images/our-home/AHFS_our_home_house.webp',
    alt: 'Exterior of our home'
  },
  {
    src: '/images/our-home/AHFS_our_home_living_room.webp',
    alt: 'Comfortable living room'
  },
  {
    src: '/images/our-home/AHFS_dining_room.webp',
    alt: 'Dining room'
  },
  {
    src: '/images/our-home/AHFS_our_home_bed_1.webp',
    alt: 'Bedroom with twin beds'
  },
  {
    src: '/images/our-home/AHFS_our_home_bed_2.webp',
    alt: 'Bedroom interior'
  },
  {
    src: '/images/our-home/AHFS_our_home_bed_3.webp',
    alt: 'Bedroom interior'
  }
] as const;

export default async function OurHomePage() {
  return (
    <>
      <PageHero title="A comfortable, modern home environment" description="Our home is designed to support daily routines, calm living, and quality of life. Families can request a tour to learn more about the environment and support approach." breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Our Home' }]} />
      <Section title="Home amenities" description="Features families often ask about during placement and tour calls.">
        <Reveal>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {['3 bedrooms', '2.5 bathrooms', 'Updated appliances', 'Modern hardwood flooring', 'Backyard wellness space', 'Structured routines', 'Clean shared spaces', 'Support-focused environment'].map((item) => (
              <Card key={item}><p className="text-sm font-medium text-brand-navy">{item}</p></Card>
            ))}
          </div>
        </Reveal>
        <Reveal className="mt-6">
          <OurHomeCarousel slides={ourHomeSlides} />
        </Reveal>
        <div className="mt-6 flex gap-3"><Button href="/tour">Request a Tour</Button><Button href="/placement-inquiry" variant="ghost">Placement Inquiry</Button></div>
      </Section>

      <Section title="About the home" description="A residential house on Clovis Street in North Chesterfield — not a facility.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold text-brand-navy">The spaces</h3>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              Three bedrooms and two and a half bathrooms, with updated appliances and modern hardwood flooring throughout. Shared living and dining areas are where most of the day happens — meals, conversation, television, and the ordinary business of a household.
            </p>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              The backyard gives residents outdoor space that does not require going anywhere, which matters on days when a full outing is more than someone wants.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold text-brand-navy">Living here</h3>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              Because it is a small home rather than a large facility, residents see the same staff regularly and know the people they live with. Shared spaces are kept clean and organized, and bedrooms are a resident’s own — personal items, photographs, and preferences included.
            </p>
            <p className="mt-3 text-sm leading-7 text-brand-slate">
              Day-to-day support follows each resident’s <Link href="/services/individualized-support-plans" className="font-semibold text-brand-teal hover:text-brand-navy">individualized support plan</Link>, so two people in the same house may have quite different routines.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="The area" description="North Chesterfield, within reach of the wider Richmond region.">
        <Card>
          <p className="text-sm leading-7 text-brand-slate">
            The home sits in a residential part of North Chesterfield, Virginia, close enough to Richmond, Chesterfield County, Midlothian, and Colonial Heights that family visits stay practical rather than becoming an expedition. For many families that proximity is the deciding factor: a placement an hour away gets visited far less often than one twenty minutes away, however good the home.
          </p>
          <p className="mt-3 text-sm leading-7 text-brand-slate">
            Everyday errands, appointments, and recreation happen locally, which keeps <Link href="/services/community-outings" className="font-semibold text-brand-teal hover:text-brand-navy">community outings</Link> routine rather than exceptional. See the <Link href="/locations" className="font-semibold text-brand-teal hover:text-brand-navy">areas we serve</Link> for local details.
          </p>
        </Card>
      </Section>
    </>
  );
}

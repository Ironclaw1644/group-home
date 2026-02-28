import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section, Card, Button } from '@/components/ui';
import { OurHomeCarousel } from '@/components/our-home-carousel';
import { Reveal } from '@/components/reveal';

export const metadata = buildMetadata({ title: 'Our Home | At Home Family Services, LLC', path: '/our-home', description: 'View our home amenities, living spaces, and supportive environment in North Chesterfield, VA.' });
export const dynamic = 'force-dynamic';

const ourHomeSlides = [
  {
    src: '/images/our-home/AHFS_our_home_house.png',
    alt: 'Exterior of our home'
  },
  {
    src: '/images/our-home/AHFS_our_home_living_room.png',
    alt: 'Comfortable living room'
  },
  {
    src: '/images/our-home/AHFS_dining_room.png',
    alt: 'Dining room'
  },
  {
    src: '/images/our-home/AHFS_our_home_bed_1.png',
    alt: 'Bedroom with twin beds'
  },
  {
    src: '/images/our-home/AHFS_our_home_bed_2.png',
    alt: 'Bedroom interior'
  },
  {
    src: '/images/our-home/AHFS_our_home_bed_3.png',
    alt: 'Bedroom interior'
  }
] as const;

export default async function OurHomePage() {
  return (
    <>
      <PageHero title="A comfortable, modern home environment" description="Our home is designed to support daily routines, calm living, and quality of life. Families can request a tour to learn more about the environment and support approach." />
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
    </>
  );
}

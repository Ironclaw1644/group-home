import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section, Card, Button } from '@/components/ui';
import { SiteImageGrid } from '@/components/site-image-grid';
import { dbGet } from '@/lib/storage';

export const metadata = buildMetadata({ title: 'Our Home | At Home Family Services, LLC', path: '/our-home', description: 'View our home amenities, living spaces, and supportive environment in North Chesterfield, VA.' });
export const dynamic = 'force-dynamic';

export default async function OurHomePage() {
  const gallery = await dbGet('gallery');
  const ourHomeImages = gallery.filter((img) => img.section === 'our-home');
  const images = ourHomeImages.length ? ourHomeImages : gallery;
  return (
    <>
      <PageHero title="A comfortable, modern home environment" description="Our home is designed to support daily routines, calm living, and quality of life. Families can request a tour to learn more about the environment and support approach." />
      <Section title="Home amenities" description="Features families often ask about during placement and tour calls.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {['3 bedrooms', '2.5 bathrooms', 'Updated appliances', 'Modern hardwood flooring', 'Backyard wellness space', 'Structured routines', 'Clean shared spaces', 'Support-focused environment'].map((item) => (
            <Card key={item}><p className="text-sm font-medium text-brand-navy">{item}</p></Card>
          ))}
        </div>
        <div className="mt-6">
          <SiteImageGrid images={images.slice(0, 6)} />
        </div>
        <div className="mt-6 flex gap-3"><Button href="/tour">Request a Tour</Button><Button href="/placement-inquiry" variant="ghost">Placement Inquiry</Button></div>
      </Section>
    </>
  );
}

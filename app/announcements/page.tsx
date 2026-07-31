import Link from 'next/link';
import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section, Card } from '@/components/ui';
import { AnnouncementList } from '@/components/announcement-list';
import { getAnnouncements } from '@/lib/announcements';

export const metadata = buildMetadata({ title: 'Announcements | At Home Family Services, LLC', path: '/announcements', description: 'Public updates, scheduling notices, and availability announcements from At Home Family Services.' });
// Rendered ahead of time and refreshed on a 5-minute cycle. Publishing from the
// admin calls revalidatePath('/announcements'), so edits still appear at once.
export const revalidate = 300;

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();
  return (
    <>
      <PageHero title="Announcements" description="Public updates about tours, scheduling, and other timely notices." breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Announcements' }]} />
      <Section title="Latest updates">
        {announcements.length ? (
          <AnnouncementList announcements={announcements} />
        ) : (
          <Card>
            <p className="text-sm leading-7 text-brand-slate">
              There are no announcements right now. For current availability and tour scheduling, <Link href="/contact" className="font-semibold text-brand-teal hover:text-brand-navy">contact us</Link> or <Link href="/tour" className="font-semibold text-brand-teal hover:text-brand-navy">request a tour</Link>.
            </p>
          </Card>
        )}
      </Section>
    </>
  );
}

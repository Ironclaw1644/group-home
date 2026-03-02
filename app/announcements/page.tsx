import { buildMetadata } from '@/lib/site';
import { PageHero } from '@/components/page-hero';
import { Section } from '@/components/ui';
import { AnnouncementList } from '@/components/announcement-list';
import { getAnnouncements } from '@/lib/announcements';

export const metadata = buildMetadata({ title: 'Announcements | At Home Family Services, LLC', path: '/announcements', description: 'Public updates, scheduling notices, and availability announcements from At Home Family Services.' });
export const dynamic = 'force-dynamic';

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();
  return (
    <>
      <PageHero title="Announcements" description="Public updates about tours, scheduling, and other timely notices." />
      <Section title="Latest updates">
        <AnnouncementList announcements={announcements} />
      </Section>
    </>
  );
}

import { dbGet } from '@/lib/storage';
import { AnnouncementItem } from '@/components/announcement-item.client';

export async function AnnouncementList({ currentPath }: { currentPath?: string }) {
  const announcements = await dbGet('announcements');
  const now = new Date();
  const active = announcements
    .filter((a) => a.active)
    .filter((a) => !a.start_date || new Date(a.start_date) <= now)
    .filter((a) => !a.end_date || new Date(a.end_date) >= now)
    .filter((a) => !currentPath || a.target_pages.length === 0 || a.target_pages.includes(currentPath))
    .sort((a, b) => a.priority - b.priority);

  if (!active.length) return null;

  return (
    <div className="space-y-3">
      {active.map((item) => (
        <AnnouncementItem key={item.id} id={item.id} title={item.title} body={item.body} />
      ))}
    </div>
  );
}

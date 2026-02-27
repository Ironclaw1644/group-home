import { dbGet } from '@/lib/storage';
import { Card } from '@/components/ui';

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
        <Card key={item.id} className="border-brand-teal/15">
          <p className="text-sm font-semibold text-brand-navy">{item.title}</p>
          <p className="mt-2 text-sm leading-7 text-brand-slate">{item.body}</p>
        </Card>
      ))}
    </div>
  );
}

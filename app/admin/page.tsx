import { redirect } from 'next/navigation';
import { requireAdminEmail } from '@/lib/auth';
import { dbGet } from '@/lib/storage';
import { AdminDashboard } from '@/components/admin-dashboard';
import { buildMetadata } from '@/lib/site';

export const metadata = buildMetadata({ title: 'Admin Dashboard | At Home Family Services, LLC', path: '/admin', description: 'Manage leads, announcements, page content, gallery, subscribers, and activity reports.' });

export default async function AdminPage() {
  const email = await requireAdminEmail();
  if (!email) redirect('/admin/login');

  try {
    const [announcements, pages, gallery, subscribers] = await Promise.all([
      dbGet('announcements'),
      dbGet('pages'),
      dbGet('gallery'),
      dbGet('subscribers')
    ]);

    return <AdminDashboard adminEmail={email} initial={{ announcements, pages, gallery, subscribers }} />;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load admin CMS data';
    if (message.toLowerCase().includes('unauthorized')) {
      redirect('/admin/login?error=unauthorized');
    }

    return (
      <AdminDashboard
        adminEmail={email}
        initial={{ announcements: [], pages: [], gallery: [], subscribers: [] }}
        initialLoadError={message}
      />
    );
  }
}

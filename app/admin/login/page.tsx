import { buildMetadata } from '@/lib/site';
import { AdminLoginForm } from '@/app/admin/login/login-form';

export const metadata = buildMetadata({ title: 'Admin Login | At Home Family Services, LLC', path: '/admin/login', description: 'Secure admin login for At Home Family Services dashboard.' });

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith('/admin') ? params.next : '/admin';

  let initialError = '';
  if (params.error === 'session') initialError = 'Please sign in to continue.';
  if (params.error === 'unauthorized') initialError = 'Your session is not valid. Please sign in again.';

  return <AdminLoginForm nextPath={nextPath} initialError={initialError} />;
}

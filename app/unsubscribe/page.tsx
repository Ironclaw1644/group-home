import { UnsubscribeClient } from '@/app/unsubscribe/unsubscribe-client';
import { buildMetadata } from '@/lib/site';

export const metadata = buildMetadata({ title: 'Unsubscribe | At Home Family Services, LLC', path: '/unsubscribe', description: 'Manage your email preferences for At Home Family Services updates.', noIndex: true });

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  return (
    // The root layout already renders <main>; a second one here was invalid markup.
    <div className="container-shell py-16">
      <UnsubscribeClient token={params.token || ''} />
    </div>
  );
}

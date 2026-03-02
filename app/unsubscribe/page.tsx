import { UnsubscribeClient } from '@/app/unsubscribe/unsubscribe-client';

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="container-shell py-16">
      <UnsubscribeClient token={params.token || ''} />
    </main>
  );
}

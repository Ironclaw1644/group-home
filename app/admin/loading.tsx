import { LoadingLogo } from '@/components/loading-logo';

// Scoped to /admin: the dashboard is the one route that is server-rendered per
// request and heavy enough to have a real wait. A root-level loading.tsx would
// put every static marketing page behind a Suspense boundary, shipping the
// spinner ahead of the content in the prerendered HTML.
export default function AdminLoading() {
  return <LoadingLogo label="Loading dashboard" />;
}

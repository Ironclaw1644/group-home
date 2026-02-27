import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/api-auth';
import { createClient } from '@supabase/supabase-js';
import { getCmsSchema } from '@/lib/supabase/cmsServer';

function parseProjectRef(url?: string) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname;
    if (host.endsWith('.supabase.co')) {
      return host.replace('.supabase.co', '');
    }
    return host;
  } catch {
    return null;
  }
}

function maskKey(key?: string) {
  if (!key) return null;
  if (key.length <= 8) return '***';
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const cmsUrl = process.env.CMS_SUPABASE_URL;
  const cmsKey = process.env.CMS_SUPABASE_SERVICE_ROLE_KEY;
  const schema = getCmsSchema();

  const diagnostics: Record<string, unknown> = {
    env: {
      cms_url_present: Boolean(cmsUrl),
      cms_service_key_present: Boolean(cmsKey),
      cms_service_key_masked: maskKey(cmsKey),
      cms_schema: schema,
      cms_project_ref: parseProjectRef(cmsUrl)
    }
  };

  if (!cmsUrl || !cmsKey) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Missing CMS_SUPABASE_URL or CMS_SUPABASE_SERVICE_ROLE_KEY',
        diagnostics
      },
      { status: 500 }
    );
  }

  try {
    const client = createClient(cmsUrl, cmsKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    }).schema(schema);

    const announcementsResult = await client.from('announcements').select('id', { count: 'exact', head: true }).limit(1);

    diagnostics.tests = {
      announcements_head_select: {
        ok: !announcementsResult.error,
        count: announcementsResult.count ?? null,
        error: announcementsResult.error
          ? {
              message: announcementsResult.error.message,
              details: announcementsResult.error.details,
              hint: announcementsResult.error.hint,
              code: announcementsResult.error.code
            }
          : null
      }
    };

    return NextResponse.json({
      ok: !announcementsResult.error,
      diagnostics
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        diagnostics
      },
      { status: 500 }
    );
  }
}

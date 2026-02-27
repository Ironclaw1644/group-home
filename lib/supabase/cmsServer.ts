import 'server-only';

import { createClient } from '@supabase/supabase-js';
import type { Database, CmsSchemaName } from '@/lib/supabase/cms.types';

function getEnv(name: 'CMS_SUPABASE_URL' | 'CMS_SUPABASE_SERVICE_ROLE_KEY' | 'CMS_SCHEMA') {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

export function getCmsSchema(): CmsSchemaName {
  const schema = (process.env.CMS_SCHEMA || 'athome_family_services_llc').trim();
  if (schema !== 'athome_family_services_llc') {
    throw new Error(`Invalid CMS_SCHEMA: ${schema}. Expected athome_family_services_llc`);
  }
  return schema;
}

export function cmsServerClient() {
  const url = getEnv('CMS_SUPABASE_URL');
  const serviceRole = getEnv('CMS_SUPABASE_SERVICE_ROLE_KEY');
  const schema = getCmsSchema();
  const client = createClient<Database>(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  return client.schema(schema);
}

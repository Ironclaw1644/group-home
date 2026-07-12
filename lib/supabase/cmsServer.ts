import 'server-only';

import { createClient } from '@supabase/supabase-js';
import type { Database, CmsSchemaName } from '@/lib/supabase/cms.types';

const DEFAULT_SCHEMA = 'athome_family_services_llc';
const ALLOWED_SCHEMAS: readonly CmsSchemaName[] = [DEFAULT_SCHEMA, 'demo_athome'];

/** True when the app is running in demo mode (synthetic admin, demo_athome schema, stubbed email). */
export const IS_DEMO = process.env.DEMO_MODE === '1';

/**
 * The Supabase schema every CMS read/write targets. Centralized here so nothing
 * else hardcodes a schema literal. In demo mode SUPABASE_SCHEMA=demo_athome swaps
 * the whole app onto the throwaway clone; production leaves it unset (or set to the
 * canonical name via the legacy CMS_SCHEMA var) and falls back to the default.
 */
export const AHFS_SCHEMA: CmsSchemaName = ((
  process.env.SUPABASE_SCHEMA ||
  process.env.CMS_SCHEMA ||
  DEFAULT_SCHEMA
).trim()) as CmsSchemaName;

function getEnv(name: 'CMS_SUPABASE_URL' | 'CMS_SUPABASE_SERVICE_ROLE_KEY') {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

export function getCmsSchema(): CmsSchemaName {
  if (!ALLOWED_SCHEMAS.includes(AHFS_SCHEMA)) {
    throw new Error(`Invalid schema: ${AHFS_SCHEMA}. Expected one of ${ALLOWED_SCHEMAS.join(', ')}`);
  }
  return AHFS_SCHEMA;
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

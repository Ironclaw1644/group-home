import { assertTopLevelLead } from '@/lib/forms';

function envRequired(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

const REQUIRED_ENV_VARS = ['LEADOPS_API_ROUTE', 'LEADOPS_TOKEN', 'LEADOPS_SOURCE'] as const;

export function getMissingLeadOpsEnvVars() {
  return REQUIRED_ENV_VARS.filter((key) => !process.env[key]?.trim());
}

export async function forwardLead(body: unknown, extra?: Record<string, unknown>) {
  const payload = assertTopLevelLead(body);
  const route = envRequired('LEADOPS_API_ROUTE');
  if (!/^https:\/\//i.test(route)) {
    throw new Error('LeadOps forward_skipped — LEADOPS_API_ROUTE must be a full https URL');
  }
  const token = envRequired('LEADOPS_TOKEN');
  const source = envRequired('LEADOPS_SOURCE');

  const requestBody = {
    source,
    ...payload,
    ...(extra || {})
  };

  const res = await fetch(route, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(requestBody),
    cache: 'no-store'
  });

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('LeadOps auth failed — check LEADOPS_TOKEN in Vercel');
    }
    throw new Error(`LeadOps submit failed (${res.status}). Check LeadOps route and credentials.`);
  }

  return data;
}

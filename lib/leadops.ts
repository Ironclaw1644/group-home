import { assertTopLevelLead } from '@/lib/forms';

function envRequired(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export async function forwardLead(body: unknown) {
  const payload = assertTopLevelLead(body);
  const route = envRequired('LEADOPS_API_ROUTE');
  const token = envRequired('LEADOPS_TOKEN');
  const source = process.env.LEADOPS_SOURCE || 'athome-family-services-llc';

  const res = await fetch(route, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ ...payload, source_key: source }),
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
    throw new Error(`LeadOps submit failed (${res.status}): ${text.slice(0, 500)}`);
  }

  return data;
}

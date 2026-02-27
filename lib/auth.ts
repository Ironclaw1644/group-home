const COOKIE_NAME = 'admin_email';

export function parseAdminAllowlist(raw?: string | null) {
  return (raw || '')
    .split(/[\n\r,]+/)
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
}

export function adminAllowlist() {
  return parseAdminAllowlist(process.env.ADMIN_ALLOWLIST);
}

export function isAllowedAdminEmail(email?: string | null) {
  if (!email) return false;
  const allow = adminAllowlist();
  return allow.includes(email.trim().toLowerCase());
}

export async function getAdminSessionEmail() {
  const { cookies } = await import('next/headers');
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value || null;
}

export async function requireAdminEmail() {
  const email = await getAdminSessionEmail();
  if (!isAllowedAdminEmail(email)) return null;
  return email;
}

export const adminCookieName = COOKIE_NAME;

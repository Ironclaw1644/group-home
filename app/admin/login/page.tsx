import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { adminAllowlist, adminCookieName } from '@/lib/auth';
import { buildMetadata } from '@/lib/site';

export const metadata = buildMetadata({ title: 'Admin Login | At Home Family Services, LLC', path: '/admin/login', description: 'Admin login for At Home Family Services dashboard.' });

async function login(formData: FormData) {
  'use server';
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const allow = adminAllowlist();
  if (!allow.includes(email)) {
    redirect('/admin/login?error=unauthorized');
  }
  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, email, { httpOnly: true, sameSite: 'lax', secure: true, path: '/' });
  const next = String(formData.get('next') || '/admin');
  redirect(next.startsWith('/admin') ? next : '/admin');
}

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;
  return (
    <div className="container-shell py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-white/80 bg-white p-6 shadow-card">
        <div className="mb-3 flex items-center gap-3">
          <Image
            src="/brand/logo.png"
            alt="At Home Family Services, LLC"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-contain"
            priority
          />
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-brand-slate">At Home Family Services, LLC</p>
        </div>
        <h1 className="text-2xl font-semibold text-brand-navy">Admin Login</h1>
        <p className="mt-2 text-sm text-brand-slate">Use an allowlisted admin email. Configure `ADMIN_ALLOWLIST` in the environment.</p>
        {params.error ? <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">Email is not in the admin allowlist.</p> : null}
        <form action={login} className="mt-5 space-y-4">
          <input type="hidden" name="next" value={params.next || '/admin'} />
          <label className="block text-sm font-medium text-brand-navy">Email
            <input name="email" type="email" required className="mt-1 w-full rounded-xl border border-brand-navy/10 px-3 py-2.5 text-sm" />
          </label>
          <button type="submit" className="w-full rounded-xl bg-brand-navy px-4 py-3 text-sm font-semibold text-white">Continue</button>
        </form>
        <p className="mt-4 text-xs text-brand-slate">Supabase client helpers are scaffolded in `lib/supabase/` if you want to upgrade this login to hosted auth later.</p>
      </div>
    </div>
  );
}

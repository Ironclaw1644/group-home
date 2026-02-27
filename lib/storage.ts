import 'server-only';

import { randomUUID } from 'crypto';
import { imageReferences } from '@/lib/content';
import { cmsServerClient } from '@/lib/supabase/cmsServer';
import type { Database } from '@/lib/supabase/cms.types';
import type { Announcement, GalleryImage, LeadNote, LocalLead, PageBlock, Subscriber } from '@/lib/types';

type CmsTables = Database['athome_family_services_llc']['Tables'];

type DbShape = {
  announcements: Announcement[];
  pages: PageBlock[];
  gallery: GalleryImage[];
  subscribers: Subscriber[];
  leadNotes: LeadNote[];
};

const seedGuards = new Map<keyof DbShape, Promise<void>>();

function nowIso() {
  return new Date().toISOString();
}

function assertNoError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

function mapAnnouncement(row: CmsTables['announcements']['Row']): Announcement {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    active: row.active,
    start_date: row.start_date || '',
    end_date: row.end_date || '',
    target_pages: row.target_pages || [],
    priority: row.priority || 0,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

function mapPage(row: CmsTables['pages']['Row']): PageBlock {
  return {
    key: row.key,
    label: row.label,
    value: row.value,
    updated_at: row.updated_at
  };
}

function mapGallery(row: CmsTables['gallery']['Row']): GalleryImage {
  return {
    id: row.id,
    url: row.url,
    alt: row.alt,
    section: (row.section as GalleryImage['section']) || 'general',
    credit: row.credit || undefined
  };
}

function mapSubscriber(row: CmsTables['subscribers']['Row']): Subscriber {
  return {
    id: row.id,
    email: row.email,
    name: row.name || undefined,
    source: row.source,
    opted_in: row.opted_in,
    created_at: row.created_at
  };
}

function mapLeadNote(row: CmsTables['lead_notes']['Row']): LeadNote {
  return {
    id: row.id,
    leadId: row.lead_id,
    note: row.note,
    created_at: row.created_at
  };
}

function mapLocalLead(row: CmsTables['leads']['Row']): LocalLead {
  return {
    id: row.id,
    created_at: row.created_at,
    contact_name: row.contact_name || '',
    contact_email: row.contact_email || '',
    contact_phone: row.contact_phone || '',
    company_name: row.company_name || '',
    message: row.message || '',
    page_path: row.page_path || undefined,
    utm_source: row.utm_source || undefined,
    utm_medium: row.utm_medium || undefined,
    utm_campaign: row.utm_campaign || undefined,
    utm_term: row.utm_term || undefined,
    utm_content: row.utm_content || undefined,
    referrer: row.referrer || undefined,
    lead_type: row.lead_type || undefined,
    status: row.status || 'new',
    forwarded_to_leadops: row.forwarded_to_leadops,
    leadops_forwarded_at: row.leadops_forwarded_at || undefined,
    leadops_error: row.leadops_error || undefined
  };
}

function seedDefaults() {
  const now = nowIso();
  return {
    announcements: [
      {
        id: randomUUID(),
        title: 'Tours Available by Appointment',
        body: 'We are currently scheduling phone and in-person tours. Submit a request and we will follow up with available times.',
        active: true,
        start_date: now.slice(0, 10),
        end_date: '',
        target_pages: ['/', '/tour'],
        priority: 1,
        created_at: now,
        updated_at: now
      }
    ] satisfies Announcement[],
    pages: [
      { key: 'home.hero.title', label: 'Home Hero Title', value: 'A warm, supportive home built on dignity, trust, and daily care.', updated_at: now },
      { key: 'home.hero.cta', label: 'Home Hero CTA', value: 'Start a Placement Inquiry', updated_at: now },
      { key: 'home.hero.subtitle', label: 'Home Hero Subtitle', value: '24/7 supportive living services for adults with developmental disabilities in North Chesterfield, Virginia.', updated_at: now }
    ] satisfies PageBlock[],
    gallery: imageReferences.map((img, index) => ({
      id: randomUUID(),
      url: `${img.url}?auto=format&fit=crop&w=1200&q=80`,
      alt: img.alt,
      section: index === 2 ? 'our-home' : 'general',
      credit: img.credit
    })) satisfies GalleryImage[]
  };
}

async function ensureSeeded(key: keyof DbShape) {
  if (key === 'subscribers' || key === 'leadNotes') return;
  if (seedGuards.has(key)) return seedGuards.get(key)!;

  const promise = (async () => {
    const supabase = cmsServerClient();
    const seeds = seedDefaults();

    if (key === 'announcements') {
      const { data, error } = await supabase.from('announcements').select('id').limit(1);
      assertNoError(error);
      if (!data?.length) {
        const rows: CmsTables['announcements']['Insert'][] = seeds.announcements.map((a) => ({
          id: a.id,
          title: a.title,
          body: a.body,
          active: a.active,
          start_date: a.start_date || null,
          end_date: a.end_date || null,
          target_pages: a.target_pages,
          priority: a.priority,
          created_at: a.created_at,
          updated_at: a.updated_at
        }));
        const inserted = await supabase.from('announcements').insert(rows);
        assertNoError(inserted.error);
      }
      return;
    }

    if (key === 'pages') {
      const { data, error } = await supabase.from('pages').select('key').limit(1);
      assertNoError(error);
      if (!data?.length) {
        const rows: CmsTables['pages']['Insert'][] = seeds.pages.map((p) => ({
          key: p.key,
          label: p.label,
          value: p.value,
          updated_at: p.updated_at
        }));
        const inserted = await supabase.from('pages').insert(rows);
        assertNoError(inserted.error);
      }
      return;
    }

    if (key === 'gallery') {
      const { data, error } = await supabase.from('gallery').select('id').limit(1);
      assertNoError(error);
      if (!data?.length) {
        const rows: CmsTables['gallery']['Insert'][] = seeds.gallery.map((g) => ({
          id: g.id,
          url: g.url,
          alt: g.alt,
          section: g.section,
          credit: g.credit || null,
          created_at: nowIso()
        }));
        const inserted = await supabase.from('gallery').insert(rows);
        assertNoError(inserted.error);
      }
    }
  })().finally(() => {
    seedGuards.delete(key);
  });

  seedGuards.set(key, promise);
  return promise;
}

export async function dbGet<K extends keyof DbShape>(key: K): Promise<DbShape[K]> {
  await ensureSeeded(key);
  const supabase = cmsServerClient();

  if (key === 'announcements') {
    const { data, error } = await supabase.from('announcements').select('*').order('priority', { ascending: true }).order('created_at', { ascending: false });
    assertNoError(error);
    return ((data as CmsTables['announcements']['Row'][] | null) || []).map(mapAnnouncement) as DbShape[K];
  }

  if (key === 'pages') {
    const { data, error } = await supabase.from('pages').select('*').order('key', { ascending: true });
    assertNoError(error);
    return ((data as CmsTables['pages']['Row'][] | null) || []).map(mapPage) as DbShape[K];
  }

  if (key === 'gallery') {
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    assertNoError(error);
    return ((data as CmsTables['gallery']['Row'][] | null) || []).map(mapGallery) as DbShape[K];
  }

  if (key === 'subscribers') {
    const { data, error } = await supabase.from('subscribers').select('*').order('created_at', { ascending: false });
    assertNoError(error);
    return ((data as CmsTables['subscribers']['Row'][] | null) || []).map(mapSubscriber) as DbShape[K];
  }

  const { data, error } = await supabase.from('lead_notes').select('*').order('created_at', { ascending: false });
  assertNoError(error);
  return ((data as CmsTables['lead_notes']['Row'][] | null) || []).map(mapLeadNote) as DbShape[K];
}

export async function dbSet<K extends keyof DbShape>(key: K, value: DbShape[K]) {
  const supabase = cmsServerClient();
  if (key === 'pages') {
    await upsertPageBlocks(value as unknown as { key: string; label: string; value: string }[]);
    return;
  }
  throw new Error(`dbSet not supported for key: ${String(key)}. Use table-specific upsert helpers.`);
}

export async function upsertAnnouncement(input: Partial<Announcement> & Pick<Announcement, 'title' | 'body'>) {
  const supabase = cmsServerClient();
  const now = nowIso();
  let createdAt = now;

  if (input.id) {
    const { data, error } = await supabase.from('announcements').select('created_at').eq('id', input.id).maybeSingle();
    assertNoError(error);
    createdAt = data?.created_at || now;
  }

  const row: CmsTables['announcements']['Insert'] = {
    id: input.id || randomUUID(),
    title: input.title,
    body: input.body,
    active: Boolean(input.active),
    start_date: input.start_date || null,
    end_date: input.end_date || null,
    target_pages: Array.isArray(input.target_pages) ? input.target_pages : [],
    priority: Number(input.priority || 0),
    created_at: createdAt,
    updated_at: now
  };

  const { data, error } = await supabase.from('announcements').upsert(row, { onConflict: 'id' }).select('*').single();
  assertNoError(error);
  return mapAnnouncement(data as CmsTables['announcements']['Row']);
}

export async function deleteAnnouncement(id: string) {
  const supabase = cmsServerClient();
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  assertNoError(error);
}

export async function upsertPageBlocks(items: { key: string; label: string; value: string }[]) {
  const supabase = cmsServerClient();
  const now = nowIso();
  const rows: CmsTables['pages']['Insert'][] = items.map((item) => ({ key: item.key, label: item.label, value: item.value, updated_at: now }));
  const { error } = await supabase.from('pages').upsert(rows, { onConflict: 'key' });
  assertNoError(error);
  return dbGet('pages');
}

export async function upsertGalleryImage(input: Omit<GalleryImage, 'id'> & { id?: string }) {
  const supabase = cmsServerClient();
  const id = input.id || randomUUID();
  let createdAt = nowIso();
  if (input.id) {
    const existing = await supabase.from('gallery').select('created_at').eq('id', input.id).maybeSingle();
    assertNoError(existing.error);
    createdAt = existing.data?.created_at || createdAt;
  }

  const row: CmsTables['gallery']['Insert'] = {
    id,
    url: input.url,
    alt: input.alt,
    section: input.section || 'general',
    credit: input.credit || null,
    created_at: createdAt
  };

  const { data, error } = await supabase.from('gallery').upsert(row, { onConflict: 'id' }).select('*').single();
  assertNoError(error);
  return mapGallery(data as CmsTables['gallery']['Row']);
}

export async function deleteGalleryImage(id: string) {
  const supabase = cmsServerClient();
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  assertNoError(error);
}

export async function upsertSubscriber(input: Omit<Subscriber, 'id' | 'created_at'> & { id?: string }) {
  const supabase = cmsServerClient();
  const email = input.email.trim().toLowerCase();
  if (!email) throw new Error('Subscriber email is required');
  const now = nowIso();

  let createdAt = now;
  const existing = await supabase.from('subscribers').select('id, created_at').eq('email', email).maybeSingle();
  assertNoError(existing.error);
  if (existing.data?.created_at) createdAt = existing.data.created_at;

  const row: CmsTables['subscribers']['Insert'] = {
    id: existing.data?.id || input.id || randomUUID(),
    email,
    name: input.name?.trim() || null,
    source: input.source,
    opted_in: Boolean(input.opted_in),
    created_at: createdAt,
    updated_at: now
  };

  const { data, error } = await supabase.from('subscribers').upsert(row, { onConflict: 'email' }).select('*').single();
  assertNoError(error);
  return mapSubscriber(data as CmsTables['subscribers']['Row']);
}

export async function addLeadNote(leadId: string, note: string) {
  const supabase = cmsServerClient();
  const now = nowIso();
  const row: CmsTables['lead_notes']['Insert'] = {
    id: randomUUID(),
    lead_id: leadId,
    note,
    created_at: now,
    updated_at: now
  };
  const { data, error } = await supabase.from('lead_notes').insert(row).select('*').single();
  assertNoError(error);
  return mapLeadNote(data as CmsTables['lead_notes']['Row']);
}

export async function updateLeadNote(id: string, note: string) {
  const supabase = cmsServerClient();
  const { data, error } = await supabase.from('lead_notes').update({ note, updated_at: nowIso() }).eq('id', id).select('*').single();
  assertNoError(error);
  return mapLeadNote(data as CmsTables['lead_notes']['Row']);
}

export async function deleteLeadNote(id: string) {
  const supabase = cmsServerClient();
  const { error } = await supabase.from('lead_notes').delete().eq('id', id);
  assertNoError(error);
}

export async function insertLocalLead(
  input: Pick<LocalLead, 'contact_name' | 'contact_email' | 'contact_phone' | 'company_name' | 'message'> & {
    page_path?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    referrer?: string;
    lead_type?: string;
    status?: string;
  }
) {
  const supabase = cmsServerClient();
  const row: CmsTables['leads']['Insert'] = {
    contact_name: input.contact_name || null,
    contact_email: input.contact_email || null,
    contact_phone: input.contact_phone || null,
    company_name: input.company_name || null,
    message: input.message || null,
    page_path: input.page_path || null,
    utm_source: input.utm_source || null,
    utm_medium: input.utm_medium || null,
    utm_campaign: input.utm_campaign || null,
    utm_term: input.utm_term || null,
    utm_content: input.utm_content || null,
    referrer: input.referrer || null,
    lead_type: input.lead_type || null,
    status: input.status || 'new'
  };
  const { data, error } = await supabase.from('leads').insert(row).select('*').single();
  assertNoError(error);
  return mapLocalLead(data as CmsTables['leads']['Row']);
}

export async function markLeadForwarded(id: string) {
  const supabase = cmsServerClient();
  const { error } = await supabase
    .from('leads')
    .update({ forwarded_to_leadops: true, leadops_forwarded_at: nowIso(), leadops_error: null })
    .eq('id', id);
  assertNoError(error);
}

export async function markLeadForwardError(id: string, message: string) {
  const supabase = cmsServerClient();
  const safeMessage = message.slice(0, 1000);
  const { error } = await supabase
    .from('leads')
    .update({ forwarded_to_leadops: false, leadops_error: safeMessage })
    .eq('id', id);
  assertNoError(error);
}

export async function updateLocalLead(id: string, patch: { status?: string; lead_type?: string }) {
  const supabase = cmsServerClient();
  const update: CmsTables['leads']['Update'] = {};
  if (typeof patch.status === 'string' && patch.status.trim()) update.status = patch.status.trim();
  if (typeof patch.lead_type === 'string') update.lead_type = patch.lead_type.trim() || null;
  const { data, error } = await supabase.from('leads').update(update).eq('id', id).select('*').single();
  assertNoError(error);
  return mapLocalLead(data as CmsTables['leads']['Row']);
}

export async function getLocalLeads(params: {
  q?: string;
  status?: string;
  lead_type?: string;
  fromDays?: number;
  page?: number;
  pageSize?: number;
}) {
  const supabase = cmsServerClient();
  const page = Math.max(1, Number(params.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(params.pageSize || 20)));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from('leads').select('*', { count: 'exact' });
  if (params.status) query = query.eq('status', params.status);
  if (params.lead_type) query = query.eq('lead_type', params.lead_type);
  if (params.fromDays && params.fromDays > 0) {
    const fromDate = new Date(Date.now() - params.fromDays * 24 * 60 * 60 * 1000).toISOString();
    query = query.gte('created_at', fromDate);
  }
  if (params.q) {
    const q = params.q.replace(/['"%_,]/g, ' ').trim();
    if (q) {
      query = query.or(`contact_name.ilike.%${q}%,contact_email.ilike.%${q}%,message.ilike.%${q}%`);
    }
  }

  const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to);
  assertNoError(error);
  const rows = ((data as CmsTables['leads']['Row'][] | null) || []).map(mapLocalLead);
  const ids = rows.map((row) => row.id);

  let noteCounts = new Map<string, number>();
  if (ids.length) {
    const notesRes = await supabase.from('lead_notes').select('lead_id').in('lead_id', ids);
    assertNoError(notesRes.error);
    noteCounts = new Map<string, number>();
    for (const note of (notesRes.data || []) as Array<{ lead_id: string }>) {
      noteCounts.set(note.lead_id, (noteCounts.get(note.lead_id) || 0) + 1);
    }
  }

  return {
    rows: rows.map((row) => ({ ...row, notes_count: noteCounts.get(row.id) || 0 })),
    total: count || 0,
    page,
    pageSize
  };
}

export async function exportLocalLeads() {
  const supabase = cmsServerClient();
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
  assertNoError(error);
  const rows = ((data as CmsTables['leads']['Row'][] | null) || []).map(mapLocalLead);

  const ids = rows.map((row) => row.id);
  let noteCounts = new Map<string, number>();
  if (ids.length) {
    const notesRes = await supabase.from('lead_notes').select('lead_id').in('lead_id', ids);
    assertNoError(notesRes.error);
    for (const note of (notesRes.data || []) as Array<{ lead_id: string }>) {
      noteCounts.set(note.lead_id, (noteCounts.get(note.lead_id) || 0) + 1);
    }
  }

  return rows.map((row) => ({ ...row, notes_count: noteCounts.get(row.id) || 0 }));
}

'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import type { Announcement, GalleryImage, LocalLead, PageBlock, Subscriber } from '@/lib/types';
import { Button, Card, Badge } from '@/components/ui';

type LeadRecord = LocalLead & { _notes?: { id: string; note: string; created_at: string }[] };

type InitialState = {
  announcements: Announcement[];
  pages: PageBlock[];
  gallery: GalleryImage[];
  subscribers: Subscriber[];
};

const tabs = ['leads', 'announcements', 'pages', 'gallery', 'subscribers', 'activity'] as const;
type Tab = (typeof tabs)[number];

export function AdminDashboard({
  adminEmail,
  initial,
  initialLoadError
}: {
  adminEmail: string;
  initial: InitialState;
  initialLoadError?: string;
}) {
  const [tab, setTab] = useState<Tab>('leads');
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [leadTypeFilter, setLeadTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(20);
  const [announcements, setAnnouncements] = useState(initial.announcements);
  const [pageBlocks, setPageBlocks] = useState(initial.pages);
  const [gallery, setGallery] = useState(initial.gallery);
  const [subscribers, setSubscribers] = useState(initial.subscribers);
  const [leadNoteDraft, setLeadNoteDraft] = useState('');

  async function fetchLeads() {
    setLoadingLeads(true);
    setLeadError(null);
    try {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (leadTypeFilter) params.set('lead_type', leadTypeFilter);
      if (q) params.set('q', q);
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));
      const res = await fetch(`/api/leads?${params.toString()}`);
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load leads');
      const items = Array.isArray(data.rows) ? data.rows : [];
      setLeads(items);
      setTotal(Number(data.total || 0));
    } catch (e) {
      setLeadError(e instanceof Error ? e.message : 'Failed to load leads');
      setLeads([]);
      setTotal(0);
    } finally {
      setLoadingLeads(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, [status, q, page, pageSize, leadTypeFilter]);

  const activity = useMemo(() => {
    const byDate = new Map<string, number>();
    const bySource = new Map<string, number>();
    for (const lead of leads) {
      const date = String(lead.created_at || '').slice(0, 10) || 'unknown';
      byDate.set(date, (byDate.get(date) || 0) + 1);
      const source = String(lead.utm_source || 'direct');
      const campaign = String(lead.utm_campaign || 'none');
      bySource.set(`${source}/${campaign}`, (bySource.get(`${source}/${campaign}`) || 0) + 1);
    }
    return {
      byDate: [...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-14),
      bySource: [...bySource.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)
    };
  }, [leads]);

  async function saveAnnouncement(formData: FormData) {
    const payload = {
      id: String(formData.get('id') || ''),
      title: String(formData.get('title') || ''),
      body: String(formData.get('body') || ''),
      active: formData.get('active') === 'on',
      start_date: String(formData.get('start_date') || ''),
      end_date: String(formData.get('end_date') || ''),
      target_pages: String(formData.get('target_pages') || '').split(',').map((x) => x.trim()).filter(Boolean),
      priority: Number(formData.get('priority') || 0)
    };
    const res = await fetch('/api/admin/announcements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const item = await res.json();
    if (res.ok) setAnnouncements((prev) => [item, ...prev.filter((a) => a.id !== item.id)]);
  }

  async function deleteAnnouncementById(id: string) {
    const res = await fetch(`/api/admin/announcements?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }

  async function savePageBlocks() {
    const res = await fetch('/api/admin/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: pageBlocks.map(({ key, label, value }) => ({ key, label, value })) })
    });
    if (res.ok) setPageBlocks(await res.json());
  }

  async function saveGalleryItem(formData: FormData) {
    const payload = {
      id: String(formData.get('id') || ''),
      url: String(formData.get('url') || ''),
      alt: String(formData.get('alt') || ''),
      section: String(formData.get('section') || 'general'),
      credit: String(formData.get('credit') || '')
    };
    const res = await fetch('/api/admin/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const item = await res.json();
    if (res.ok) setGallery((prev) => [item, ...prev.filter((g) => g.id !== item.id)]);
  }

  async function deleteGallery(id: string) {
    const res = await fetch(`/api/admin/gallery?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) setGallery((prev) => prev.filter((g) => g.id !== id));
  }

  async function addSubscriber(formData: FormData) {
    const payload = {
      email: String(formData.get('email') || ''),
      name: String(formData.get('name') || ''),
      source: String(formData.get('source') || 'admin'),
      opted_in: true
    };
    const res = await fetch('/api/admin/subscribers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const item = await res.json();
    if (res.ok) setSubscribers((prev) => [item, ...prev.filter((s) => s.id !== item.id)]);
  }

  async function addNote() {
    const leadId = String(selectedLead?.id || '');
    if (!leadId || !leadNoteDraft.trim()) return;
    const res = await fetch('/api/admin/lead-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, note: leadNoteDraft.trim() })
    });
    const item = await res.json();
    if (res.ok) {
      setSelectedLead((prev) => (prev ? { ...prev, _notes: [item, ...((prev._notes as any[]) || [])] } : prev));
      setLeads((prev) => prev.map((l) => String(l.id || '') === leadId ? { ...l, _notes: [item, ...((l._notes as any[]) || [])] } : l));
      setLeadNoteDraft('');
    }
  }

  async function patchLead(id: string, patch: { status?: string; lead_type?: string }) {
    const res = await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...patch })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLeadError(data.error || 'Failed to update lead');
      return;
    }
    if (data.row) {
      setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, ...data.row } : lead)));
      setSelectedLead((prev) => (prev && prev.id === id ? { ...prev, ...data.row } : prev));
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  return (
    <div className="container-shell w-full max-w-full overflow-x-hidden py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/brand/logo.png"
              alt="At Home Family Services, LLC"
              width={38}
              height={38}
              className="h-9 w-9 rounded-full object-contain"
              priority
            />
            <h1 className="text-3xl font-semibold text-brand-navy">Admin Dashboard</h1>
          </div>
          <p className="mt-1 text-sm text-brand-slate">Signed in as {adminEmail}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/api/admin/export/leads" className="rounded-xl border border-brand-navy/10 bg-white px-3 py-2 text-sm font-medium">Export Leads CSV</a>
          <a href="/api/admin/export/subscribers" className="rounded-xl border border-brand-navy/10 bg-white px-3 py-2 text-sm font-medium">Export Subscribers CSV</a>
          <button onClick={logout} className="rounded-xl bg-brand-navy px-3 py-2 text-sm font-semibold text-white">Logout</button>
        </div>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${tab === t ? 'bg-brand-navy text-white' : 'bg-white text-brand-slate border border-brand-navy/10'}`}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {initialLoadError ? (
        <p className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Admin data could not be loaded. You can still access the dashboard, but CMS sections may be empty until connectivity/env issues are resolved.
          <span className="block mt-1 text-amber-800">{initialLoadError}</span>
        </p>
      ) : null}

      <div className="w-full max-w-full overflow-x-hidden">
      {tab === 'leads' && (
        <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <Card>
            <div className="grid gap-3 md:grid-cols-5">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name/email/message" className="md:col-span-2 rounded-xl border border-brand-navy/10 px-3 py-2 text-sm" />
              <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="status" className="rounded-xl border border-brand-navy/10 px-3 py-2 text-sm" />
              <select value={leadTypeFilter} onChange={(e) => setLeadTypeFilter(e.target.value)} className="rounded-xl border border-brand-navy/10 px-3 py-2 text-sm"><option value="">All lead types</option><option value="placement">placement</option><option value="tour">tour</option><option value="general">general</option><option value="career">career</option></select>
              <div className="rounded-xl border border-brand-navy/10 px-3 py-2 text-xs text-brand-slate">Page {page} • {total} total</div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-brand-slate">{loadingLeads ? 'Loading leads…' : `${leads.length} leads shown`}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border px-3 py-1.5 text-sm">Prev</button>
                <button onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-1.5 text-sm">Next</button>
              </div>
            </div>
            {leadError ? <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{leadError}</p> : null}

            <div className="mt-4 space-y-3 md:hidden">
              {leads.map((lead) => {
                return (
                  <button key={lead.id} onClick={() => setSelectedLead(lead)} className="w-full rounded-2xl border border-brand-navy/10 bg-white p-4 text-left">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-brand-navy">{lead.contact_name || 'Unknown'}</p>
                        <p className="text-xs text-brand-slate">{lead.contact_email || ''}</p>
                      </div>
                      <Badge>{lead.forwarded_to_leadops ? 'Forwarded' : 'Not forwarded'}</Badge>
                    </div>
                    <p className="mt-2 text-xs text-brand-slate">{lead.lead_type || 'unknown'} • {lead.status || 'new'} • notes {lead.notes_count || 0}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 hidden overflow-x-auto md:block">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-brand-navy/10 text-xs uppercase tracking-wider text-brand-slate">
                    <th className="px-2 py-2">Created</th>
                    <th className="px-2 py-2">Contact</th>
                    <th className="px-2 py-2">Type</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2">Forwarded</th>
                    <th className="px-2 py-2">Notes</th>
                    <th className="px-2 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => {
                    return (
                      <tr key={lead.id} className="border-b border-brand-navy/5">
                        <td className="px-2 py-2">{lead.created_at?.slice(0, 10)}</td>
                        <td className="px-2 py-2"><div className="font-medium">{lead.contact_name || 'Unknown'}</div><div className="text-xs text-brand-slate">{lead.contact_email || ''} • {lead.contact_phone || ''}</div></td>
                        <td className="px-2 py-2">{lead.lead_type || ''}</td>
                        <td className="px-2 py-2">{lead.status || ''}</td>
                        <td className="px-2 py-2">{lead.forwarded_to_leadops ? 'yes' : 'no'}</td>
                        <td className="px-2 py-2">{lead.notes_count || 0}</td>
                        <td className="px-2 py-2"><button onClick={() => setSelectedLead(lead)} className="text-brand-teal">View</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-brand-navy">Lead Detail</h2>
            {!selectedLead ? <p className="mt-3 text-sm text-brand-slate">Select a lead to view details, parsed meta, and local notes.</p> : (
              <div className="mt-3 space-y-4 text-sm">
                <div className="grid gap-2">
                  <DetailRow label="Name" value={selectedLead.contact_name} />
                  <DetailRow label="Email" value={selectedLead.contact_email} />
                  <DetailRow label="Phone" value={selectedLead.contact_phone} />
                  <DetailRow label="Lead Type" value={selectedLead.lead_type} />
                  <DetailRow label="Status" value={selectedLead.status} />
                  <DetailRow label="Forwarded to LeadOps" value={selectedLead.forwarded_to_leadops ? 'yes' : 'no'} />
                  <DetailRow label="LeadOps Error" value={selectedLead.leadops_error || ''} />
                  <DetailRow label="Created" value={selectedLead.created_at || ''} />
                </div>
                {selectedLead.leadops_error ? (
                  <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                    LeadOps forward error: {selectedLead.leadops_error}
                  </p>
                ) : null}
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-xs text-brand-slate">Status
                    <select
                      value={selectedLead.status || 'new'}
                      onChange={(e) => patchLead(selectedLead.id, { status: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-brand-navy/10 px-3 py-2 text-sm"
                    >
                      <option value="new">new</option>
                      <option value="contacted">contacted</option>
                      <option value="qualified">qualified</option>
                      <option value="closed">closed</option>
                    </select>
                  </label>
                  <label className="text-xs text-brand-slate">Lead Type
                    <select
                      value={selectedLead.lead_type || ''}
                      onChange={(e) => patchLead(selectedLead.id, { lead_type: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-brand-navy/10 px-3 py-2 text-sm"
                    >
                      <option value="">unset</option>
                      <option value="placement">placement</option>
                      <option value="tour">tour</option>
                      <option value="general">general</option>
                      <option value="career">career</option>
                    </select>
                  </label>
                </div>
                <div>
                  <p className="font-semibold text-brand-navy">Message</p>
                  <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-xl bg-brand-sand p-3 text-xs text-brand-navy">{String(selectedLead.message || '')}</pre>
                </div>
                <div>
                  <p className="font-semibold text-brand-navy">Notes</p>
                  <div className="mt-2 space-y-2">
                    {(((selectedLead._notes as any[]) || [])).map((note) => <div key={note.id} className="rounded-xl bg-white p-3 border border-brand-navy/10"><p>{note.note}</p><p className="mt-1 text-xs text-brand-slate">{note.created_at}</p></div>)}
                    {!((selectedLead._notes as any[]) || []).length ? <p className="text-xs text-brand-slate">No notes yet.</p> : null}
                  </div>
                  <textarea value={leadNoteDraft} onChange={(e) => setLeadNoteDraft(e.target.value)} placeholder="Add local note" className="mt-3 min-h-24 w-full rounded-xl border border-brand-navy/10 px-3 py-2" />
                  <button onClick={addNote} className="mt-2 rounded-xl bg-brand-teal px-3 py-2 text-sm font-semibold text-white">Save Note</button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {tab === 'announcements' && (
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <h2 className="text-lg font-semibold">Add / Edit Announcement</h2>
            <form action={saveAnnouncement} className="mt-4 space-y-3">
              <input type="hidden" name="id" />
              <input name="title" placeholder="Title" className="w-full rounded-xl border px-3 py-2" required />
              <textarea name="body" placeholder="Body" className="min-h-28 w-full rounded-xl border px-3 py-2" required />
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="start_date" type="date" className="rounded-xl border px-3 py-2" />
                <input name="end_date" type="date" className="rounded-xl border px-3 py-2" />
                <input name="target_pages" placeholder="/,/tour" className="rounded-xl border px-3 py-2" />
                <input name="priority" type="number" placeholder="Priority" className="rounded-xl border px-3 py-2" defaultValue={1} />
              </div>
              <label className="flex items-center gap-2 text-sm"><input name="active" type="checkbox" defaultChecked /> Active</label>
              <Button type="submit">Save Announcement</Button>
            </form>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold">Current Announcements</h2>
            <div className="mt-4 space-y-3">
              {[...announcements].sort((a, b) => a.priority - b.priority).map((a) => (
                <div key={a.id} className="rounded-2xl border border-brand-navy/10 p-4">
                  <div className="flex items-start justify-between gap-2"><div><p className="font-semibold text-brand-navy">{a.title}</p><p className="mt-1 text-xs text-brand-slate">priority {a.priority} • {a.active ? 'active' : 'inactive'}</p></div><button onClick={() => deleteAnnouncementById(a.id)} className="text-sm text-rose-600">Delete</button></div>
                  <p className="mt-2 text-sm text-brand-slate">{a.body}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'pages' && (
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Pages Editor</h2>
            <Button onClick={savePageBlocks as any}>Save Blocks</Button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {pageBlocks.map((block, idx) => (
              <label key={block.key} className="block">
                <span className="text-sm font-medium text-brand-navy">{block.label}</span>
                <span className="mt-0.5 block text-xs text-brand-slate">{block.key}</span>
                <textarea value={block.value} onChange={(e) => setPageBlocks((prev) => prev.map((b, i) => i === idx ? { ...b, value: e.target.value } : b))} className="mt-2 min-h-24 w-full rounded-xl border border-brand-navy/10 px-3 py-2 text-sm" />
              </label>
            ))}
          </div>
        </Card>
      )}

      {tab === 'gallery' && (
        <div className="grid w-full max-w-full gap-5 overflow-x-hidden xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="min-w-0">
            <h2 className="text-lg font-semibold">Gallery Manager</h2>
            <p className="mt-1 text-xs text-brand-slate">Use hosted image URLs for now. Images are used in page galleries only.</p>
            <form action={saveGalleryItem} className="mt-4 w-full max-w-full space-y-3">
              <input type="hidden" name="id" />
              <input name="url" placeholder="https://..." className="w-full rounded-xl border px-3 py-2" required />
              <input name="alt" placeholder="Alt text" className="w-full rounded-xl border px-3 py-2" required />
              <div className="grid gap-3 sm:grid-cols-2">
                <select name="section" className="w-full rounded-xl border px-3 py-2" defaultValue="general">
                  <option value="general">general</option>
                  <option value="our-home">our-home</option>
                  <option value="announcements">announcements</option>
                </select>
                <input name="credit" placeholder="Credit" className="w-full rounded-xl border px-3 py-2 sm:col-span-2" />
              </div>
              <Button type="submit">Save Image</Button>
            </form>
          </Card>
          <Card className="min-w-0">
            <h2 className="text-lg font-semibold">Images</h2>
            <div className="w-full overflow-x-auto -mx-4 px-4">
              <div className="mt-4 w-full max-w-full space-y-3">
                {gallery.map((g) => (
                  <div key={g.id} className="w-full max-w-full rounded-2xl border border-brand-navy/10 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold text-brand-navy">{g.alt}</p>
                        <p className="break-all text-xs text-brand-slate">{g.url}</p>
                        <p className="mt-1 text-xs text-brand-slate">{g.section}</p>
                      </div>
                      <button onClick={() => deleteGallery(g.id)} className="shrink-0 text-sm text-rose-600">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab === 'subscribers' && (
        <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
          <Card>
            <h2 className="text-lg font-semibold">Add Subscriber</h2>
            <form action={addSubscriber} className="mt-4 space-y-3">
              <input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border px-3 py-2" />
              <input name="name" placeholder="Name" className="w-full rounded-xl border px-3 py-2" />
              <input name="source" defaultValue="admin" placeholder="Source" className="w-full rounded-xl border px-3 py-2" />
              <Button type="submit">Add Subscriber</Button>
            </form>
          </Card>
          <Card>
            <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">Subscribers</h2><a href="/api/admin/export/subscribers" className="text-sm text-brand-teal">Export CSV</a></div>
            <div className="mt-4 space-y-2 md:hidden">
              {subscribers.map((s) => <div key={s.id} className="rounded-xl border border-brand-navy/10 p-3 text-sm"><p className="font-semibold">{s.email}</p><p className="text-xs text-brand-slate">{s.name || 'No name'} • {s.source} • {s.created_at.slice(0,10)}</p></div>)}
            </div>
            <div className="mt-4 hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm"><thead><tr className="text-xs uppercase text-brand-slate"><th className="px-2 py-2 text-left">Email</th><th className="px-2 py-2 text-left">Name</th><th className="px-2 py-2 text-left">Source</th><th className="px-2 py-2 text-left">Date</th></tr></thead><tbody>{subscribers.map((s) => <tr key={s.id} className="border-t"><td className="px-2 py-2">{s.email}</td><td className="px-2 py-2">{s.name || ''}</td><td className="px-2 py-2">{s.source}</td><td className="px-2 py-2">{s.created_at.slice(0,10)}</td></tr>)}</tbody></table>
            </div>
          </Card>
        </div>
      )}

      {tab === 'activity' && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <h2 className="text-lg font-semibold">Leads per day</h2>
            <div className="mt-4 space-y-2">
              {activity.byDate.map(([day, count]) => (
                <BarRow key={day} label={day} value={count} max={Math.max(...activity.byDate.map((x) => x[1]), 1)} />
              ))}
              {!activity.byDate.length ? <p className="text-sm text-brand-slate">No lead data loaded yet.</p> : null}
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold">By UTM source / campaign</h2>
            <div className="mt-4 space-y-2">
              {activity.bySource.map(([label, count]) => (
                <BarRow key={label} label={label} value={count} max={Math.max(...activity.bySource.map((x) => x[1]), 1)} />
              ))}
              {!activity.bySource.length ? <p className="text-sm text-brand-slate">UTM fields will populate from form submissions.</p> : null}
            </div>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: unknown }) {
  return <p><span className="font-semibold text-brand-navy">{label}:</span> <span className="text-brand-slate break-all">{String(value || '')}</span></p>;
}

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-xs text-brand-slate"><span className="truncate">{label}</span><span>{value}</span></div>
      <div className="h-2 rounded-full bg-brand-sand"><div className="h-2 rounded-full bg-brand-teal" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

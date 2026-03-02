'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import type { Announcement, LocalLead, Subscriber } from '@/lib/types';
import { Badge, Button, Card } from '@/components/ui';

type LeadRecord = LocalLead & { _notes?: { id: string; note: string; created_at: string }[] };

type InitialState = {
  announcements: Announcement[];
  subscribers: Subscriber[];
};

type ActivityData = {
  rangeDays: 7 | 30 | 90;
  overview: {
    totalVisits: number;
    placementInquiries: number;
    tourRequests: number;
    conversionRate: number;
    callsClicked: number;
  };
  topPages: Array<{
    page: string;
    views: number;
    ctaClicks: number;
    conversions: number;
    conversionRate: number;
  }>;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  topCities: Array<{
    location: string;
    visits: number;
    conversions: number;
    conversionRate: number;
  }>;
};

type EmailCampaign = {
  id: string;
  subject: string;
  preview_text: string | null;
  audience_source: string | null;
  status: string;
  sent_at: string | null;
  total_recipients: number;
  sent_count: number;
  skipped_count: number;
  created_at: string;
};

const tabs = ['leads', 'announcements', 'subscribers', 'activity', 'email'] as const;
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
  const [mobileLeadFiltersOpen, setMobileLeadFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(20);
  const [announcements, setAnnouncements] = useState(initial.announcements);
  const [subscribers, setSubscribers] = useState(initial.subscribers);
  const [leadNoteDraft, setLeadNoteDraft] = useState('');
  const [activityDays, setActivityDays] = useState<7 | 30 | 90>(30);
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailPreview, setEmailPreview] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailSourceFilter, setEmailSourceFilter] = useState('');
  const [campaignIdempotencyKey, setCampaignIdempotencyKey] = useState(() => `${Date.now()}`);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [sendingCampaign, setSendingCampaign] = useState(false);
  const [testingCampaign, setTestingCampaign] = useState(false);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

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

  async function fetchActivity(days: 7 | 30 | 90) {
    setLoadingActivity(true);
    setActivityError(null);
    try {
      const res = await fetch(`/api/admin/activity?days=${days}`);
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load activity analytics');
      setActivityData(data as ActivityData);
    } catch (error) {
      setActivityData(null);
      setActivityError(error instanceof Error ? error.message : 'Failed to load activity analytics');
    } finally {
      setLoadingActivity(false);
    }
  }

  async function fetchCampaigns() {
    try {
      const res = await fetch('/api/admin/email-blasts');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load campaigns');
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (error) {
      setEmailError(error instanceof Error ? error.message : 'Failed to load campaigns');
    }
  }

  async function sendTestEmail() {
    setTestingCampaign(true);
    setEmailError(null);
    setEmailMessage(null);
    try {
      const res = await fetch('/api/admin/email-blasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          subject: emailSubject,
          previewText: emailPreview,
          body: emailBody
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send test email');
      setEmailMessage('Test email sent to RESEND_TO.');
    } catch (error) {
      setEmailError(error instanceof Error ? error.message : 'Failed to send test email');
    } finally {
      setTestingCampaign(false);
    }
  }

  async function sendCampaign() {
    setSendingCampaign(true);
    setEmailError(null);
    setEmailMessage(null);
    try {
      const res = await fetch('/api/admin/email-blasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          subject: emailSubject,
          previewText: emailPreview,
          body: emailBody,
          audienceSource: emailSourceFilter || undefined,
          idempotencyKey: campaignIdempotencyKey
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send campaign');
      setEmailMessage(data.alreadyProcessed ? 'This campaign was already processed.' : 'Campaign sent.');
      setCampaignIdempotencyKey(`${Date.now()}`);
      await fetchCampaigns();
    } catch (error) {
      setEmailError(error instanceof Error ? error.message : 'Failed to send campaign');
    } finally {
      setSendingCampaign(false);
    }
  }

  async function setSubscriberStatus(id: string, nextStatus: 'active' | 'unsubscribed' | 'bounced' | 'complaint', forceResubscribe = false) {
    try {
      const res = await fetch('/api/admin/subscribers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus, force_resubscribe: forceResubscribe })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update subscriber');
      setSubscribers((prev) => prev.map((item) => (item.id === id ? data : item)));
    } catch (error) {
      setEmailError(error instanceof Error ? error.message : 'Failed to update subscriber');
    }
  }

  useEffect(() => {
    fetchLeads();
  }, [status, q, page, pageSize, leadTypeFilter]);

  useEffect(() => {
    if (tab !== 'activity') return;
    fetchActivity(activityDays);
  }, [tab, activityDays]);

  useEffect(() => {
    if (tab !== 'email') return;
    fetchCampaigns();
  }, [tab]);

  const leadCountLabel = useMemo(() => {
    if (loadingLeads) return 'Loading leads…';
    return `${leads.length} leads shown`;
  }, [loadingLeads, leads.length]);

  async function saveAnnouncement(formData: FormData) {
    const payload = {
      id: String(formData.get('id') || ''),
      title: String(formData.get('title') || ''),
      body: String(formData.get('body') || ''),
      active: formData.get('active') === 'on',
      start_date: String(formData.get('start_date') || ''),
      end_date: String(formData.get('end_date') || ''),
      target_pages: String(formData.get('target_pages') || '')
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
      priority: Number(formData.get('priority') || 0)
    };
    const res = await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const item = await res.json();
    if (res.ok) setAnnouncements((prev) => [item, ...prev.filter((a) => a.id !== item.id)]);
  }

  async function deleteAnnouncementById(id: string) {
    const res = await fetch(`/api/admin/announcements?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }

  async function addSubscriber(formData: FormData) {
    const payload = {
      email: String(formData.get('email') || ''),
      name: String(formData.get('name') || ''),
      source: String(formData.get('source') || 'admin'),
      opted_in: true
    };
    const res = await fetch('/api/admin/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
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
      setLeads((prev) =>
        prev.map((lead) =>
          String(lead.id || '') === leadId ? { ...lead, _notes: [item, ...((lead._notes as any[]) || [])] } : lead
        )
      );
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
          <a href="/api/admin/export/leads" className="rounded-xl border border-brand-navy/10 bg-white px-3 py-2 text-sm font-medium">
            Export Leads CSV
          </a>
          <a
            href="/api/admin/export/subscribers"
            className="rounded-xl border border-brand-navy/10 bg-white px-3 py-2 text-sm font-medium"
          >
            Export Subscribers CSV
          </a>
          <button onClick={logout} className="rounded-xl bg-brand-navy px-3 py-2 text-sm font-semibold text-white">
            Logout
          </button>
        </div>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
              tab === t ? 'bg-brand-navy text-white' : 'border border-brand-navy/10 bg-white text-brand-slate'
            }`}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {initialLoadError ? (
        <p className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Admin data could not be loaded. You can still access the dashboard, but CMS sections may be empty until connectivity/env issues are resolved.
          <span className="mt-1 block text-amber-800">{initialLoadError}</span>
        </p>
      ) : null}

      <div className="w-full max-w-full overflow-x-hidden">
        {tab === 'leads' && (
          <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
            <Card>
              <div className="mb-3 flex items-center justify-between gap-2 md:hidden">
                <button
                  onClick={() => setMobileLeadFiltersOpen((prev) => !prev)}
                  className="rounded-xl border border-brand-navy/10 bg-white px-3 py-2 text-sm font-medium"
                >
                  {mobileLeadFiltersOpen ? 'Hide Filters' : 'Show Filters'}
                </button>
                <div className="rounded-xl border border-brand-navy/10 px-3 py-2 text-xs text-brand-slate">
                  Page {page} • {total}
                </div>
              </div>
              <div className={`${mobileLeadFiltersOpen ? 'grid' : 'hidden'} gap-3 md:grid md:grid-cols-5`}>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search name/email/message"
                  className="w-full rounded-xl border border-brand-navy/10 px-3 py-2 text-sm md:col-span-2"
                />
                <input
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="status"
                  className="w-full rounded-xl border border-brand-navy/10 px-3 py-2 text-sm"
                />
                <select
                  value={leadTypeFilter}
                  onChange={(e) => setLeadTypeFilter(e.target.value)}
                  className="w-full rounded-xl border border-brand-navy/10 px-3 py-2 text-sm"
                >
                  <option value="">All lead types</option>
                  <option value="placement">placement</option>
                  <option value="tour">tour</option>
                  <option value="general">general</option>
                  <option value="career">career</option>
                </select>
                <div className="hidden rounded-xl border border-brand-navy/10 px-3 py-2 text-xs text-brand-slate md:block">
                  Page {page} • {total} total
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-brand-slate">{leadCountLabel}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border px-3 py-1.5 text-sm">
                    Prev
                  </button>
                  <button onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-1.5 text-sm">
                    Next
                  </button>
                </div>
              </div>
              {leadError ? <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{leadError}</p> : null}

              <div className="mt-4 space-y-3 md:hidden">
                {leads.map((lead) => {
                  return (
                    <button
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="w-full rounded-2xl border border-brand-navy/10 bg-white p-4 text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-brand-navy">{lead.contact_name || 'Unknown'}</p>
                          <p className="break-all text-xs text-brand-slate">{lead.contact_email || ''}</p>
                        </div>
                        <Badge>{lead.forwarded_to_leadops ? 'Forwarded' : 'Not forwarded'}</Badge>
                      </div>
                      <p className="mt-2 text-xs text-brand-slate">
                        {lead.lead_type || 'unknown'} • {lead.status || 'new'} • notes {lead.notes_count || 0}
                      </p>
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
                          <td className="px-2 py-2">
                            <div className="font-medium">{lead.contact_name || 'Unknown'}</div>
                            <div className="text-xs text-brand-slate">
                              {lead.contact_email || ''} • {lead.contact_phone || ''}
                            </div>
                          </td>
                          <td className="px-2 py-2">{lead.lead_type || ''}</td>
                          <td className="px-2 py-2">{lead.status || ''}</td>
                          <td className="px-2 py-2">{lead.forwarded_to_leadops ? 'yes' : 'no'}</td>
                          <td className="px-2 py-2">{lead.notes_count || 0}</td>
                          <td className="px-2 py-2">
                            <button onClick={() => setSelectedLead(lead)} className="text-brand-teal">
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-brand-navy">Lead Detail</h2>
              {!selectedLead ? (
                <p className="mt-3 text-sm text-brand-slate">Select a lead to view details and local notes.</p>
              ) : (
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
                    <label className="text-xs text-brand-slate">
                      Status
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
                    <label className="text-xs text-brand-slate">
                      Lead Type
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
                    <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-xl bg-brand-sand p-3 text-xs text-brand-navy">
                      {String(selectedLead.message || '')}
                    </pre>
                  </div>
                  <div>
                    <p className="font-semibold text-brand-navy">Notes</p>
                    <div className="mt-2 space-y-2">
                      {(((selectedLead._notes as any[]) || [])).map((note) => (
                        <div key={note.id} className="rounded-xl border border-brand-navy/10 bg-white p-3">
                          <p>{note.note}</p>
                          <p className="mt-1 text-xs text-brand-slate">{note.created_at}</p>
                        </div>
                      ))}
                      {!((selectedLead._notes as any[]) || []).length ? (
                        <p className="text-xs text-brand-slate">No notes yet.</p>
                      ) : null}
                    </div>
                    <textarea
                      value={leadNoteDraft}
                      onChange={(e) => setLeadNoteDraft(e.target.value)}
                      placeholder="Add local note"
                      className="mt-3 min-h-24 w-full rounded-xl border border-brand-navy/10 px-3 py-2"
                    />
                    <button onClick={addNote} className="mt-2 rounded-xl bg-brand-teal px-3 py-2 text-sm font-semibold text-white">
                      Save Note
                    </button>
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
                <label className="flex items-center gap-2 text-sm">
                  <input name="active" type="checkbox" defaultChecked /> Active
                </label>
                <Button type="submit">Save Announcement</Button>
              </form>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold">Current Announcements</h2>
              <div className="mt-4 space-y-3">
                {[...announcements].sort((a, b) => a.priority - b.priority).map((announcement) => (
                  <div key={announcement.id} className="rounded-2xl border border-brand-navy/10 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-brand-navy">{announcement.title}</p>
                        <p className="mt-1 text-xs text-brand-slate">
                          priority {announcement.priority} • {announcement.active ? 'active' : 'inactive'}
                        </p>
                      </div>
                      <button onClick={() => deleteAnnouncementById(announcement.id)} className="text-sm text-rose-600">
                        Delete
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-brand-slate">{announcement.body}</p>
                  </div>
                ))}
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
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Subscribers</h2>
                <a href="/api/admin/export/subscribers" className="text-sm text-brand-teal">
                  Export CSV
                </a>
              </div>
              {emailError ? <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{emailError}</p> : null}
              <div className="mt-4 space-y-2 md:hidden">
                {subscribers.map((subscriber) => (
                  <div key={subscriber.id} className="rounded-xl border border-brand-navy/10 p-3 text-sm">
                    <p className="font-semibold">{subscriber.email}</p>
                    <p className="text-xs text-brand-slate">
                      {subscriber.name || 'No name'} • {subscriber.source} • {subscriber.status} • {subscriber.created_at.slice(0, 10)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button onClick={() => setSubscriberStatus(subscriber.id, 'unsubscribed')} className="rounded-lg border px-2 py-1 text-xs">
                        Unsubscribe
                      </button>
                      <button
                        onClick={() => {
                          if (!window.confirm('This subscriber is suppressed. Re-enable marketing emails?')) return;
                          void setSubscriberStatus(subscriber.id, 'active', true);
                        }}
                        className="rounded-lg border px-2 py-1 text-xs"
                      >
                        Re-enable
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 hidden overflow-x-auto md:block">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase text-brand-slate">
                      <th className="px-2 py-2">Email</th>
                      <th className="px-2 py-2">Name</th>
                      <th className="px-2 py-2">Source</th>
                      <th className="px-2 py-2">Status</th>
                      <th className="px-2 py-2">Date</th>
                      <th className="px-2 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="border-t">
                        <td className="px-2 py-2">{subscriber.email}</td>
                        <td className="px-2 py-2">{subscriber.name || ''}</td>
                        <td className="px-2 py-2">{subscriber.source}</td>
                        <td className="px-2 py-2">{subscriber.status}</td>
                        <td className="px-2 py-2">{subscriber.created_at.slice(0, 10)}</td>
                        <td className="px-2 py-2">
                          <div className="flex gap-2">
                            <button onClick={() => setSubscriberStatus(subscriber.id, 'unsubscribed')} className="rounded-lg border px-2 py-1 text-xs">
                              Unsubscribe
                            </button>
                            <button
                              onClick={() => {
                                if (!window.confirm('This subscriber is suppressed. Re-enable marketing emails?')) return;
                                void setSubscriberStatus(subscriber.id, 'active', true);
                              }}
                              className="rounded-lg border px-2 py-1 text-xs"
                            >
                              Re-enable
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {tab === 'activity' && (
          <div className="space-y-5">
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-brand-navy">Activity Dashboard</h2>
                  <p className="mt-1 text-sm text-brand-slate">
                    Plain-language analytics showing what is working, where visitors come from, and which pages drive inquiries.
                  </p>
                </div>
                <div className="flex gap-2">
                  {[7, 30, 90].map((days) => (
                    <button
                      key={days}
                      onClick={() => setActivityDays(days as 7 | 30 | 90)}
                      className={`rounded-full px-3 py-1.5 text-sm ${
                        activityDays === days ? 'bg-brand-navy text-white' : 'border border-brand-navy/10 bg-white text-brand-slate'
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {loadingActivity ? (
              <Card>
                <p className="text-sm text-brand-slate">Loading activity analytics...</p>
              </Card>
            ) : null}

            {activityError ? (
              <Card>
                <p className="text-sm text-rose-700">{activityError}</p>
                <p className="mt-2 text-xs text-brand-slate">
                  If this mentions missing relations, apply the latest Supabase migration for `activity_events` and redeploy.
                </p>
              </Card>
            ) : null}

            {activityData ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                  <MetricCard label="Total Visits" value={activityData.overview.totalVisits} />
                  <MetricCard label="Placement Inquiries" value={activityData.overview.placementInquiries} />
                  <MetricCard label="Tour Requests" value={activityData.overview.tourRequests} />
                  <MetricCard label="Conversion Rate" value={`${activityData.overview.conversionRate}%`} />
                  <MetricCard label="Calls Clicked" value={activityData.overview.callsClicked} />
                </div>

                <Card>
                  <h3 className="text-base font-semibold text-brand-navy">Top Pages</h3>
                  <p className="mt-1 text-sm text-brand-slate">
                    This shows which pages get the most attention and which ones drive inquiries.
                  </p>
                  <div className="-mx-4 mt-4 w-full overflow-x-auto px-4">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-xs uppercase tracking-wider text-brand-slate">
                          <th className="px-2 py-2">Page</th>
                          <th className="px-2 py-2">Views</th>
                          <th className="px-2 py-2">CTA Clicks</th>
                          <th className="px-2 py-2">Conversions</th>
                          <th className="px-2 py-2">Conversion Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityData.topPages.map((item) => (
                          <tr key={item.page} className="border-b border-brand-navy/5">
                            <td className="px-2 py-2">{item.page}</td>
                            <td className="px-2 py-2">{item.views}</td>
                            <td className="px-2 py-2">{item.ctaClicks}</td>
                            <td className="px-2 py-2">{item.conversions}</td>
                            <td className="px-2 py-2">{item.conversionRate}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                <div className="grid gap-5 lg:grid-cols-2">
                  <Card>
                    <h3 className="text-base font-semibold text-brand-navy">Device Breakdown</h3>
                    <p className="mt-1 text-sm text-brand-slate">Use this to prioritize mobile improvements when mobile traffic dominates.</p>
                    <div className="mt-4 space-y-2 text-sm">
                      <PercentRow label="Mobile" value={activityData.deviceBreakdown.mobile} />
                      <PercentRow label="Desktop" value={activityData.deviceBreakdown.desktop} />
                      <PercentRow label="Tablet" value={activityData.deviceBreakdown.tablet} />
                    </div>
                  </Card>

                  <Card>
                    <h3 className="text-base font-semibold text-brand-navy">Top Cities</h3>
                    <div className="-mx-4 mt-4 w-full overflow-x-auto px-4">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b text-left text-xs uppercase tracking-wider text-brand-slate">
                            <th className="px-2 py-2">Location</th>
                            <th className="px-2 py-2">Visits</th>
                            <th className="px-2 py-2">Conversions</th>
                            <th className="px-2 py-2">Conversion %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activityData.topCities.map((item) => (
                            <tr key={item.location} className="border-b border-brand-navy/5">
                              <td className="px-2 py-2">{item.location}</td>
                              <td className="px-2 py-2">{item.visits}</td>
                              <td className="px-2 py-2">{item.conversions}</td>
                              <td className="px-2 py-2">{item.conversionRate}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>

                <Card>
                  <h3 className="text-base font-semibold text-brand-navy">How to Use This Page</h3>
                  <ul className="mt-3 space-y-2 text-sm text-brand-slate">
                    <li><span className="font-semibold text-brand-navy">Top Pages:</span> Focus updates where traffic is high but inquiries are low.</li>
                    <li><span className="font-semibold text-brand-navy">Device Mix:</span> If mobile is highest, prioritize phone-sized layout fixes first.</li>
                    <li><span className="font-semibold text-brand-navy">Top Locations:</span> Use city/region trends to guide local outreach.</li>
                    <li><span className="font-semibold text-brand-navy">Conversions:</span> Placement, tour, and contact submissions show what is working.</li>
                  </ul>
                </Card>
              </>
            ) : null}
          </div>
        )}

        {tab === 'email' && (
          <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <Card>
              <h2 className="text-lg font-semibold text-brand-navy">Email Blasts</h2>
              <p className="mt-1 text-sm text-brand-slate">Send updates to active subscribers only. Unsubscribed and bounced emails are skipped.</p>
              <div className="mt-4 space-y-3">
                <input
                  value={emailSubject}
                  onChange={(event) => setEmailSubject(event.target.value)}
                  placeholder="Subject"
                  className="w-full rounded-xl border border-brand-navy/10 px-3 py-2 text-sm"
                />
                <input
                  value={emailPreview}
                  onChange={(event) => setEmailPreview(event.target.value)}
                  placeholder="Preview text (optional)"
                  className="w-full rounded-xl border border-brand-navy/10 px-3 py-2 text-sm"
                />
                <textarea
                  value={emailBody}
                  onChange={(event) => setEmailBody(event.target.value)}
                  placeholder="Body (plain text or markdown bullets)"
                  className="min-h-52 w-full rounded-xl border border-brand-navy/10 px-3 py-2 text-sm"
                />
                <select
                  value={emailSourceFilter}
                  onChange={(event) => setEmailSourceFilter(event.target.value)}
                  className="w-full rounded-xl border border-brand-navy/10 px-3 py-2 text-sm"
                >
                  <option value="">Active subscribers (all sources)</option>
                  <option value="placement">placement</option>
                  <option value="tour">tour</option>
                  <option value="general">general</option>
                  <option value="contact">contact</option>
                  <option value="newsletter">newsletter</option>
                </select>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={sendTestEmail}
                  disabled={testingCampaign || !emailSubject.trim() || !emailBody.trim()}
                  className="rounded-xl border border-brand-navy/10 bg-white px-3 py-2 text-sm font-medium disabled:opacity-60"
                >
                  {testingCampaign ? 'Sending test...' : 'Send Test Email'}
                </button>
                <button
                  onClick={sendCampaign}
                  disabled={sendingCampaign || !emailSubject.trim() || !emailBody.trim()}
                  className="rounded-xl bg-brand-navy px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {sendingCampaign ? 'Sending campaign...' : 'Send Campaign'}
                </button>
              </div>
              {emailMessage ? <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{emailMessage}</p> : null}
              {emailError ? <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{emailError}</p> : null}
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-brand-navy">Recent Campaigns</h3>
                <button onClick={fetchCampaigns} className="rounded-lg border px-3 py-1.5 text-xs">Refresh</button>
              </div>
              <div className="mt-4 space-y-3">
                {campaigns.length ? campaigns.map((campaign) => (
                  <div key={campaign.id} className="rounded-xl border border-brand-navy/10 p-3">
                    <p className="font-semibold text-brand-navy">{campaign.subject}</p>
                    <p className="mt-1 text-xs text-brand-slate">
                      {campaign.status} • recipients {campaign.total_recipients} • sent {campaign.sent_count} • skipped {campaign.skipped_count}
                    </p>
                    <p className="mt-1 text-xs text-brand-slate">
                      source {campaign.audience_source || 'all'} • {campaign.sent_at ? campaign.sent_at.slice(0, 19).replace('T', ' ') : campaign.created_at.slice(0, 19).replace('T', ' ')}
                    </p>
                  </div>
                )) : (
                  <p className="text-sm text-brand-slate">No campaigns yet.</p>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: unknown }) {
  return (
    <p>
      <span className="font-semibold text-brand-navy">{label}:</span>{' '}
      <span className="break-all text-brand-slate">{String(value || '')}</span>
    </p>
  );
}

function MetricCard({ label, value, compact = false }: { label: string; value: number | string; compact?: boolean }) {
  return (
    <div className={`rounded-xl border border-brand-navy/10 bg-white ${compact ? 'p-3' : 'p-4'}`}>
      <p className="text-xs uppercase tracking-wide text-brand-slate">{label}</p>
      <p className="mt-1 text-xl font-semibold text-brand-navy">{value}</p>
    </div>
  );
}

function PercentRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-brand-slate">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-brand-sand">
        <div className="h-2 rounded-full bg-brand-teal" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

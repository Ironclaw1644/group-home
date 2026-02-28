import 'server-only';

import { cmsServerClient } from '@/lib/supabase/cmsServer';
import type { Database } from '@/lib/supabase/cms.types';

type ActivityRow = Database['athome_family_services_llc']['Tables']['activity_events']['Row'];

type RangeDays = 7 | 30 | 90;

function normalize(value: string | null | undefined, fallback = 'Unknown') {
  const text = (value || '').trim();
  return text || fallback;
}

function sourceLabel(event: ActivityRow) {
  const utmSource = (event.utm_source || '').toLowerCase();
  const referrer = (event.referrer || '').toLowerCase();
  if (!utmSource && !referrer) return 'Direct';
  if (utmSource.includes('google') || referrer.includes('google.')) return 'Google';
  if (utmSource.includes('instagram') || referrer.includes('instagram.')) return 'Instagram';
  return 'Other';
}

export async function getActivityAnalytics(days: RangeDays = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const supabase = cmsServerClient();
  const { data, error } = await supabase
    .from('activity_events')
    .select('*')
    .gte('created_at', since)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);

  const rows = (data || []) as ActivityRow[];
  const pageViews = rows.filter((row) => row.event_type === 'page_view');
  const ctaClicks = rows.filter((row) => row.event_type === 'cta_click');
  const formSubmits = rows.filter((row) => row.event_type === 'form_submit');

  const sessions = new Set(
    rows
      .map((row) => (row.session_id || '').trim())
      .filter(Boolean)
  );

  const placementInquiries = formSubmits.filter((row) => (row.form_name || '').toLowerCase() === 'placement').length;
  const tourRequests = formSubmits.filter((row) => (row.form_name || '').toLowerCase() === 'tour').length;
  const callsClicked = ctaClicks.filter((row) => (row.cta_name || '').toLowerCase() === 'call').length;

  const pageMetrics = new Map<string, { views: number; ctaClicks: number; conversions: number }>();
  for (const row of rows) {
    const path = normalize(row.page_path, '/');
    if (!pageMetrics.has(path)) pageMetrics.set(path, { views: 0, ctaClicks: 0, conversions: 0 });
    const target = pageMetrics.get(path)!;
    if (row.event_type === 'page_view') target.views += 1;
    if (row.event_type === 'cta_click') target.ctaClicks += 1;
    if (row.event_type === 'form_submit') target.conversions += 1;
  }

  const topPages = [...pageMetrics.entries()]
    .map(([page, metrics]) => ({
      page,
      views: metrics.views,
      ctaClicks: metrics.ctaClicks,
      conversions: metrics.conversions,
      conversionRate: metrics.views ? Number(((metrics.conversions / metrics.views) * 100).toFixed(1)) : 0
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 20);

  const perSessionPageViews = new Map<string, ActivityRow[]>();
  for (const row of pageViews) {
    const sessionId = (row.session_id || '').trim();
    if (!sessionId) continue;
    if (!perSessionPageViews.has(sessionId)) perSessionPageViews.set(sessionId, []);
    perSessionPageViews.get(sessionId)!.push(row);
  }

  const entryCounts = new Map<string, number>();
  const exitCounts = new Map<string, number>();
  for (const list of perSessionPageViews.values()) {
    if (!list.length) continue;
    const entry = normalize(list[0].page_path, '/');
    const exit = normalize(list[list.length - 1].page_path, '/');
    entryCounts.set(entry, (entryCounts.get(entry) || 0) + 1);
    exitCounts.set(exit, (exitCounts.get(exit) || 0) + 1);
  }

  const topEntryPages = [...entryCounts.entries()]
    .map(([page, visits]) => ({ page, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10);
  const topExitPages = [...exitCounts.entries()]
    .map(([page, visits]) => ({ page, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10);

  const sourceMap = new Map<string, { source: string; utmCampaign: string; device: string; city: string; visits: number; conversions: number }>();
  for (const row of rows) {
    const source = sourceLabel(row);
    const utmCampaign = normalize(row.utm_campaign, '—');
    const device = normalize(row.device, 'Unknown');
    const city = normalize(row.city, 'Unknown');
    const key = `${source}|${utmCampaign}|${device}|${city}`;
    if (!sourceMap.has(key)) sourceMap.set(key, { source, utmCampaign, device, city, visits: 0, conversions: 0 });
    const target = sourceMap.get(key)!;
    if (row.event_type === 'page_view') target.visits += 1;
    if (row.event_type === 'form_submit') target.conversions += 1;
  }

  const trafficSources = [...sourceMap.values()]
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 30);

  const deviceCounts = { mobile: 0, desktop: 0, tablet: 0, unknown: 0 };
  for (const row of pageViews) {
    const device = (row.device || 'unknown').toLowerCase();
    if (device === 'mobile' || device === 'desktop' || device === 'tablet') {
      deviceCounts[device] += 1;
    } else {
      deviceCounts.unknown += 1;
    }
  }
  const totalDevice = pageViews.length || 1;

  const cityMap = new Map<string, { city: string; visits: number; conversions: number }>();
  for (const row of rows) {
    const city = normalize(row.city, 'Unknown');
    if (!cityMap.has(city)) cityMap.set(city, { city, visits: 0, conversions: 0 });
    const target = cityMap.get(city)!;
    if (row.event_type === 'page_view') target.visits += 1;
    if (row.event_type === 'form_submit') target.conversions += 1;
  }
  const topCities = [...cityMap.values()]
    .map((item) => ({
      ...item,
      conversionRate: item.visits ? Number(((item.conversions / item.visits) * 100).toFixed(1)) : 0
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 15);

  const utmMap = new Map<string, { utmSource: string; utmMedium: string; utmCampaign: string; visits: number; conversions: number }>();
  for (const row of rows) {
    const utmSource = normalize(row.utm_source, '—');
    const utmMedium = normalize(row.utm_medium, '—');
    const utmCampaign = normalize(row.utm_campaign, '—');
    const key = `${utmSource}|${utmMedium}|${utmCampaign}`;
    if (!utmMap.has(key)) utmMap.set(key, { utmSource, utmMedium, utmCampaign, visits: 0, conversions: 0 });
    const target = utmMap.get(key)!;
    if (row.event_type === 'page_view') target.visits += 1;
    if (row.event_type === 'form_submit') target.conversions += 1;
  }
  const utmPerformance = [...utmMap.values()]
    .map((item) => ({
      ...item,
      conversionRate: item.visits ? Number(((item.conversions / item.visits) * 100).toFixed(1)) : 0
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 20);

  const visits = pageViews.length;
  const conversions = placementInquiries + tourRequests;
  const conversionRate = visits ? Number(((conversions / visits) * 100).toFixed(1)) : 0;

  return {
    rangeDays: days,
    overview: {
      totalVisits: visits,
      uniqueSessions: sessions.size,
      placementInquiries,
      tourRequests,
      conversionRate,
      callsClicked
    },
    topPages,
    topEntryPages,
    topExitPages,
    trafficSources,
    deviceBreakdown: {
      mobile: Number(((deviceCounts.mobile / totalDevice) * 100).toFixed(1)),
      desktop: Number(((deviceCounts.desktop / totalDevice) * 100).toFixed(1)),
      tablet: Number(((deviceCounts.tablet / totalDevice) * 100).toFixed(1))
    },
    topCities,
    funnel: {
      visits,
      ctaClicks: ctaClicks.length,
      formStarted: null as number | null,
      formSubmitted: formSubmits.length
    },
    utmPerformance
  };
}

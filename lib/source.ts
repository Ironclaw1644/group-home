/**
 * Where a visit or lead came from, derived from the referrer and utm_source
 * that activity_events and leads already store. Computed at read time, so the
 * whole existing history is classified too, and nothing new is written.
 *
 * "ai" exists because AI assistants now send real visitors: ChatGPT search
 * appends utm_source=chatgpt.com to the links it cites, and Perplexity,
 * Copilot, Gemini and Claude pass a referrer. Without this bucket those visits
 * hide inside "referral" or "direct".
 */

export type SourceChannel = 'google' | 'bing' | 'ai' | 'social' | 'email' | 'referral' | 'direct';

export const SOURCE_LABELS: Record<SourceChannel, string> = {
  google: 'Google',
  bing: 'Bing / other search',
  ai: 'ChatGPT / AI assistants',
  social: 'Social',
  email: 'Email',
  referral: 'Other websites',
  direct: 'Direct / unknown'
};

const AI_TEXT = /chatgpt|openai|perplexity|copilot|gemini|claude|anthropic/i;
const AI_HOST = /(^|\.)(chatgpt\.com|openai\.com|perplexity\.ai|claude\.ai|copilot\.microsoft\.com|gemini\.google\.com|bard\.google\.com)$/i;

function hostOf(referrer: string | null | undefined) {
  if (!referrer) return '';
  try {
    return new URL(referrer).hostname.toLowerCase();
  } catch {
    return '';
  }
}

/** Which AI assistant sent the visit, or null. */
export function aiSourceOf(referrer: string | null | undefined, utmSource: string | null | undefined): string | null {
  const utm = (utmSource || '').trim().toLowerCase();
  if (utm && AI_TEXT.test(utm)) return utm.replace(/^www\./, '');
  const host = hostOf(referrer);
  if (host && AI_HOST.test(host)) return host.replace(/^www\./, '');
  return null;
}

export function sourceChannelOf(referrer: string | null | undefined, utmSource: string | null | undefined, utmMedium?: string | null): SourceChannel {
  if (aiSourceOf(referrer, utmSource)) return 'ai';
  const utm = (utmSource || '').trim().toLowerCase();
  const medium = (utmMedium || '').trim().toLowerCase();
  if (medium === 'email' || /newsletter|resend|mail/.test(utm)) return 'email';
  if (/instagram|facebook|^ig$|^fb$|tiktok|linkedin|twitter|^x$/.test(utm)) return 'social';
  if (utm === 'google') return 'google';
  if (/bing|duckduckgo|yahoo/.test(utm)) return 'bing';

  const host = hostOf(referrer);
  if (!host) return 'direct';
  if (/(^|\.)athomefamilyservices\.com$/.test(host)) return 'direct';
  if (/(^|\.)google\.[a-z.]+$/.test(host)) return 'google';
  if (/(^|\.)(bing\.com|duckduckgo\.com|yahoo\.com|search\.brave\.com|ecosia\.org)$/.test(host)) return 'bing';
  if (/(^|\.)(instagram\.com|facebook\.com|fb\.com|t\.co|x\.com|linkedin\.com|tiktok\.com)$/.test(host)) return 'social';
  if (/mail\./.test(host)) return 'email';
  return 'referral';
}

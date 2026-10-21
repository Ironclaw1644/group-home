import { business, faqs, locationPages, locationSlugs, servicePages, serviceSlugs } from '@/lib/content';
import { defaultDescription } from '@/lib/site';
import { absoluteUrl } from '@/lib/utils';

/**
 * /llms.txt — a plain-text brief for AI assistants (ChatGPT, Perplexity,
 * Claude, Gemini), following the llmstxt.org layout. Built from lib/content.ts
 * so it can only say what the site itself says; edit the content there, not here.
 */

export const dynamic = 'force-static';

const STATIC_PAGES: { path: string; label: string; note: string }[] = [
  { path: '/requirements', label: 'Placement requirements', note: 'Who qualifies and how coverage is reviewed.' },
  { path: '/our-home', label: 'Our home', note: 'Photos of the North Chesterfield home.' },
  { path: '/faq', label: 'FAQ', note: 'Eligibility, tours, coverage, DD waivers, what we do not provide.' },
  { path: '/resources', label: 'Family resources', note: 'Placement guide for families and support coordinators.' },
  { path: '/placement-inquiry', label: 'Placement inquiry', note: 'Online form to start placement.' },
  { path: '/tour', label: 'Request a tour', note: 'Phone or in-person tour request.' },
  { path: '/contact', label: 'Contact', note: 'Phone, email, address.' }
];

export function GET() {
  const lines = [
    `# ${business.name}`,
    '',
    `> ${defaultDescription}`,
    '',
    `${business.name} is a residential supportive living home (an adult group home) for adults 18 and older with intellectual and developmental disabilities. The home is at ${business.address}. Staff support is available 24 hours a day, 7 days a week.`,
    '',
    '## Key facts',
    '',
    `- Address: ${business.address}`,
    `- Phone: ${business.phone}`,
    `- Email: ${business.email}`,
    `- Website: ${absoluteUrl('/')}`,
    `- Instagram: ${business.instagram}`,
    '- Who it serves: adults age 18+ with a developmental disorder diagnosis, support needs the home can meet, and acceptable insurance or coverage.',
    '- Coverage: Medicaid waiver, private pay, and other arrangements can be discussed; final verification happens during intake screening. Rates are not published on the website.',
    `- Areas families come from: ${locationSlugs.map((s) => locationPages[s].linkLabel).join('; ')}. All placement is at the North Chesterfield home.`,
    '- Does not provide: skilled nursing or clinical medical care on site, a day-support or day-program service for non-residents, or senior or memory care. Clinical services are coordinated with the providers already involved in a resident’s care.',
    '- How placement works: placement inquiry or call, then a screening call (timeframe, support level, coverage), then a phone or in-person tour, then intake coordination and transition planning.',
    '',
    '## Services',
    '',
    ...serviceSlugs.map((s) => `- [${servicePages[s].title}](${absoluteUrl(`/services/${s}`)}): ${servicePages[s].answer}`),
    '',
    '## Service areas',
    '',
    ...locationSlugs.map((s) => `- [${locationPages[s].linkLabel}](${absoluteUrl(`/locations/${s}`)}): ${locationPages[s].answer}`),
    '',
    '## Pages',
    '',
    ...STATIC_PAGES.map((p) => `- [${p.label}](${absoluteUrl(p.path)}): ${p.note}`),
    '',
    '## Frequently asked questions',
    '',
    ...faqs.flatMap((f) => [`### ${f.q}`, '', f.a, ...(f.source ? ['', `Source: ${f.source.url}`] : []), ''])
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
  });
}

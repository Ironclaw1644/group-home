export const business = {
  name: 'At Home Family Services, LLC',
  phone: '(804) 919-3030',
  phoneHref: 'tel:+18049193030',
  email: 'Athomefamilyservice@yahoo.com',
  address: '9207 Clovis St., North Chesterfield, VA 23237',
  instagram: 'https://instagram.com/athomefamilyservicesllc'
};

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/our-home', label: 'Our Home' },
  { href: '/requirements', label: 'Requirements' },
  { href: '/resources', label: 'Resources' },
  { href: '/faq', label: 'FAQ' },
  { href: '/announcements', label: 'Announcements' },
  { href: '/contact', label: 'Contact' }
];

export const exploreLinks = [
  { href: '/', label: 'Home' },
  { href: '/our-home', label: 'Our Home' },
  { href: '/requirements', label: 'Placement Requirements' },
  { href: '/resources', label: 'Family Resources' },
  { href: '/faq', label: 'FAQ' },
  { href: '/announcements', label: 'Announcements' },
  { href: '/contact', label: 'Contact Us' }
];

export const serviceSlugs = [
  'supportive-living-id-dd',
  'group-home-adults-id-dd',
  'life-skills-training',
  'community-outings',
  'individualized-support-plans'
] as const;

export const locationSlugs = [
  'north-chesterfield-va',
  'chesterfield-county-va',
  'richmond-va',
  'midlothian-va',
  'colonial-heights-va'
] as const;

export const servicePages = {
  'supportive-living-id-dd': {
    title: 'Supportive Living for Adults with ID/DD',
    metaTitle: '24/7 Supportive Living for Adults with ID/DD | VA',
    metaDescription: 'Round-the-clock residential support in a structured home: consistent staff, daily routines, medication coordination, and regular family contact.',
    linkLabel: 'Supportive Living for Adults',
    answer: 'At Home Family Services provides 24/7 supportive living for adults 18+ with intellectual and developmental disabilities at our home in North Chesterfield, Virginia. Residents have staff present around the clock in consistent shifts, predictable daily routines, medication support coordinated with their licensed providers, and regular contact with their families and support coordinators.',
    faqs: [
      { q: 'What is supportive living for adults with disabilities?', a: 'Supportive living is a residential home where adults live with staff support available around the clock. The focus is on daily life — routines, meals, life skills, and community participation — rather than clinical or skilled nursing care.' },
      { q: 'Is staff on site 24 hours a day?', a: 'Yes. Direct support professionals work in consistent shifts around the clock, so residents see familiar faces at breakfast, during the afternoon, and at bedtime.' },
      { q: 'How is medication handled?', a: 'Medication support is coordinated with the licensed providers already involved in a resident’s care. We do not provide skilled nursing or clinical medical care on site.' }
    ],
    summary: '24/7 supportive living in a warm, structured home environment focused on dignity, independence, and wellbeing.',
    bullets: ['24/7 staff support', 'Daily routines and life skills', 'Medication support coordination', 'Family communication'],
    detail: [
      'Supportive living means someone is present around the clock. Our direct support professionals work in consistent shifts so residents see familiar faces at breakfast, during the afternoon, and at bedtime — the kind of continuity that makes a house feel like home rather than a facility.',
      'Days follow a predictable rhythm: morning routines, meals together, personal care support, and quiet time. Predictability lowers stress for many adults with intellectual and developmental disabilities, and it gives staff a dependable baseline for noticing when something has changed.',
      'Medication support is coordinated with the licensed providers already involved in a resident’s care, and families and support coordinators hear from us regularly rather than only when something goes wrong.'
    ]
  },
  'group-home-adults-id-dd': {
    title: 'Group Home Placement for Adults with ID/DD',
    metaTitle: 'Group Home Placement for Adults with Disabilities | VA',
    metaDescription: 'Placement guidance, tours, intake coordination, and transition planning for families and support coordinators comparing adult group homes in the Richmond area.',
    linkLabel: 'Group Home Placement',
    answer: 'At Home Family Services helps families and support coordinators place adults 18+ with intellectual and developmental disabilities in our group home in North Chesterfield, Virginia. The process is a screening call about timeframe, support level, and coverage, then a tour by phone or in person, then intake coordination and transition planning if the fit is right.',
    faqs: [
      { q: 'How do I find a group home for an adult with disabilities near Richmond, VA?', a: 'Start by comparing homes on support level, location, and coverage. Our home is in North Chesterfield, a short drive from Richmond. Call (804) 919-3030 or send a placement inquiry with the timeframe, broad support needs, and coverage type, and we will set up a screening call.' },
      { q: 'Can a support coordinator join the tour?', a: 'Yes. Support coordinators are welcome on tour calls and in placement conversations, and we are used to working alongside case teams.' },
      { q: 'What happens after the tour?', a: 'If the fit is right, we move into intake coordination and transition planning: what a resident brings, which routines matter to them, who needs to be kept informed, and how to make the first weeks feel steady.' }
    ],
    summary: 'Placement support for families and coordinators seeking a safe, nurturing residential setting with consistent care.',
    bullets: ['Placement guidance', 'Tour scheduling', 'Intake coordination', 'Transition planning support'],
    detail: [
      'Choosing a group home is rarely a quick decision, and it should not be. Most families reach us while they are still comparing options, so our first conversation is about timeframe, support level, and coverage type — not paperwork.',
      'From there we schedule a tour, by phone or in person, so you can see the home and ask the questions that are hard to answer over email. Support coordinators are welcome on these calls, and we are used to working alongside case teams.',
      'If the fit is right, we move into intake coordination and transition planning: what a resident brings, what routines matter to them, who needs to be kept informed, and how we make the first weeks feel steady rather than disruptive.'
    ]
  },
  'life-skills-training': {
    title: 'Life Skills Training',
    metaTitle: 'Life Skills Training for Adults with Disabilities | VA',
    metaDescription: 'Hands-on daily-living support for adults with disabilities in North Chesterfield, VA: meal prep, personal care, home organization, and community skills.',
    linkLabel: 'Life Skills Training',
    answer: 'Life skills training at At Home Family Services is hands-on support with everyday routines — meal prep, personal care, home organization, and getting around the community — for adults with developmental disabilities living in our North Chesterfield, VA home. Staff work alongside residents and step back as confidence grows.',
    faqs: [
      { q: 'What life skills do residents practice?', a: 'Meal prep basics, personal care routines, keeping a bedroom and home organized, and community readiness such as managing money at a store, following a schedule, and asking for help when it is needed.' },
      { q: 'How is progress tracked?', a: 'Progress is tracked as part of each resident’s individualized support plan, so gains are recognized and the level of help can be adjusted as skills grow.' }
    ],
    summary: 'Hands-on support for everyday routines that build confidence and long-term independence.',
    bullets: ['Meal prep basics', 'Personal care routines', 'Home organization', 'Community readiness'],
    detail: [
      'Independence is built one ordinary task at a time. Making a sandwich, sorting laundry, keeping a bedroom the way you like it — these are the skills that decide how much of daily life a person can direct themselves.',
      'Staff work alongside residents rather than doing things for them, adjusting how much help is offered as confidence grows. A resident who needs step-by-step prompting for meal prep in month one may only need a reminder by month six.',
      'Skills practiced at home carry into the community: managing money at a store, following a schedule, asking for help when it is needed. Progress is tracked as part of each resident’s support plan so gains are recognized and built on.'
    ]
  },
  'community-outings': {
    title: 'Community Outings & Engagement',
    metaTitle: 'Community Outings & Engagement for Adults with ID/DD | VA',
    metaDescription: 'Community outings for adults with ID/DD in our North Chesterfield, VA home: recreation, appointments, and social time planned around each resident’s interests.',
    linkLabel: 'Community Outings',
    answer: 'Residents of At Home Family Services in North Chesterfield, VA go on community outings planned around their own interests — a park, a store, a local event — with staffing, timing, and structure set to each person’s support level. Staff also support residents in getting to and through appointments.',
    faqs: [
      { q: 'What kinds of outings do residents go on?', a: 'Outings are planned around what residents actually enjoy, such as a park, a store, or a local event, rather than a fixed activity calendar everyone is expected to want.' },
      { q: 'Do staff help with appointments?', a: 'Yes. Staff support residents in getting to and through appointments, which keeps care consistent and keeps families from having to manage every logistic themselves.' }
    ],
    summary: 'Meaningful community participation planned around safety, interests, and social growth.',
    bullets: ['Recreation outings', 'Appointments support', 'Social engagement', 'Structured schedules'],
    detail: [
      'A home should be a base, not a boundary. Outings are planned around what residents actually enjoy — a park, a store, a local event — rather than a fixed activity calendar everyone is expected to want.',
      'Every outing is planned with safety and support level in mind, including staffing, timing, and how much structure a particular resident needs to feel comfortable in a busy setting.',
      'Appointments are part of community life too. Staff support residents in getting to and through appointments, which keeps care consistent and keeps families from having to manage every logistic themselves.'
    ]
  },
  'individualized-support-plans': {
    title: 'Individualized Support Plans',
    metaTitle: 'Individualized Support Plans for Adults with ID/DD | VA',
    metaDescription: 'Personalized support plans for adults with ID/DD in North Chesterfield, VA: goal tracking, adjustable support levels, and work with families and case teams.',
    linkLabel: 'Individualized Support Plans',
    answer: 'Every resident of At Home Family Services has an individualized support plan that records their goals, the level of help each routine calls for, and the preferences that matter to their day. Plans are updated as skills or circumstances change, together with families and case teams.',
    faqs: [
      { q: 'What is in an individualized support plan?', a: 'Goals, the level of assistance each daily routine calls for, and the personal preferences that make a real difference to someone’s day.' },
      { q: 'Who is involved in the plan?', a: 'Families and case teams. We collaborate on goals, keep documentation current for the people who need it, and make sure everyone supporting a resident works from the same picture.' }
    ],
    summary: 'Personalized support planning aligned with each resident’s needs, goals, and level of assistance.',
    bullets: ['Goal tracking', 'Support level adjustments', 'Family/case team collaboration', 'Documentation support'],
    detail: [
      'No two residents need the same thing, so support is written down rather than assumed. A support plan records goals, the level of assistance each routine calls for, and the preferences that make a real difference to someone’s day.',
      'Plans are living documents. As a resident gains skills or circumstances change, support levels are adjusted rather than left at whatever was set during intake.',
      'Families and case teams are part of this. We collaborate on goals, keep documentation current for the people who need it, and make sure everyone supporting a resident is working from the same picture.'
    ]
  }
} as const;

export const locationPages = {
  'north-chesterfield-va': {
    title: 'Supportive Living in North Chesterfield, VA',
    metaTitle: 'Adult Group Home in North Chesterfield, VA | Book a Tour',
    metaDescription: 'Residential disability services for adults 18+ with developmental disabilities on Clovis St., North Chesterfield. Tours welcome — call (804) 919-3030.',
    linkLabel: 'North Chesterfield, VA',
    answer: 'At Home Family Services runs a 24/7 supportive living group home for adults 18+ with developmental disabilities at 9207 Clovis St., North Chesterfield, VA 23237. Families in North Chesterfield can tour the home by phone or in person; call (804) 919-3030 to ask about availability.',
    faqs: [
      { q: 'Is there a group home for adults with disabilities in North Chesterfield, VA?', a: 'Yes. At Home Family Services, LLC provides residential supportive living for adults 18+ with developmental disabilities at 9207 Clovis St., North Chesterfield, VA 23237, with staff support around the clock.' },
      { q: 'How do we arrange a tour?', a: 'Call (804) 919-3030 or request a tour online. Tours can be by phone or in person, and support coordinators are welcome to join.' }
    ],
    summary: 'Local placement and tour support for families seeking adult ID/DD residential care in North Chesterfield.',
    nearby: ['Chesterfield County', 'Richmond', 'Midlothian'],
    detail: [
      'Our home is located in North Chesterfield, on Clovis Street. For local families this means tours are easy to arrange and visits do not require a long drive — something that matters more than people expect once a placement is underway.',
      'Staying close to home also means residents can keep the connections they already have: the same familiar parts of town, and family who can visit without planning a trip around it.'
    ]
  },
  'chesterfield-county-va': {
    title: 'Adult Group Home Services in Chesterfield County, VA',
    metaTitle: 'Disability Services for Adults | Chesterfield County, VA',
    metaDescription: 'Group home placement and supportive living for adults 18+ with intellectual and developmental disabilities across Chesterfield County. Ask about availability.',
    linkLabel: 'Chesterfield County, VA',
    answer: 'Adults 18+ with intellectual and developmental disabilities from across Chesterfield County can live at At Home Family Services, a 24/7 supportive living home at 9207 Clovis St., North Chesterfield, VA 23237. We work with county families and support coordinators on placement; call (804) 919-3030 to ask about availability.',
    faqs: [
      { q: 'Is there a group home in Chesterfield, VA?', a: 'Yes. At Home Family Services, LLC is a supportive living home for adults 18+ with developmental disabilities in North Chesterfield, Chesterfield County, at 9207 Clovis St., North Chesterfield, VA 23237.' },
      { q: 'Where can Chesterfield County families ask about developmental disability services?', a: 'Chesterfield County’s Developmental Disability Services runs an intake line at (804) 717-6642 for county services and supports. For placement at our home, call us directly at (804) 919-3030.', source: { label: 'Chesterfield County Developmental Disability Services', url: 'https://www.chesterfield.gov/900/Developmental-Disability-Services' } }
    ],
    summary: 'Residential supportive living for adults 18+ with developmental disabilities in Chesterfield County.',
    nearby: ['North Chesterfield', 'Midlothian', 'Colonial Heights'],
    detail: [
      'We serve families throughout Chesterfield County from our North Chesterfield home, working with support coordinators across the county on placements for adults 18 and older.',
      'County families often come to us while weighing several residential options at once. We are glad to be one of the homes you compare, and we will be straightforward about whether our environment is the right fit for the support level you are describing.'
    ]
  },
  'richmond-va': {
    title: 'Residential Placement Support Near Richmond, VA',
    metaTitle: 'Disability Services & Group Home Placement | Richmond, VA',
    metaDescription: 'Residential disability services for adults 18+ at our North Chesterfield home, a short drive from Richmond. Phone or in-person tours available.',
    linkLabel: 'Richmond, VA',
    answer: 'Richmond families looking for a group home for an adult with developmental disabilities can consider At Home Family Services, a 24/7 supportive living home at 9207 Clovis St., North Chesterfield, VA 23237 — a short drive from Richmond. Phone and in-person tours are available; call (804) 919-3030.',
    faqs: [
      { q: 'Is there an adult group home near Richmond, VA?', a: 'Yes. At Home Family Services provides residential supportive living for adults 18+ with developmental disabilities at our North Chesterfield home, a short drive from Richmond (9207 Clovis St., North Chesterfield, VA 23237).' },
      { q: 'Do you work with Richmond-area support coordinators?', a: 'Regularly. We work with Richmond-area support coordinators and referral partners and are used to coordinating a placement conversation across a whole case team.' }
    ],
    summary: 'Families in Richmond can request tours and placement guidance for our supportive living home nearby.',
    nearby: ['North Chesterfield', 'Chesterfield County', 'Colonial Heights'],
    detail: [
      'Richmond families are a short drive from our North Chesterfield home, close enough for regular visits while giving a resident a quieter, residential setting to live in day to day.',
      'We regularly work with Richmond-area support coordinators and referral partners, and we are used to coordinating a placement conversation across a case team rather than a single point of contact.'
    ]
  },
  'midlothian-va': {
    title: 'Supportive Living Options Near Midlothian, VA',
    metaTitle: 'Disability Services for Adults Near Midlothian, VA',
    metaDescription: 'Supportive living and group home placement for adults with developmental disabilities, a short drive from Midlothian. Start with a phone tour.',
    linkLabel: 'Midlothian, VA',
    answer: 'At Home Family Services offers 24/7 supportive living for adults 18+ with developmental disabilities at our North Chesterfield home, a short drive from Midlothian (9207 Clovis St., North Chesterfield, VA 23237). A phone tour is the easiest first step; call (804) 919-3030.',
    faqs: [
      { q: 'Is there a group home for adults with disabilities near Midlothian, VA?', a: 'Yes. Our supportive living home for adults 18+ with developmental disabilities is in North Chesterfield, a short drive from Midlothian, so visits stay practical and familiar routines can continue.' },
      { q: 'What is the first step for a Midlothian family?', a: 'A phone tour. It takes very little time and gives you a clear sense of the home before arranging an in-person visit. Call (804) 919-3030 or request a tour online.' }
    ],
    summary: 'Explore a warm, structured home environment with trained support professionals and individualized care.',
    nearby: ['Chesterfield County', 'North Chesterfield', 'Richmond'],
    detail: [
      'For Midlothian families, our home offers nearby supportive living without moving a loved one out of the region entirely — visits stay practical, and familiar routines can continue.',
      'If you are early in the process, a phone tour is often the easiest first step. It takes very little time and gives you a clear sense of the environment before arranging an in-person visit.'
    ]
  },
  'colonial-heights-va': {
    title: 'Adult ID/DD Group Home Placement Near Colonial Heights, VA',
    metaTitle: 'Adult Disability Services Near Colonial Heights, VA',
    metaDescription: 'Residential placement for adults 18+ with developmental disabilities within reach of Colonial Heights. One screening call covers fit and coverage.',
    linkLabel: 'Colonial Heights, VA',
    answer: 'Colonial Heights families can place an adult 18+ with developmental disabilities at At Home Family Services, a 24/7 supportive living home at 9207 Clovis St., North Chesterfield, VA 23237. One screening call covers timeframe, support level, and coverage before any tour; call (804) 919-3030.',
    faqs: [
      { q: 'Is there an adult group home near Colonial Heights, VA?', a: 'At Home Family Services provides residential supportive living for adults 18+ with developmental disabilities at our home in North Chesterfield (9207 Clovis St., North Chesterfield, VA 23237), within reach of Colonial Heights.' },
      { q: 'How do you keep the process short for families farther away?', a: 'We start with one screening conversation about timeframe, support level, and coverage, and arrange a tour only once it is clear the fit makes sense.' }
    ],
    summary: 'Placement inquiries and tour requests for supportive living within reach of Colonial Heights families.',
    nearby: ['Chesterfield County', 'North Chesterfield', 'Richmond'],
    detail: [
      'Colonial Heights families are within reach of our North Chesterfield home, and we welcome placement inquiries and tour requests from the area.',
      'Because the drive is a little longer, we try to make the early steps efficient: one screening conversation to cover timeframe, support level, and coverage, then a tour only once it is clear the fit makes sense.'
    ]
  }
} as const;

export type SiteLink = { href: string; label: string };
export type SiteLinkGroup = { heading: string; links: SiteLink[] };

/**
 * Every indexable page on the site, grouped for display. Rendered in full on
 * every page (see components/site-link-hub.tsx) so the internal link graph is
 * complete and PageRank flows to every URL, including the location pages that
 * are not in the primary nav.
 *
 * Deliberately excluded: /admin and /admin/login (private), plus the two
 * transactional pages — /placement-inquiry/success and /unsubscribe — which
 * should not be reachable, or indexed, outside their own flows.
 */
export const siteDirectory: SiteLinkGroup[] = [
  {
    heading: 'Explore',
    links: exploreLinks
  },
  {
    heading: 'Services',
    links: [
      { href: '/services', label: 'All Services' },
      ...serviceSlugs.map((slug) => ({ href: `/services/${slug}`, label: servicePages[slug].linkLabel }))
    ]
  },
  {
    heading: 'Service Areas',
    links: [
      { href: '/locations', label: 'All Service Areas' },
      ...locationSlugs.map((slug) => ({ href: `/locations/${slug}`, label: locationPages[slug].linkLabel }))
    ]
  },
  {
    heading: 'Get Started',
    links: [
      { href: '/placement-inquiry', label: 'Start a Placement Inquiry' },
      { href: '/tour', label: 'Request a Tour' }
    ]
  }
];

/** Canonical list of indexable paths, derived from the directory so the sitemap can never drift from the nav. */
export const publicPaths = siteDirectory.flatMap((group) => group.links.map((link) => link.href));

/**
 * When each page's content genuinely last changed, for sitemap lastmod.
 * Bump the specific entry when you edit that page's copy. Do NOT wire this to
 * the build date: a lastmod that moves on every deploy is one Google stops
 * trusting, and this site needs that crawl signal to be credible.
 */
export const contentUpdatedAt: Record<string, string> = {
  default: '2026-10-21',
  '/': '2026-08-03',
  '/services': '2026-08-03',
  '/our-home': '2026-08-03',
  '/requirements': '2026-10-21',
  '/resources': '2026-08-03',
  '/faq': '2026-10-21',
  '/announcements': '2026-10-21',
  '/contact': '2026-10-21',
  '/locations': '2026-08-03',
  '/placement-inquiry': '2026-10-21',
  '/tour': '2026-10-21'
};

export const faqs = [
  {
    q: 'Who is eligible for placement?',
    a: 'Adults age 18+ with a developmental disorder and acceptable insurance or coverage are welcome to contact us for screening and next steps.'
  },
  {
    q: 'Do you provide medical care?',
    a: 'We provide supportive living services and daily living assistance. Specific clinical and medical services are coordinated with licensed providers as appropriate.'
  },
  {
    q: 'How quickly can a tour be scheduled?',
    a: 'Tour timing depends on availability, but we aim to respond quickly and offer flexible call or in-person options.'
  },
  {
    q: 'What should families share in the first inquiry?',
    a: 'Start with basic contact information, timeframe, broad support needs, and coverage type. Please do not submit private medical details through the form.'
  },
  {
    q: 'What is supportive living, and how is it different from a nursing home?',
    a: 'Supportive living is a residential home where adults live with staff support available around the clock. The focus is on daily life — routines, meals, life skills, and community participation — rather than clinical or skilled nursing care. Medical and clinical services are coordinated with the licensed providers already involved in a resident’s care.'
  },
  {
    q: 'What does a typical day look like?',
    a: 'Days follow a predictable rhythm: morning routines and personal care support, meals together, time for activities or community outings, and quiet time in the evening. Predictability lowers stress for many residents, and it helps staff notice quickly when something has changed.'
  },
  {
    q: 'Can families and support coordinators visit?',
    a: 'Yes. We expect families to stay involved and we are used to working alongside case teams and support coordinators. Visits are arranged with us in advance so they fit the household routine and respect the privacy of everyone living in the home.'
  },
  {
    q: 'Do you work with support coordinators and case managers?',
    a: 'Regularly. Coordinators are welcome on tour calls and in placement conversations, and we are comfortable being one of several homes a team is comparing. We would rather be honest early about whether our environment fits the support level being described than push a placement that will not work.'
  },
  {
    q: 'Which areas do you serve?',
    a: 'Our home is in North Chesterfield, Virginia, and we work with families and coordinators across Chesterfield County, Richmond, Midlothian, and Colonial Heights. Placement is at our North Chesterfield home regardless of which area an inquiry comes from.'
  },
  {
    q: 'What happens after we submit a placement inquiry?',
    a: 'We review the inquiry, then contact you for a screening call to talk through timeframe, support level, and coverage. If it looks like a fit, we arrange a tour by phone or in person. After that, intake coordination and transition planning cover move-in details and who needs to be kept informed.'
  },
  {
    q: 'How is coverage handled?',
    a: 'Acceptable insurance or coverage is required. Medicaid waiver, private pay, and other arrangements can be discussed, and final verification happens during intake screening rather than through the website. Please raise coverage questions on the screening call so we can give you an accurate answer.'
  },
  {
    q: 'What is a group home for adults with disabilities?',
    a: 'A group home is a shared residential house where a small number of adults with disabilities live together with staff support. At our North Chesterfield home that support is available 24/7 and centers on daily life: routines, meals, life skills, and community outings.'
  },
  {
    q: 'How much does a group home for adults with disabilities cost?',
    a: 'We do not publish rates on the website. Acceptable insurance or coverage is required; Medicaid waiver, private pay, and other arrangements can be discussed, and final verification happens during intake screening. Ask on the screening call and we will give you an accurate answer for your situation.'
  },
  {
    q: 'How do I get a DD waiver in Virginia?',
    a: 'Virginia’s Developmental Disabilities waivers (Building Independence, Family and Individual Supports, and Community Living) are run by the Department of Behavioral Health and Developmental Services (DBHDS). The first step is to contact your local Community Services Board (CSB) to be screened and assessed, and Virginia currently has a waiting list. We do not decide waiver eligibility; coverage for placement at our home is reviewed on the screening call.',
    source: { label: 'Virginia DBHDS: Waiver information for individuals and families', url: 'https://dbhds.virginia.gov/waiver-information-for-individuals-and-families/' }
  },
  {
    q: 'What services do you not provide?',
    a: 'We do not provide skilled nursing or clinical medical care on site, a day-support or day-program service for non-residents, or senior or memory care. Clinical services are coordinated with the providers already involved in a resident’s care.'
  }
];

export type FaqItem = { q: string; a: string; source?: { label: string; url: string } };

export const imageReferences = [
  {
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac',
    alt: 'Black caregiver smiling with older adult client in a home setting',
    credit: 'Unsplash reference placeholder'
  },
  {
    url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
    alt: 'Black care professional speaking with family at a table',
    credit: 'Unsplash reference placeholder'
  },
  {
    url: 'https://images.unsplash.com/photo-1516307365426-bea591f05011',
    alt: 'Comfortable modern living room with natural light',
    credit: 'Unsplash reference placeholder'
  }
];

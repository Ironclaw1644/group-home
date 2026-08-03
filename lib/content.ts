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
    metaDescription: 'Hands-on daily-living support that builds independence: meal prep, personal care routines, home organization, and community readiness.',
    linkLabel: 'Life Skills Training',
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
    metaDescription: 'Recreation, appointments, and social engagement planned around each resident’s interests, safety, and support level.',
    linkLabel: 'Community Outings',
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
    metaDescription: 'Personalized support planning with goal tracking, adjustable support levels, and collaboration with families and case teams.',
    linkLabel: 'Individualized Support Plans',
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
  }
];

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

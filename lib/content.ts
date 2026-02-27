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

export const footerLinks = [
  '/placement-inquiry',
  '/tour',
  '/services/supportive-living-id-dd',
  '/locations/north-chesterfield-va',
  '/resources',
  '/faq',
  '/contact'
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
    summary: '24/7 supportive living in a warm, structured home environment focused on dignity, independence, and wellbeing.',
    bullets: ['24/7 staff support', 'Daily routines and life skills', 'Medication support coordination', 'Family communication']
  },
  'group-home-adults-id-dd': {
    title: 'Group Home Placement for Adults with ID/DD',
    summary: 'Placement support for families and coordinators seeking a safe, nurturing residential setting with consistent care.',
    bullets: ['Placement guidance', 'Tour scheduling', 'Intake coordination', 'Transition planning support']
  },
  'life-skills-training': {
    title: 'Life Skills Training',
    summary: 'Hands-on support for everyday routines that build confidence and long-term independence.',
    bullets: ['Meal prep basics', 'Personal care routines', 'Home organization', 'Community readiness']
  },
  'community-outings': {
    title: 'Community Outings & Engagement',
    summary: 'Meaningful community participation planned around safety, interests, and social growth.',
    bullets: ['Recreation outings', 'Appointments support', 'Social engagement', 'Structured schedules']
  },
  'individualized-support-plans': {
    title: 'Individualized Support Plans',
    summary: 'Personalized support planning aligned with each resident’s needs, goals, and level of assistance.',
    bullets: ['Goal tracking', 'Support level adjustments', 'Family/case team collaboration', 'Documentation support']
  }
} as const;

export const locationPages = {
  'north-chesterfield-va': {
    title: 'Supportive Living in North Chesterfield, VA',
    summary: 'Local placement and tour support for families seeking adult ID/DD residential care in North Chesterfield.',
    nearby: ['Chesterfield County', 'Richmond', 'Midlothian']
  },
  'chesterfield-county-va': {
    title: 'Adult Group Home Services in Chesterfield County, VA',
    summary: 'Residential supportive living for adults 18+ with developmental disabilities in Chesterfield County.',
    nearby: ['North Chesterfield', 'Midlothian', 'Colonial Heights']
  },
  'richmond-va': {
    title: 'Residential Placement Support Near Richmond, VA',
    summary: 'Families in Richmond can request tours and placement guidance for our supportive living home nearby.',
    nearby: ['North Chesterfield', 'Chesterfield County', 'Colonial Heights']
  },
  'midlothian-va': {
    title: 'Supportive Living Options Near Midlothian, VA',
    summary: 'Explore a warm, structured home environment with trained support professionals and individualized care.',
    nearby: ['Chesterfield County', 'North Chesterfield', 'Richmond']
  },
  'colonial-heights-va': {
    title: 'Adult ID/DD Group Home Placement Near Colonial Heights, VA',
    summary: 'Placement inquiries and tour requests for supportive living within reach of Colonial Heights families.',
    nearby: ['Chesterfield County', 'North Chesterfield', 'Richmond']
  }
} as const;

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

/**
 * One-question-per-page answers for families and support coordinators
 * ("People also ask" questions from the Chesterfield, VA SERPs).
 *
 * Rules for this file:
 * - Every statement about Virginia waivers, regulations or eligibility must be
 *   backed by one of the page's `sources`, read on the date in `reviewed`.
 * - Facts about At Home Family Services come only from what the rest of the
 *   site already states (lib/content.ts, /requirements, /resources).
 * - Never claim licensing, waiver enrollment, rates, capacity or staff
 *   credentials for At Home Family Services. Those are owner-supplied facts.
 */

export type Source = { label: string; url: string };
export type GuideLink = { href: string; label: string };

export type FamilyQuestion = {
  slug: string;
  question: string;
  /** Short label for the site directory and link lists. */
  label: string;
  metaTitle: string;
  metaDescription: string;
  /** Opens by restating the question; quotable whole. */
  answer: string;
  sections: { heading: string; paragraphs?: string[]; items?: string[] }[];
  /** What this means at At Home Family Services, from facts the site already states. */
  atOurHome: string;
  moneyLinks: GuideLink[];
  related: string[];
  sources: Source[];
  reviewed: string;
};

const SRC = {
  rule390: { label: '12VAC30-122-390, Group home residential service (Virginia Administrative Code)', url: 'https://law.lis.virginia.gov/admincode/title12/agency30/chapter122/section390/' },
  rule250: { label: '12VAC30-122-250, Services covered in the Community Living Waiver', url: 'https://law.lis.virginia.gov/admincode/title12/agency30/chapter122/section250/' },
  rule90: { label: '12VAC30-122-90, Waiting list, criteria and slot assignment', url: 'https://law.lis.virginia.gov/admincode/title12/agency30/chapter122/section90/' },
  rule20: { label: '12VAC30-122-20, Definitions (DD Waivers)', url: 'https://law.lis.virginia.gov/admincode/title12/agency30/chapter122/section20/' },
  cfr441: { label: '42 CFR 441.310, Limits on federal financial participation (room and board)', url: 'https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-441/subpart-G/section-441.310' },
  dmasDd: { label: 'Virginia DMAS: Developmental Disability (DD) Waivers', url: 'https://www.dmas.virginia.gov/for-members/benefits-and-services/waivers/developmental-disability-dd-waivers/' },
  dmasCl: { label: 'Virginia DMAS: Community Living (CL) Waiver Fact Sheet 2025', url: 'https://www.dmas.virginia.gov/media/ee2jpjzc/cl-waiver-fact-sheet-2025-english.pdf' },
  dmasBi: { label: 'Virginia DMAS: Building Independence (BI) Waiver Fact Sheet 2025', url: 'https://www.dmas.virginia.gov/media/4nhgggad/bi-waiver-fact-sheet-english.pdf' },
  dmasFis: { label: 'Virginia DMAS: Family and Individual Supports (FIS) Waiver Fact Sheet 2025', url: 'https://www.dmas.virginia.gov/media/0lfc55xd/fis-waiver-fact-sheet-2025-english.pdf' },
  dbhdsWaiver: { label: 'Virginia DBHDS: Waiver information for individuals and families', url: 'https://dbhds.virginia.gov/waiver-information-for-individuals-and-families/' },
  mlmcWaitlist: { label: 'My Life, My Community: Accessing the waiver waitlist forms', url: 'https://mylifemycommunityvirginia.org/accessing-waiver-waitlist-forms' },
  mlmc: { label: 'My Life, My Community (DBHDS)', url: 'https://mylifemycommunityvirginia.org/' },
  vacsb: { label: 'Virginia Association of Community Services Boards: CSB/BHA directory', url: 'https://vacsb.org/csb-bha-directory/' },
  chesterfieldDd: { label: 'Chesterfield County Developmental Disability Services', url: 'https://www.chesterfield.gov/900/Developmental-Disability-Services' },
  code100: { label: 'Code of Virginia § 37.2-100, Definitions', url: 'https://law.lis.virginia.gov/vacode/title37.2/chapter1/section37.2-100/' }
} satisfies Record<string, Source>;

const REVIEWED = '2026-11-02';

export const familyQuestions: FamilyQuestion[] = [
  {
    slug: 'how-much-does-a-group-home-cost-in-virginia',
    question: 'How much does a group home for adults with disabilities cost in Virginia?',
    label: 'Group home cost in Virginia',
    metaTitle: 'Group Home Cost for Adults with Disabilities in Virginia',
    metaDescription: 'What sets the cost of a group home for an adult with a disability in Virginia: DD waiver rates, room and board, private pay, and the questions to ask a home.',
    answer:
      'The cost of a group home for an adult with a disability in Virginia depends on how the stay is paid for. When the Community Living (CL) Medicaid waiver pays for group home residential services, Virginia Medicaid (DMAS) pays the provider at rates it publishes, and the rate depends on the person’s assessed level of support and the home’s licensed bed capacity. Waiver funding does not pay for room and board, so that is a separate cost. Private-pay prices are set by each home.',
    sections: [
      {
        heading: 'What waiver funding pays for',
        paragraphs: [
          'Virginia’s rules describe group home residential service as skill-building, routine supports, general supports and safety supports that help a person live successfully in the community. It is billed by the day, and it is a tiered service: the reimbursement depends on the level and tier assigned to the person and the licensed bed capacity of the home.',
          'DMAS’s waiver fact sheets point to its Developmental Disability Waivers page for the current reimbursement rates.'
        ]
      },
      {
        heading: 'Room and board is a separate cost',
        paragraphs: [
          'Federal Medicaid rules exclude the cost of room and board from home and community-based waiver funding, apart from narrow exceptions such as respite care in a facility that is not a private residence. In practice the waiver pays for the support, and rent and meals are paid separately. Ask every home what its room and board charge is and exactly what it includes.'
        ]
      },
      {
        heading: 'Private pay and other coverage',
        paragraphs: [
          'There is no single statewide price for private pay. Each home sets its own, so compare written figures from each home you are considering, and ask what is included and what is billed separately.'
        ]
      }
    ],
    atOurHome:
      'At Home Family Services does not publish rates on the website. Acceptable insurance or coverage is required. Medicaid waiver, private pay and other arrangements can be discussed, and final verification happens during intake screening. Call (804) 919-3030 and we will give you an accurate answer for your situation.',
    moneyLinks: [
      { href: '/requirements', label: 'Placement requirements and coverage' },
      { href: '/services/group-home-adults-id-dd', label: 'Group home placement for adults with disabilities' }
    ],
    related: ['which-dd-waiver-pays-for-a-group-home-in-virginia', 'is-there-a-waiting-list-for-the-dd-waiver-in-virginia', 'what-qualifies-a-person-for-a-group-home-in-virginia'],
    sources: [SRC.rule390, SRC.cfr441, SRC.dmasDd, SRC.dmasCl],
    reviewed: REVIEWED
  },
  {
    slug: 'which-dd-waiver-pays-for-a-group-home-in-virginia',
    question: 'Which Virginia DD waiver pays for a group home?',
    label: 'Which DD waiver covers a group home',
    metaTitle: 'Which Virginia DD Waiver Pays for a Group Home?',
    metaDescription: 'In Virginia, group home residential services are covered by the Community Living (CL) waiver, not FIS or BI. How the three DD waivers differ and how slots work.',
    answer:
      'In Virginia, the Community Living (CL) waiver is the DD waiver that pays for group home residential services. The state’s waiver rules say group home residential service is covered in the CL waiver, and it is not on the list of services in the Family and Individual Supports (FIS) or Building Independence (BI) waivers. The CL waiver is designed for people who need some form of residential service 24 hours a day, seven days a week.',
    sections: [
      {
        heading: 'The three DD waivers at a glance',
        items: [
          'Building Independence (BI): for adults 18 and older who can live mostly independently and do not need supports all the time. People on this waiver usually own, lease or control their own living arrangements, and its residential services are shared living and independent living.',
          'Family and Individual Supports (FIS): for children and adults who live with family, friends or in their own homes. Its residential services are shared living, in-home supports and supported living.',
          'Community Living (CL): for children and adults who usually need supports in their homes all the time. Its residential services include group home residential and sponsored residential.'
        ]
      },
      {
        heading: 'How a CL slot is assigned',
        paragraphs: [
          'Slots are assigned by urgency of need, not by date of application. DBHDS makes the final decision about which waiver best fits a person’s assessed needs. Under the state rules, FIS slots are offered unless the person shows an immediate need for a residential service such as group home residential or sponsored residential, which are only offered in the CL waiver.',
          'Someone already on another DD waiver whose assessed needs change, for example because they now need group home residential, can be moved to the CL waiver through a reserve slot instead of going back on the waiting list.'
        ]
      }
    ],
    atOurHome:
      'At Home Family Services does not decide waiver eligibility. Your Community Services Board and support coordinator handle waiver screening and slot assignment. Coverage for placement at our North Chesterfield home, whether Medicaid waiver, private pay or another arrangement, is reviewed on the screening call.',
    moneyLinks: [
      { href: '/requirements', label: 'Placement requirements and coverage' },
      { href: '/services/supportive-living-id-dd', label: '24/7 supportive living for adults with disabilities' }
    ],
    related: ['is-there-a-waiting-list-for-the-dd-waiver-in-virginia', 'how-much-does-a-group-home-cost-in-virginia', 'what-is-a-group-home-for-adults-with-disabilities-called'],
    sources: [SRC.rule390, SRC.rule250, SRC.rule90, SRC.dmasDd, SRC.dmasCl, SRC.dmasFis, SRC.dmasBi],
    reviewed: REVIEWED
  },
  {
    slug: 'is-there-a-waiting-list-for-the-dd-waiver-in-virginia',
    question: 'Is there a waiting list for the DD waiver in Virginia?',
    label: 'DD waiver waiting list',
    metaTitle: 'Is There a DD Waiver Waiting List in Virginia?',
    metaDescription: 'Yes. Virginia keeps a statewide DD waiver waiting list. How the three priority levels work, who assigns slots, emergency access, and yearly forms to stay on.',
    answer:
      'Yes. Virginia has a statewide DD Waivers waiting list, kept by the Department of Behavioral Health and Developmental Services (DBHDS) and updated at least once a year. Slots are not handed out first come, first served. They are assigned by urgency of need, and getting on the list starts with a screening at your local Community Services Board (CSB).',
    sections: [
      {
        heading: 'The three priority levels',
        paragraphs: ['A support coordinator places each person in the priority level that best describes their need, based on talking with the person and family and on their diagnosis and assessment form.'],
        items: [
          'Priority One: needs a waiver service within one year and meets at least one urgent criterion, such as an unpaid primary caregiver whose own health condition significantly limits their ability to provide care, a risk to health or safety that cannot be managed even with other supports, living in an institution with a workable discharge plan, or being a young adult under 27 who has aged out of special education (IDEA) services and wants to live independently.',
          'Priority Two: will need a waiver service in one to five years, for example because a caregiver’s condition is declining or the person is at risk of losing housing or employment supports.',
          'Priority Three: will need a waiver slot in five years or longer, as long as current supports stay in place.'
        ]
      },
      {
        heading: 'Who decides who gets a slot',
        paragraphs: [
          'Each area has a Waiver Slot Assignment Committee (WSAC): trained community volunteers who are not employees of a CSB or of a private provider of support coordination or waiver services. When a slot opens, the committee reviews the people in Priority One who are most in need and recommends the person with the highest need. DBHDS makes the final determination.'
        ]
      },
      {
        heading: 'Emergency access',
        paragraphs: [
          'Virginia sets aside emergency slots for a short list of situations, for example when the primary caregiver has died or no other caregiver is available and the person cannot care for themselves, or when adult protective services finds that the person needs and accepts protective services. Emergency requests go from the CSB to DBHDS.'
        ]
      },
      {
        heading: 'Staying on the list',
        paragraphs: [
          'Every year, people on the waiting list must complete the Annual Attestation Documentation of Individual Choice for Home and Community-Based Services form (the Choice form) to stay on it. The Needed Services form is optional. Both can be completed online through the DBHDS waitlist portal, and My Life, My Community answers questions at 844-603-9248, Monday to Friday, 9 AM to 4 PM.'
        ]
      }
    ],
    atOurHome:
      'A waiver slot is not the only route to placement. At At Home Family Services, Medicaid waiver, private pay and other arrangements can be discussed, and coverage is confirmed on the screening call. If you are still on the waiting list, call (804) 919-3030 and we will talk through what is possible.',
    moneyLinks: [
      { href: '/requirements', label: 'Placement requirements and coverage' },
      { href: '/placement-inquiry', label: 'Start a placement inquiry' }
    ],
    related: ['which-dd-waiver-pays-for-a-group-home-in-virginia', 'what-does-a-support-coordinator-do-in-virginia', 'what-counts-as-a-developmental-disability-in-virginia'],
    sources: [SRC.rule90, SRC.dbhdsWaiver, SRC.mlmcWaitlist, SRC.dmasDd],
    reviewed: REVIEWED
  },
  {
    slug: 'what-is-a-group-home-for-adults-with-disabilities-called',
    question: 'What is a group home for adults with disabilities called?',
    label: 'Other names for a group home',
    metaTitle: 'What Is a Group Home for Adults with Disabilities Called?',
    metaDescription: 'Adult group home, residential home, supportive living: the names you will hear, and how Virginia’s waiver rules define group home and sponsored living.',
    answer:
      'A group home for adults with disabilities goes by several names: adult group home, residential home, supportive living home or community residential setting. In Virginia’s Medicaid waiver rules, the support provided there is called group home residential service, delivered in a residence licensed by DBHDS or in an adult foster care home approved by the local department of social services.',
    sections: [
      {
        heading: 'Virginia’s residential service types, side by side',
        paragraphs: ['Families comparing options will hear these terms from support coordinators. They describe different living arrangements, not just different names.'],
        items: [
          'Group home residential: support in a group home or an adult foster care home, provided continuously up to 24 hours a day by paid staff who are physically present. For Medicaid reimbursement, a setting can have no more than six licensed beds, although larger homes that became DD waiver providers before March 31, 2021 may continue.',
          'Sponsored residential: support in the home of a family or person (the sponsor) who supports no more than two individuals, under the supervision of a DBHDS-licensed provider.',
          'Supported living residential: support in an apartment or other residential setting operated by a DBHDS-licensed provider.',
          'Shared living: a roommate lives in the same household and provides a limited, agreed amount of support, and part of the roommate’s share of rent, food and utilities is reimbursed.',
          'In-home supports: support that takes place mainly in the person’s own home or family home, alongside the care family or other unpaid caregivers already provide.'
        ]
      }
    ],
    atOurHome:
      'At Home Family Services describes its home as supportive living: a group home in North Chesterfield, Virginia, for adults 18 and older with developmental disabilities, with staff support around the clock. The focus is daily life, meaning routines, meals, life skills and community outings, not skilled nursing or clinical care.',
    moneyLinks: [
      { href: '/services/supportive-living-id-dd', label: '24/7 supportive living for adults with disabilities' },
      { href: '/our-home', label: 'See our North Chesterfield home' }
    ],
    related: ['which-dd-waiver-pays-for-a-group-home-in-virginia', 'questions-to-ask-when-touring-a-group-home', 'how-to-find-a-group-home-for-an-adult-with-a-disability-in-virginia'],
    sources: [SRC.rule20, SRC.rule390],
    reviewed: REVIEWED
  },
  {
    slug: 'what-qualifies-a-person-for-a-group-home-in-virginia',
    question: 'What qualifies a person for a group home in Virginia?',
    label: 'Who qualifies for a group home',
    metaTitle: 'What Qualifies a Person for a Group Home in Virginia?',
    metaDescription: 'Group home eligibility in Virginia has two parts: the home’s own criteria and, if Medicaid pays, the Community Living waiver rules. Both explained with sources.',
    answer:
      'Two things decide whether a person qualifies for a group home in Virginia: the home’s own admission criteria and, if Medicaid will pay, eligibility for the Community Living (CL) waiver. At At Home Family Services, a person must be an adult 18 or older with a developmental disorder diagnosis, have support needs our home can meet, and have acceptable insurance or coverage.',
    sections: [
      {
        heading: 'Community Living waiver eligibility',
        paragraphs: ['According to the DMAS fact sheet, the CL waiver is for children and adults who:'],
        items: [
          'meet the ICF/IID level of care criteria;',
          'require waiver services within 30 days;',
          'have a diagnosis of a developmental disability; and',
          'are found to need community-based waiver services to delay or avoid placement in an institution, or to leave one.'
        ]
      },
      {
        heading: 'How enrollment actually happens',
        paragraphs: [
          'Under the state rules, a person is enrolled in a DD waiver when four things are true: the local department of social services has found them financially eligible for Medicaid, their support coordinator has found that they meet the functional eligibility criteria, DBHDS has confirmed a waiver slot is available, and the person has accepted the slot.',
          'DBHDS also requires a Supports Intensity Scale (SIS) assessment for nearly everyone who receives DD waiver services. It measures the pattern and intensity of support a person needs.'
        ]
      },
      {
        heading: 'Fit runs both ways',
        paragraphs: [
          'Meeting the criteria is a starting point. A good placement also depends on whether a particular household suits a particular person: the level of daily support they need, how they do in a shared home with other adults, and which routines matter to them.'
        ]
      }
    ],
    atOurHome:
      'We review each inquiry individually and confirm eligibility, fit and coverage on a screening call. If we are not the right fit, we will say so directly rather than leave you waiting.',
    moneyLinks: [
      { href: '/requirements', label: 'Our placement requirements' },
      { href: '/placement-inquiry', label: 'Start a placement inquiry' }
    ],
    related: ['what-counts-as-a-developmental-disability-in-virginia', 'which-dd-waiver-pays-for-a-group-home-in-virginia', 'how-much-does-a-group-home-cost-in-virginia'],
    sources: [SRC.dmasCl, SRC.rule20, SRC.dbhdsWaiver],
    reviewed: REVIEWED
  },
  {
    slug: 'how-to-find-a-group-home-for-an-adult-with-a-disability-in-virginia',
    question: 'How do I find a group home for an adult with a disability in Virginia?',
    label: 'How to find a group home',
    metaTitle: 'How to Find a Group Home for an Adult with a Disability, VA',
    metaDescription: 'Finding a group home in Virginia: start with your CSB, search the state provider directories, shortlist by support type and funding, then tour each home.',
    answer:
      'To find a group home for an adult with a disability in Virginia, start with your local Community Services Board (CSB). The CSB is the first step for DD waiver screening and assessment and can connect you with support coordination. Then search Virginia’s provider directories, shortlist homes by support type, funding and location, and tour each one with the same list of questions.',
    sections: [
      {
        heading: '1. Contact your Community Services Board',
        paragraphs: ['Each Virginia locality is served by a CSB or behavioral health authority. In the areas we work with most:'],
        items: [
          'Chesterfield County, including North Chesterfield and Midlothian: Chesterfield County Developmental Disability Services, (804) 717-6642. Press two to speak with the intake coordinator, or press one to schedule an intake meeting.',
          'City of Richmond: Richmond Behavioral Health Authority, (804) 819-4000.',
          'Colonial Heights, Petersburg and Hopewell: Greater Reach Community Services Board, (804) 862-8008.'
        ]
      },
      {
        heading: '2. Search the state directories',
        paragraphs: [
          'Virginia Medicaid (DMAS) links to two places to find DD waiver providers: the provider search on its Medicaid Enterprise System (MES) website, and My Life, My Community, a searchable resource site that DBHDS built with disAbilityNavigator.'
        ]
      },
      {
        heading: '3. Shortlist, then tour',
        paragraphs: [
          'Narrow the list by the kind of residential support the person needs, how the stay will be paid for, and how close the home is to family. Then tour every home on the shortlist and ask each one the same questions, so the answers can be compared side by side.'
        ]
      }
    ],
    atOurHome:
      'If you are near Chesterfield, At Home Family Services runs a 24/7 supportive living home for adults 18 and older with developmental disabilities at 9207 Clovis St., North Chesterfield, VA 23237. Tours are by phone or in person, and support coordinators are welcome to join. Call (804) 919-3030.',
    moneyLinks: [
      { href: '/services/group-home-adults-id-dd', label: 'Group home placement for adults with disabilities' },
      { href: '/tour', label: 'Request a tour' }
    ],
    related: ['questions-to-ask-when-touring-a-group-home', 'what-does-a-support-coordinator-do-in-virginia', 'what-is-a-group-home-for-adults-with-disabilities-called'],
    sources: [SRC.dbhdsWaiver, SRC.dmasDd, SRC.vacsb, SRC.chesterfieldDd, SRC.mlmc],
    reviewed: REVIEWED
  },
  {
    slug: 'what-does-a-support-coordinator-do-in-virginia',
    question: 'What does a support coordinator do in Virginia?',
    label: 'What a support coordinator does',
    metaTitle: 'What Does a Support Coordinator Do in Virginia? DD Waivers',
    metaDescription: 'A Virginia support coordinator (formerly case manager) plans and links DD waiver services, sets waiting-list priority, and monitors care. What to expect.',
    answer:
      'In Virginia, a support coordinator, formerly called a case manager, helps a person with a developmental disability plan, find and keep the services they need. Support coordinators are employed by the local Community Services Board (CSB) or by a private organization under contract with it. They assess needs, plan services, link the person to providers, coordinate between agencies, and check that authorized services are actually delivered.',
    sections: [
      {
        heading: 'What the role covers',
        items: [
          'Assessing needs and planning services.',
          'Linking the person to the services and supports in their individual support plan.',
          'Helping the person locate, develop or obtain needed services and resources.',
          'Coordinating services and planning with other agencies and providers.',
          'Monitoring progress and making sure authorized services are delivered.',
          'Educating and counseling the person to help them build supportive relationships.'
        ]
      },
      {
        heading: 'Their part in the waiting list',
        paragraphs: [
          'The support coordinator decides which priority level a person is placed in on the DD Waivers waiting list, and completes the forms a Waiver Slot Assignment Committee uses to compare people’s needs when a slot opens.'
        ]
      },
      {
        heading: 'Working with a group home',
        paragraphs: [
          'The individual support plan is developed together by the person, their family as appropriate, their providers and the support coordinator. Virginia’s rules require group home residential providers to submit a written review to the support coordinator at least every quarter.'
        ]
      }
    ],
    atOurHome:
      'Support coordinators are welcome on tour calls and in placement conversations at At Home Family Services, and we are used to working alongside case teams. Every resident has an individualized support plan that we keep current with families and case teams.',
    moneyLinks: [
      { href: '/services/individualized-support-plans', label: 'Individualized support plans' },
      { href: '/resources', label: 'Placement guide for families and support coordinators' }
    ],
    related: ['is-there-a-waiting-list-for-the-dd-waiver-in-virginia', 'how-to-find-a-group-home-for-an-adult-with-a-disability-in-virginia', 'questions-to-ask-when-touring-a-group-home'],
    sources: [SRC.rule20, SRC.rule90, SRC.rule390],
    reviewed: REVIEWED
  },
  {
    slug: 'questions-to-ask-when-touring-a-group-home',
    question: 'What should I ask when touring a group home?',
    label: 'What to ask on a group home tour',
    metaTitle: 'What Should I Ask When Touring a Group Home? | Virginia',
    metaDescription: 'The questions to ask on a group home tour: staffing day and night, daily routines, communication, who else lives there, funding, and what makes a bad fit.',
    answer:
      'When you tour a group home, ask about the things brochures rarely cover: who is on shift during the day and at night, how staff tell you when something changes, who else lives in the house, what would make the home the wrong fit, and what funding it can accept. Ask every home the same questions and compare the answers side by side.',
    sections: [
      {
        heading: 'Staffing',
        items: [
          'Who will be with the resident in the morning, the afternoon and at bedtime, and how often do those faces change?',
          'What happens overnight? Virginia’s waiver rules count both awake staff during nighttime hours and asleep staff on the premises as ways of providing general supports, so ask which one the home uses.'
        ]
      },
      {
        heading: 'Daily life',
        items: [
          'What does a typical weekday and weekend look like?',
          'How are outings chosen, and how are appointments handled?',
          'How are a resident’s own routines and preferences written down and followed?'
        ]
      },
      {
        heading: 'Communication',
        items: [
          'How and when will the family hear from the home, and not only when something goes wrong?',
          'How does the home work with the support coordinator and the rest of the case team?'
        ]
      },
      {
        heading: 'The household',
        items: [
          'Who else lives in the home, and how many people? For Medicaid waiver reimbursement, newer group home settings are limited to six licensed beds.',
          'How are visits arranged so they fit the household and respect everyone’s privacy?'
        ]
      },
      {
        heading: 'Fit and funding',
        items: [
          'What would make this home the wrong fit? A provider who cannot answer has not thought carefully about fit.',
          'How quickly will you tell us no? A slow no costs weeks you may not have.',
          'Which license does the home operate under, and can it accept the waiver or other coverage you have?'
        ]
      }
    ],
    atOurHome:
      'At Home Family Services offers tours by phone or in person. You see the home, meet staff and ask the questions that are hard to settle over email, and support coordinators are welcome to join. We will be straightforward about whether our environment fits the support level you describe.',
    moneyLinks: [
      { href: '/tour', label: 'Request a tour of our North Chesterfield home' },
      { href: '/our-home', label: 'See photos of our home' }
    ],
    related: ['how-to-find-a-group-home-for-an-adult-with-a-disability-in-virginia', 'what-is-a-group-home-for-adults-with-disabilities-called', 'how-much-does-a-group-home-cost-in-virginia'],
    sources: [SRC.rule20, SRC.rule390],
    reviewed: REVIEWED
  },
  {
    slug: 'what-counts-as-a-developmental-disability-in-virginia',
    question: 'What counts as a developmental disability in Virginia?',
    label: 'What counts as a developmental disability',
    metaTitle: 'What Counts as a Developmental Disability in Virginia?',
    metaDescription: 'Virginia law defines a developmental disability with a five-part test: onset before 22, lasting, limits in three or more life areas. What it means for care.',
    answer:
      'Under Virginia law, a developmental disability is a severe, chronic disability caused by a mental or physical impairment, or both, that is not a sole diagnosis of mental illness. It must appear before age 22, be likely to continue indefinitely, cause substantial functional limitations in three or more major life areas, and call for lifelong or extended supports that are individually planned and coordinated.',
    sections: [
      {
        heading: 'The major life areas in the definition',
        paragraphs: ['The law looks for substantial functional limitations in at least three of these seven areas:'],
        items: ['Self-care', 'Receptive and expressive language', 'Learning', 'Mobility', 'Self-direction', 'Capacity for independent living', 'Economic self-sufficiency']
      },
      {
        heading: 'Why the definition matters',
        paragraphs: [
          'A diagnosis of developmental disability under this definition is one of the requirements for being placed on Virginia’s DD Waivers waiting list. A mental illness diagnosis on its own does not meet it.',
          'Your local Community Services Board is the first step for being screened and assessed for DD waiver services.'
        ]
      }
    ],
    atOurHome:
      'At Home Family Services serves adults 18 and older with a developmental disorder diagnosis whose support needs our home can meet. We do not diagnose or decide waiver eligibility; we confirm fit and coverage on a screening call.',
    moneyLinks: [
      { href: '/requirements', label: 'Our placement requirements' },
      { href: '/services/group-home-adults-id-dd', label: 'Group home placement for adults with ID/DD' }
    ],
    related: ['what-qualifies-a-person-for-a-group-home-in-virginia', 'is-there-a-waiting-list-for-the-dd-waiver-in-virginia', 'what-does-a-support-coordinator-do-in-virginia'],
    sources: [SRC.code100, SRC.rule90, SRC.dbhdsWaiver],
    reviewed: REVIEWED
  }
];

export const familyQuestionPath = (slug: string) => `/faq/${slug}`;

export function getFamilyQuestion(slug: string) {
  return familyQuestions.find((item) => item.slug === slug);
}

/** Which guides each money page links out to, so authority flows both ways. */
export const guidesForPage: Record<string, string[]> = {
  '/': ['how-much-does-a-group-home-cost-in-virginia', 'which-dd-waiver-pays-for-a-group-home-in-virginia', 'how-to-find-a-group-home-for-an-adult-with-a-disability-in-virginia', 'questions-to-ask-when-touring-a-group-home'],
  '/requirements': ['what-qualifies-a-person-for-a-group-home-in-virginia', 'what-counts-as-a-developmental-disability-in-virginia', 'which-dd-waiver-pays-for-a-group-home-in-virginia', 'is-there-a-waiting-list-for-the-dd-waiver-in-virginia', 'how-much-does-a-group-home-cost-in-virginia'],
  '/resources': ['how-to-find-a-group-home-for-an-adult-with-a-disability-in-virginia', 'questions-to-ask-when-touring-a-group-home', 'what-does-a-support-coordinator-do-in-virginia', 'what-is-a-group-home-for-adults-with-disabilities-called'],
  '/tour': ['questions-to-ask-when-touring-a-group-home'],
  '/services/supportive-living-id-dd': ['what-is-a-group-home-for-adults-with-disabilities-called', 'what-qualifies-a-person-for-a-group-home-in-virginia', 'which-dd-waiver-pays-for-a-group-home-in-virginia'],
  '/services/group-home-adults-id-dd': ['how-to-find-a-group-home-for-an-adult-with-a-disability-in-virginia', 'how-much-does-a-group-home-cost-in-virginia', 'questions-to-ask-when-touring-a-group-home', 'which-dd-waiver-pays-for-a-group-home-in-virginia'],
  '/services/life-skills-training': ['what-is-a-group-home-for-adults-with-disabilities-called', 'what-qualifies-a-person-for-a-group-home-in-virginia'],
  '/services/community-outings': ['questions-to-ask-when-touring-a-group-home', 'what-is-a-group-home-for-adults-with-disabilities-called'],
  '/services/individualized-support-plans': ['what-does-a-support-coordinator-do-in-virginia', 'is-there-a-waiting-list-for-the-dd-waiver-in-virginia'],
  location: ['how-to-find-a-group-home-for-an-adult-with-a-disability-in-virginia', 'how-much-does-a-group-home-cost-in-virginia', 'questions-to-ask-when-touring-a-group-home']
};

export function guidesFor(key: string) {
  return (guidesForPage[key] ?? []).map((slug) => getFamilyQuestion(slug)).filter((item): item is FamilyQuestion => Boolean(item));
}

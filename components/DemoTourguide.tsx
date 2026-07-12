'use client';

import { useEffect } from 'react';
import { mountTourguide } from '@/lib/tourguide';

// Demo-only guided tour. Mounted from app/layout.tsx only when DEMO_MODE=1.
// Selectors below are verified against the real markup:
//   - `main h1`                       -> PageHero <h1> (present on /, /services, /placement-inquiry)
//   - `#field-contact_name`           -> LeadForm "Name" input (components/lead-form.tsx -> id={`field-${name}`})
//   - `main form button[type=submit]` -> LeadForm submit button (components/ui.tsx Button renders <button type="submit">)
// The tourguide skips any missing selector gracefully and uses `route` to hop pages.
export function DemoTourguide() {
  useEffect(() => {
    mountTourguide({
      siteSlug: 'group-home',
      adminUrl: '/admin',
      steps: [
        {
          route: '/',
          selector: 'main h1',
          title: 'welcome home',
          body: 'this is the public marketing site for a care home. everything here is live and editable — poke around.'
        },
        {
          route: '/services',
          selector: 'main h1',
          title: 'the services',
          body: 'each service has its own page with details, faqs, and calls to action that push visitors toward an inquiry.'
        },
        {
          route: '/placement-inquiry',
          selector: '#field-contact_name',
          title: 'placement inquiry',
          body: 'this is the money form. fill it out like a real family would — it writes a lead straight into the demo database.'
        },
        {
          route: '/placement-inquiry',
          selector: 'main form button[type="submit"]',
          title: 'submit a lead',
          body: 'hit submit and a real lead is created. email is stubbed in the demo, so nothing actually goes out.'
        },
        {
          route: '/placement-inquiry',
          selector: 'main h1',
          title: 'now the admin',
          body: 'every submission lands in the admin dashboard — leads, notes, email blasts, analytics. go take a look.'
        }
      ]
    });
  }, []);

  return null;
}

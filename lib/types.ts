export type LeadSubmitPayload = {
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  company_name: string;
  message: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  active: boolean;
  start_date?: string;
  end_date?: string;
  target_pages: string[];
  priority: number;
  created_at: string;
  updated_at: string;
};

export type PageBlock = {
  key: string;
  label: string;
  value: string;
  updated_at: string;
};

export type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  section: 'general' | 'our-home' | 'announcements';
  credit?: string;
};

export type Subscriber = {
  id: string;
  email: string;
  name?: string;
  source: string;
  opted_in: boolean;
  created_at: string;
};

export type LeadNote = {
  id: string;
  leadId: string;
  note: string;
  created_at: string;
};

export type LocalLead = {
  id: string;
  created_at: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  company_name: string;
  message: string;
  page_path?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  lead_type?: string;
  status: string;
  forwarded_to_leadops: boolean;
  leadops_forwarded_at?: string;
  leadops_error?: string;
  notes_count?: number;
};

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
  athome_family_services_llc: {
    Tables: {
      announcements: {
        Row: {
          id: string;
          title: string;
          body: string;
          active: boolean;
          start_date: string | null;
          end_date: string | null;
          target_pages: string[];
          priority: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['athome_family_services_llc']['Tables']['announcements']['Row']> & Pick<Database['athome_family_services_llc']['Tables']['announcements']['Row'], 'id' | 'title' | 'body'>;
        Update: Partial<Database['athome_family_services_llc']['Tables']['announcements']['Row']>;
        Relationships: [];
      };
      pages: {
        Row: { key: string; label: string; value: string; updated_at: string };
        Insert: Partial<Database['athome_family_services_llc']['Tables']['pages']['Row']> & Pick<Database['athome_family_services_llc']['Tables']['pages']['Row'], 'key' | 'label' | 'value'>;
        Update: Partial<Database['athome_family_services_llc']['Tables']['pages']['Row']>;
        Relationships: [];
      };
      gallery: {
        Row: {
          id: string;
          url: string;
          alt: string;
          section: string;
          credit: string | null;
          created_at: string;
        };
        Insert: Partial<Database['athome_family_services_llc']['Tables']['gallery']['Row']> & Pick<Database['athome_family_services_llc']['Tables']['gallery']['Row'], 'id' | 'url' | 'alt'>;
        Update: Partial<Database['athome_family_services_llc']['Tables']['gallery']['Row']>;
        Relationships: [];
      };
      subscribers: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          phone: string | null;
          source: string;
          opted_in: boolean;
          status: string;
          unsubscribed_at: string | null;
          bounced_at: string | null;
          complaint_at: string | null;
          unsubscribe_reason: string | null;
          archived_at: string | null;
          archived_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['athome_family_services_llc']['Tables']['subscribers']['Row']> & Pick<Database['athome_family_services_llc']['Tables']['subscribers']['Row'], 'id' | 'email' | 'source' | 'opted_in'>;
        Update: Partial<Database['athome_family_services_llc']['Tables']['subscribers']['Row']>;
        Relationships: [];
      };
      email_events: {
        Row: {
          id: string;
          email: string;
          type: string;
          meta: Json;
          created_at: string;
        };
        Insert: Partial<Database['athome_family_services_llc']['Tables']['email_events']['Row']>;
        Update: Partial<Database['athome_family_services_llc']['Tables']['email_events']['Row']>;
        Relationships: [];
      };
      email_campaigns: {
        Row: {
          id: string;
          subject: string;
          preview_text: string | null;
          body: string;
          audience_source: string | null;
          idempotency_key: string;
          status: string;
          sent_at: string | null;
          total_recipients: number;
          sent_count: number;
          skipped_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['athome_family_services_llc']['Tables']['email_campaigns']['Row']>;
        Update: Partial<Database['athome_family_services_llc']['Tables']['email_campaigns']['Row']>;
        Relationships: [];
      };
      email_campaign_recipients: {
        Row: {
          id: string;
          campaign_id: string;
          email: string;
          status: string;
          reason: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database['athome_family_services_llc']['Tables']['email_campaign_recipients']['Row']>;
        Update: Partial<Database['athome_family_services_llc']['Tables']['email_campaign_recipients']['Row']>;
        Relationships: [];
      };
      lead_notes: {
        Row: { id: string; lead_id: string; note: string; created_at: string; updated_at: string };
        Insert: Partial<Database['athome_family_services_llc']['Tables']['lead_notes']['Row']> & Pick<Database['athome_family_services_llc']['Tables']['lead_notes']['Row'], 'id' | 'lead_id' | 'note'>;
        Update: Partial<Database['athome_family_services_llc']['Tables']['lead_notes']['Row']>;
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          created_at: string;
          contact_name: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          company_name: string | null;
          message: string | null;
          page_path: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          utm_term: string | null;
          utm_content: string | null;
          referrer: string | null;
          lead_type: string | null;
          status: string | null;
          forwarded_to_leadops: boolean;
          leadops_forwarded_at: string | null;
          leadops_error: string | null;
          confirmation_sent_at: string | null;
          followup_sent_at: string | null;
          last_email_error: string | null;
          admin_notified_at: string | null;
          admin_notify_error: string | null;
          archived_at: string | null;
          archived_by: string | null;
        };
        Insert: Partial<Database['athome_family_services_llc']['Tables']['leads']['Row']>;
        Update: Partial<Database['athome_family_services_llc']['Tables']['leads']['Row']>;
        Relationships: [];
      };
      activity_events: {
        Row: {
          id: string;
          created_at: string;
          session_id: string | null;
          event_type: string;
          page_path: string | null;
          referrer: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          utm_term: string | null;
          utm_content: string | null;
          device: string | null;
          city: string | null;
          region: string | null;
          country: string | null;
          ip_hash: string | null;
          user_agent: string | null;
          cta_name: string | null;
          form_name: string | null;
        };
        Insert: Partial<Database['athome_family_services_llc']['Tables']['activity_events']['Row']>;
        Update: Partial<Database['athome_family_services_llc']['Tables']['activity_events']['Row']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type CmsSchemaName = 'athome_family_services_llc';

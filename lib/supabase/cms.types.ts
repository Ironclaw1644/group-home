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
          source: string;
          opted_in: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['athome_family_services_llc']['Tables']['subscribers']['Row']> & Pick<Database['athome_family_services_llc']['Tables']['subscribers']['Row'], 'id' | 'email' | 'source' | 'opted_in'>;
        Update: Partial<Database['athome_family_services_llc']['Tables']['subscribers']['Row']>;
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

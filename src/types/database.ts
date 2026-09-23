export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type RoleCategory =
  | "Founder" | "Investor" | "Operator" | "Consultant" | "Designer"
  | "Developer" | "Marketer" | "Freelancer" | "Other";

type City = { id: string; name: string; country_code: string; timezone: string; is_active: boolean; created_at: string; updated_at: string };
type Industry = { id: string; name: string; slug: string; created_at: string };
type Profile = {
  id: string; user_id: string; first_name: string; last_name: string; avatar_url: string;
  headline: string; company_name: string | null; working_on: string; role_category: RoleCategory;
  city_id: string; open_to_meet: boolean; linkedin_url: string | null; onboarding_completed: boolean;
  created_at: string; updated_at: string;
};
type ProfileIndustry = { profile_id: string; industry_id: string; created_at: string };

export type Database = {
  public: {
    Tables: {
      cities: { Row: City; Insert: Omit<City, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string }; Update: Partial<City>; Relationships: [] };
      industries: { Row: Industry; Insert: Omit<Industry, "id" | "created_at"> & { id?: string; created_at?: string }; Update: Partial<Industry>; Relationships: [] };
      profiles: { Row: Profile; Insert: Omit<Profile, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string }; Update: Partial<Profile>; Relationships: [] };
      profile_industries: { Row: ProfileIndustry; Insert: Omit<ProfileIndustry, "created_at"> & { created_at?: string }; Update: Partial<ProfileIndustry>; Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];

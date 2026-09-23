import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileInput } from "@/lib/profile-schema";

export async function getProfilePageData(includeProfile = false) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const [{ data: cities }, { data: industries }, profileResult] = await Promise.all([
    supabase.from("cities").select("*").eq("is_active", true).order("name"),
    supabase.from("industries").select("*").order("name"),
    includeProfile ? supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
  ]);
  if (!cities?.length) throw new Error("No active city is configured.");

  let initial: ProfileInput | undefined;
  const profile = profileResult.data;
  if (profile) {
    const { data: links } = await supabase.from("profile_industries").select("industry_id").eq("profile_id", profile.id);
    initial = {
      first_name: profile.first_name,
      last_name: profile.last_name,
      avatar_url: profile.avatar_url,
      headline: profile.headline,
      company_name: profile.company_name ?? "",
      working_on: profile.working_on,
      role_category: profile.role_category,
      city_id: profile.city_id,
      open_to_meet: profile.open_to_meet,
      linkedin_url: profile.linkedin_url ?? "",
      industry_ids: links?.map((link) => link.industry_id) ?? [],
    };
  }
  return { user, cities, industries: industries ?? [], profile, initial };
}

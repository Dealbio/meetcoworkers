"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profileSchema, type ProfileInput } from "@/lib/profile-schema";

export async function saveProfile(input: ProfileInput) {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Review your profile details." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session has expired. Please sign in again." };

  const { data: profileId, error } = await supabase.rpc("save_my_profile", {
    p_first_name: parsed.data.first_name,
    p_last_name: parsed.data.last_name,
    p_avatar_url: parsed.data.avatar_url,
    p_headline: parsed.data.headline,
    p_company_name: parsed.data.company_name ?? "",
    p_working_on: parsed.data.working_on,
    p_role_category: parsed.data.role_category,
    p_city_id: parsed.data.city_id,
    p_open_to_meet: parsed.data.open_to_meet,
    p_linkedin_url: parsed.data.linkedin_url,
    p_industry_ids: parsed.data.industry_ids,
  });

  if (error || !profileId) {
    console.error("Atomic profile save failed", error?.message);
    return { error: "We couldn't save your profile. Please try again." };
  }

  revalidatePath("/profile");
  revalidatePath("/home");
  return { success: true };
}

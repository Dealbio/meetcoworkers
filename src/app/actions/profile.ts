"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profileSchema, type ProfileInput } from "@/lib/profile-schema";

export async function saveProfile(input: ProfileInput) {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Review your profile details." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Your session has expired. Please sign in again." };
  }

  const {
    first_name,
    last_name,
    avatar_url,
    headline,
    company_name,
    working_on,
    role_category,
    city_id,
    open_to_meet,
    linkedin_url,
    industry_ids,
  } = parsed.data;

  const { error } = await supabase.rpc("save_my_profile", {
    p_first_name: first_name,
    p_last_name: last_name,
    p_avatar_url: avatar_url,
    p_headline: headline,
    p_company_name: company_name || null,
    p_working_on: working_on,
    p_role_category: role_category,
    p_city_id: city_id,
    p_open_to_meet: open_to_meet,
    p_linkedin_url: linkedin_url || null,
    p_industry_ids: industry_ids,
  });

  if (error) {
    console.error("Profile save failed", error.message);
    return { error: "We couldn't save your profile. Please try again." };
  }

  revalidatePath("/profile");
  revalidatePath("/home");
  return { success: true };
}

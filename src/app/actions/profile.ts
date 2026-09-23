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

  const { industry_ids, company_name, linkedin_url, ...fields } = parsed.data;
  const { data: profile, error } = await supabase.from("profiles").upsert({
    ...fields,
    user_id: user.id,
    company_name: company_name || null,
    linkedin_url: linkedin_url || null,
    onboarding_completed: true,
  }, { onConflict: "user_id" }).select("id").single();

  if (error || !profile) {
    console.error("Profile save failed", error?.message);
    return { error: "We couldn't save your profile. Please try again." };
  }

  const { error: deleteError } = await supabase.from("profile_industries").delete().eq("profile_id", profile.id);
  if (deleteError) {
    console.error("Industry reset failed", deleteError.message);
    return { error: "Your profile was saved, but industries could not be updated." };
  }
  const { error: insertError } = await supabase.from("profile_industries").insert(industry_ids.map((industry_id) => ({ profile_id: profile.id, industry_id })));
  if (insertError) {
    console.error("Industry save failed", insertError.message);
    return { error: "Your profile was saved, but industries could not be updated." };
  }

  revalidatePath("/profile");
  revalidatePath("/home");
  return { success: true };
}

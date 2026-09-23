import { ProfileForm } from "@/components/profile-form";
import { Brand } from "@/components/brand";
import { getProfilePageData } from "@/lib/profile-data";

export const metadata = { title: "Create your profile" };

export default async function OnboardingPage() {
  const { user, cities, industries, initial } = await getProfilePageData(true);
  return <main className="min-h-dvh bg-mist px-4 py-6 sm:py-10"><div className="mx-auto max-w-2xl"><div className="mb-7 flex justify-center"><Brand /></div><div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-soft sm:p-9"><h1 className="text-3xl font-semibold tracking-tight">Build your professional profile</h1><p className="mt-2 mb-8 text-ink/55">A few details help turn shared places into meaningful introductions.</p><ProfileForm userId={user.id} cities={cities} industries={industries} initial={initial} onboarding /></div></div></main>;
}

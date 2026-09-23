import Image from "next/image";
import { signOut } from "@/app/actions/auth";
import { ProfileForm } from "@/components/profile-form";
import { Button } from "@/components/ui/button";
import { getProfilePageData } from "@/lib/profile-data";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const { user, profile, initial, cities, industries } = await getProfilePageData(true);
  if (!profile || !initial) return null;
  return <div className="space-y-5"><section className="rounded-3xl border border-ink/10 bg-white p-5 shadow-soft sm:p-7"><div className="flex items-center gap-4"> <div className="relative size-20 overflow-hidden rounded-3xl bg-sand"><Image src={profile.avatar_url} alt={`${profile.first_name} ${profile.last_name}`} fill className="object-cover" unoptimized /></div><div><p className="text-xs font-bold uppercase tracking-[.14em] text-moss">Your profile</p><h1 className="mt-1 text-2xl font-semibold">{profile.first_name} {profile.last_name}</h1><p className="text-sm text-ink/55">{profile.headline}</p></div></div></section><section className="rounded-3xl border border-ink/10 bg-white p-5 sm:p-8"><div className="mb-7"><h2 className="text-xl font-semibold">Profile details</h2><p className="mt-1 text-sm text-ink/50">Keep your professional context current.</p></div><ProfileForm userId={user.id} cities={cities} industries={industries} initial={initial} /></section><form action={signOut} className="text-center"><Button variant="ghost">Sign out</Button></form></div>;
}

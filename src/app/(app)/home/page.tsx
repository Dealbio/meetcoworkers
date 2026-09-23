import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { getProfilePageData } from "@/lib/profile-data";

export const metadata = { title: "Home" };

export default async function HomePage() {
  const { profile } = await getProfilePageData(true);
  return <div className="space-y-5"><section className="overflow-hidden rounded-3xl bg-moss p-6 text-white shadow-soft sm:p-9"><p className="text-sm text-white/65">Welcome to Meet Coworkers</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Good to have you here, {profile?.first_name}.</h1><p className="mt-4 max-w-xl leading-7 text-white/75">Your professional profile is ready. In the next phase, you’ll be able to add the places where you regularly work.</p><Link href="/profile" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-moss">View your profile <ArrowRight className="size-4" /></Link></section><section className="rounded-3xl border border-ink/10 bg-white p-6"><div className="flex size-11 items-center justify-center rounded-2xl bg-sand text-moss"><MapPin className="size-5" /></div><h2 className="mt-5 text-xl font-semibold">Places bring the network to life</h2><p className="mt-2 max-w-lg leading-7 text-ink/55">Workplace communities and presence are intentionally not part of Phase 1. There’s no fake activity here—just your real profile, ready for what comes next.</p></section></div>;
}
